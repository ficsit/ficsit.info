import { useEntityData } from './entities';
import { useRecipeData } from './recipes';
import { useSchematicData } from './schematics';

const categories = {
  entities: useEntityData,
  recipes: useRecipeData,
  schematics: useSchematicData,
};
type Category = keyof typeof categories;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', async event => {
    if (event.data.meta !== 'workbox-broadcast-update') return;
    if (event.data.payload.cacheName !== 'data') return;
    const { updatedURL } = event.data.payload;
    const match = /\/([^/]+)\/([^/.]+)\.json$/.exec(updatedURL);
    if (!match) return;

    const [, version, category] = match;
    console.log(`data updated:`, { version, category });

    if (category in categories) {
      categories[category as Category].invalidate();
    }
  });
}
