import { css } from '@emotion/core';
import { Recipe, ItemAmount, AnyEntity, ItemForm } from '@local/schema';

import { ItemCount } from '~/components/ItemCount';
import { useEntities } from '~/data';
import { colors, sizing } from '~/style';

import { EntityReference } from './EntityReference';
import { Rate } from './Rate';

const contentStyles = css({
  display: 'grid',
  gridColumnGap: sizing.Padding.Medium,
  gridRowGap: sizing.Padding.Medium,
  gridTemplateColumns: `
    [before] min-content [ingredients] max-content [arrow] max-content [products] max-content [after] 1fr
  `,
});

const recipeTitleStyles = css({
  gridColumn: '1 / -1',
  margin: 0,
  fontWeight: 'lighter',
  borderTop: `1px solid ${colors.Light.N100}`,
  paddingTop: sizing.Padding.Medium,
  '&:first-of-type': {
    paddingTop: 0,
    border: 'none',
  },
});

const ingredientsStyles = css({
  display: 'flex',
  gridColumn: 'ingredients',
  justifyContent: 'flex-end',
});

const arrowStyles = css({
  display: 'flex',
  gridColumn: 'arrow',
  alignItems: 'center',
  fontSize: 24,
  color: colors.Light.N400,
  paddingLeft: 3,
});

const productsStyles = css({
  display: 'flex',
  gridColumn: 'products',
});

const beforeStyles = css({
  gridColumn: 'before',
});

const afterStyles = css({
  gridColumn: 'after',
});

const entityStyles = css({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: sizing.Padding.Medium,
  '&:first-of-type': {
    marginLeft: 0,
  },
});

export interface Extraction {
  item: string;
  building: string;
}

export interface ExtractionDetails {
  kind: 'extraction';
  slug: string;
  name: string;
  duration: number;
}

export interface RecipeTableProps {
  extractions?: Extraction[];
  recipes?: Recipe[];
  renderTitle?: (recipe: Recipe | ExtractionDetails) => React.ReactNode;
  renderBefore?: (recipe: Recipe | ExtractionDetails) => React.ReactNode;
  renderAfter?: (recipe: Recipe | ExtractionDetails) => React.ReactNode;
  showCounts?: boolean;
  showRates?: boolean | ((recipe: Recipe | ExtractionDetails) => number);
  size?: number;
}

export function RecipeTable(props: RecipeTableProps) {
  const entities = useEntities();
  if (!entities) return null;
  const { recipes, extractions } = props;

  return (
    <div css={contentStyles}>
      {extractions && extractions.map(e => _renderExtraction(e, props, entities))}
      {recipes && recipes.map(r => _renderRecipe(r, props, entities))}
    </div>
  );
}

function _renderExtraction(
  { building, item }: Extraction,
  props: RecipeTableProps,
  entities: Record<string, AnyEntity>,
) {
  const buildingData = entities[building];
  if (!buildingData || buildingData.kind !== 'building' || !buildingData.extraction) return null;
  const { cycleTime, itemsPerCycle } = buildingData.extraction;

  const details: ExtractionDetails = {
    kind: 'extraction',
    name: `Extraction: ${buildingData.name}`,
    duration: cycleTime,
    slug: building,
  };
  const amount: ItemAmount = { item, count: itemsPerCycle };
  const title = props.renderTitle ? props.renderTitle(details) : details.name;

  return (
    <React.Fragment key={`${building}-${item}`}>
      {!!title && <span css={recipeTitleStyles}>{title}</span>}
      {!!props.renderBefore && <div css={beforeStyles}>{props.renderBefore(details)}</div>}
      <div css={ingredientsStyles}>
        <EntityReference slug={building} size={props.size} />
      </div>
      {_renderArrow(props.size)}
      <div css={productsStyles}>
        {_renderEntity(details, entities[item], amount, {
          ...props,
          showCounts: false,
        })}
        {!!props.renderAfter && <div css={afterStyles}>{props.renderAfter(details)}</div>}
      </div>
    </React.Fragment>
  );
}

function _renderRecipe(recipe: Recipe, props: RecipeTableProps, entities: Record<string, AnyEntity>) {
  const title = props.renderTitle ? props.renderTitle(recipe) : recipe.name;

  return (
    <React.Fragment key={recipe.slug}>
      {!!title && <span css={recipeTitleStyles}>{title}</span>}
      {!!props.renderBefore && <div css={beforeStyles}>{props.renderBefore(recipe)}</div>}
      <div css={ingredientsStyles}>
        {recipe.ingredients.map(i => _renderEntity(recipe, entities[i.item], i, props))}
      </div>
      {_renderArrow(props.size)}
      <div css={productsStyles}>
        {recipe.products.map(i => _renderEntity(recipe, entities[i.item], i, props))}
        {!!props.renderAfter && <div css={afterStyles}>{props.renderAfter(recipe)}</div>}
      </div>
    </React.Fragment>
  );
}

function _renderEntity(
  recipe: Recipe | ExtractionDetails,
  entity: AnyEntity | undefined,
  { item, count }: ItemAmount,
  { size, showCounts = false, showRates = false }: RecipeTableProps,
) {
  const { duration } = recipe;
  let multiple = 1.0;
  if (typeof showRates === 'function') {
    multiple = showRates(recipe);
  }

  const isLiquid = entity && 'form' in entity && entity.form === ItemForm.Liquid;

  return (
    <div key={item} css={entityStyles}>
      <ItemCount slug={item} count={showCounts && count} size={size} />
      {!!showRates && <Rate rate={{ count, duration, multiple }} isLiquid={isLiquid} />}
    </div>
  );
}

function _renderArrow(size?: number) {
  const itemHeight = (size || sizing.navButtonIconSize) + sizing.Padding.Small * 2;

  return (
    <div css={arrowStyles} style={{ height: itemHeight }}>
      ➤
    </div>
  );
}

export function isExtraction(value: Recipe | ExtractionDetails): value is ExtractionDetails {
  return (value as any).kind === 'extraction';
}
