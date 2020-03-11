import { useEntityData } from './entities';
import { useRecipeData } from './recipes';
import { useSchematicData } from './schematics';
import { useVersionsData } from './versions';

const categories = {
  entities: useEntityData,
  recipes: useRecipeData,
  schematics: useSchematicData,
};
type Category = keyof typeof categories;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    (async () => {
      if (event.data.meta !== 'workbox-broadcast-update') return;
      if (event.data.payload.cacheName !== 'data') return;
      const { updatedURL } = event.data.payload;

      if (updatedURL.endsWith('/versions.json')) {
        useVersionsData.invalidate();
        return;
      }

      const match = /\/([^/]+)\/([^/.]+)\.json$/.exec(updatedURL);
      if (!match) return;

      const [, version, category] = match;
      console.log(`data updated:`, { version, category });

      if (category in categories) {
        categories[category as Category].invalidate();
      }
    })().catch(error => {
      console.error(error);
    });
  });
}
