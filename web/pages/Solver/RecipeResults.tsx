import { SolverResult } from './solve';
import { useRecipes } from '~/data';
import { RecipeTable } from '~/components/RecipeTable';
import { sizing } from '~/style';

export interface RecipeResultsProps {
  result: SolverResult;
}

export function RecipeResults({ result }: RecipeResultsProps) {
  const recipes = useRecipes();
  if (!recipes) return null;

  const recipesToList = result.recipes.map(({ slug }) => recipes[slug]);
  const multiples = new Map(
    result.recipes.map(({ slug, multiple }) => [slug, multiple] as const),
  );

  return (
    <div>
      <RecipeTable
        recipes={recipesToList}
        renderTitle={({ slug, name }) =>
          `[${multiples.get(slug)?.toFixed(2)}x] ${name}`
        }
        showRates={({ slug }) => multiples.get(slug)!}
        size={sizing.navListIconSize}
      />
    </div>
  );
}
