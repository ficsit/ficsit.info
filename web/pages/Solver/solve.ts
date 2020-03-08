import { Recipe, Item, AnyEntity } from '@local/schema';
import {
  Solver,
  Variable,
  Expression,
  Constraint,
  Operator,
  Strength,
} from 'kiwi.js';

export interface SolverOptions {
  targets: ItemRate[];
  constraints?: SolverConstraint[];
  optimizeResiduals?: boolean;
  includeAlternateRecipes?: boolean;
}

export const enum SolverConstraintSubjectKind {
  Resource = 'resource',
}

export const enum SolverConstraintType {
  Maximum = 'max',
}

export interface SolverConstraint {
  subject: {
    kind: SolverConstraintSubjectKind;
    slug: string;
  };
  type: SolverConstraintType;
  value: number;
}

export interface SolverResult {
  inputs: ItemRate[];
  outputs: ItemRate[];
  recipes: { slug: string; multiple: number }[];
  residuals: ItemRate[];
}

export interface ItemRate {
  slug: string;
  perMinute: number;
}

export function solveFor(
  recipes?: Record<string, Recipe>,
  entities?: Record<string, AnyEntity>,
  options?: SolverOptions,
): SolverResult | undefined {
  if (!recipes || !entities || !options) return;

  const context = new SolverContext(recipes, entities, options);

  _addResources(context);
  _addRecipes(context);
  _addExpressions(context);
  _addConstraints(context);

  context.solver.updateVariables();

  if (options?.optimizeResiduals) {
    _optimizeResiduals(context);
  }

  return {
    inputs: _collectInputResults(context),
    recipes: _collectRecipeResults(context),
    ..._collectOutputResults(context),
  };
}

function _addResources(context: SolverContext) {
  for (const { slug } of context.resources) {
    const variable = context.variable(VariableKind.Resource, slug);
    context.addTo(ExpressionKind.Item, slug, variable);
  }
}

function _addRecipes(context: SolverContext) {
  for (const {
    duration,
    slug,
    ingredients,
    products,
    producedIn,
  } of context.recipes) {
    const runsPerMin = 60 / duration;

    const variable = context.variable(VariableKind.Recipe, slug);
    context.addConstraint(variable, Operator.Ge, 0, Strength.required);

    // When we're trying to optimize away residuals, we bias towards recipes
    // that have a target product, by minimizing recipes that don't.
    if (context.options.optimizeResiduals) {
      const hasTargetProduct = products.some(({ item }) =>
        context.targets.has(item),
      );

      context.solver.addEditVariable(
        variable,
        hasTargetProduct ? Strength.strong : Strength.medium,
      );
    }

    // TODO: Drop this?
    context.addTo(ExpressionKind.Machine, producedIn[0], variable);

    for (const { count, item } of ingredients) {
      const expression = variable.multiply(-count * runsPerMin);
      context.addTo(ExpressionKind.Item, item, expression);
    }

    for (const { count, item } of products) {
      const expression = variable.multiply(count * runsPerMin);
      context.addTo(ExpressionKind.Item, item, expression);
    }
  }
}

function _addExpressions(context: SolverContext) {
  for (const [slug, expression] of context.getExpressions(
    ExpressionKind.Item,
  )) {
    const target = context.targets.get(slug);
    if (target) {
      context.addConstraint(expression, Operator.Eq, target, Strength.required);
    } else {
      context.addConstraint(expression, Operator.Ge, 0, Strength.required);
    }
  }
}

function _addConstraints(context: SolverContext) {
  const { constraints } = context.options;
  if (!constraints) return;

  for (const constraint of constraints) {
    const { subject, type, value } = constraint;
    let expression: Expression | Variable | undefined;
    let operator: Operator | undefined;
    let strength: number | undefined;
    if (subject.kind === SolverConstraintSubjectKind.Resource) {
      expression = context.variable(VariableKind.Resource, subject.slug);
    }

    if (type === SolverConstraintType.Maximum) {
      operator = Operator.Le;
      strength = Strength.required;
    }

    if (!expression || operator === undefined || strength === undefined) {
      throw new Error(`Invalid constraint: ${JSON.stringify(constraint)}`);
    }

    console.log(
      `adding constraint: ${expression} ${operator} ${value} ${strength}`,
    );
    context.addConstraint(expression, operator, value, strength);
  }
}

function _optimizeResiduals(context: SolverContext) {
  const { residuals } = _collectOutputResults(context);
  if (!residuals.length) return;

  // TODO: Should we try multiple rounds?
  for (const residual of residuals) {
    const expression = context.expression(ExpressionKind.Item, residual.slug);
    context.addConstraint(expression, Operator.Eq, 0, Strength.required);
  }

  context.solver.updateVariables();
}

function _collectInputResults(context: SolverContext) {
  const result = [];
  for (const { slug } of context.resources) {
    const value = _round(context.variable(VariableKind.Resource, slug).value());
    if (value === 0) continue;
    result.push({ slug, perMinute: value });
  }

  return result;
}

function _collectRecipeResults(context: SolverContext) {
  const result = [];
  for (const [slug, variable] of context.getVariables(VariableKind.Recipe)) {
    const value = _round(variable.value());
    if (value === 0) continue;
    result.push({ slug, multiple: value });
  }

  return result;
}

function _collectOutputResults(context: SolverContext) {
  const outputs = [];
  const residuals = [];

  for (const [slug, expression] of context.getExpressions(
    ExpressionKind.Item,
  )) {
    const value = _round(expression.value());
    if (value === 0) continue;

    if (context.targets.has(slug)) {
      outputs.push({ slug, perMinute: value });
    } else {
      residuals.push({ slug, perMinute: value });
    }
  }

  return { outputs, residuals };
}

const enum VariableKind {
  Resource = 'resource',
  Recipe = 'recipe',
}

const enum ExpressionKind {
  Item = 'item',
  Machine = 'machine',
}

export class SolverContext {
  constructor(
    private _recipesBySlug: Record<string, Recipe>,
    private _entitiesBySlug: Record<string, AnyEntity>,
    public options: SolverOptions,
  ) {}

  public solver = new Solver();
  public targets = new Map(
    this.options.targets.map(({ slug, perMinute: perMin }) => [slug, perMin]),
  );
  public recipes = Object.values(this._recipesBySlug).filter(recipe => {
    if (!recipe.producedIn.length) return false;
    if (!this.options.includeAlternateRecipes && recipe.alternate) return false;
    return true;
  });
  public resources = Object.values(this._entitiesBySlug).filter(
    entity => entity.kind === 'item' && entity.raw,
  ) as Item[];

  private _variablesByKindBySlug = new Map<
    VariableKind,
    Map<string, Variable>
  >();
  private _expressionsByKindBySlug = new Map<
    ExpressionKind,
    Map<string, Expression>
  >();

  variable(kind: VariableKind, slug: string) {
    if (!this._variablesByKindBySlug.has(kind))
      this._variablesByKindBySlug.set(kind, new Map());
    const bySlug = this._variablesByKindBySlug.get(kind)!;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, new Variable(`[${kind}] ${slug}`));
    }

    return bySlug.get(slug)!;
  }

  expression(kind: ExpressionKind, slug: string) {
    if (!this._expressionsByKindBySlug.has(kind))
      this._expressionsByKindBySlug.set(kind, new Map());
    const bySlug = this._expressionsByKindBySlug.get(kind)!;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, new Expression());
    }

    return bySlug.get(slug)!;
  }

  addTo(
    kind: ExpressionKind,
    slug: string,
    value: Variable | Expression | number,
  ) {
    const expression = this.expression(kind, slug);
    const bySlug = this._expressionsByKindBySlug.get(kind)!;
    bySlug.set(slug, expression.plus(value));
  }

  addConstraint(
    expression: Expression | Variable,
    operator: Operator,
    value: number,
    strength: number,
  ) {
    const constraint = new Constraint(expression, operator, value, strength);
    this.solver.addConstraint(constraint);
    return constraint;
  }

  getVariables(kind: VariableKind) {
    return this._variablesByKindBySlug.get(kind) || new Map<string, Variable>();
  }

  getExpressions(kind: ExpressionKind) {
    return (
      this._expressionsByKindBySlug.get(kind) || new Map<string, Expression>()
    );
  }
}

const _roundPrecision = 2 ** 24;

function _round(value: number) {
  return Math.round(value * _roundPrecision) / _roundPrecision;
}
