#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import * as parsing from '@local/parsing';

const DATA_ROOT = path.resolve(__dirname, '..', 'static', 'data');
const ASSETS = path.resolve(__dirname, '..', 'static', 'assets');
const COMMUNITY_RESOURCES = path.resolve(__dirname, '..', '.community-resources');

main(process.argv[2]);
async function main(version: string) {
  const destinationPath = path.join(DATA_ROOT, version);
  fs.rmdirSync(destinationPath, { recursive: true });

  const destination = new parsing.FileSystem(destinationPath);
  const assets = new parsing.FileSystem(ASSETS);

  const headerDb = new parsing.HeaderDatabase(new parsing.FileSystem(COMMUNITY_RESOURCES, 'headers'));
  await headerDb.load();

  const entityDb = new parsing.EntityDatabase(new parsing.FileSystem(COMMUNITY_RESOURCES, 'data'), headerDb);
  await entityDb.load();

  const assetDb = new parsing.AssetDatabase(
    new parsing.FileSystem(COMMUNITY_RESOURCES, 'assets', 'Game', 'FactoryGame'),
    assets,
  );
  const outputDb = new parsing.OutputDatabase();

  await parsing.fillItems(outputDb, entityDb, assetDb);
  await parsing.fillBuildings(outputDb, entityDb, assetDb);
  await parsing.fillRecipes(outputDb, entityDb);
  await parsing.fillSchematics(outputDb, entityDb);

  await parsing.fillStaticEntries(outputDb, assetDb);

  // Final data
  await Promise.all([
    destination.writeJson(outputDb.getAllByType('entity'), 'entities.json'),
    destination.writeJson(outputDb.getAllByType('recipe'), 'recipes.json'),
    destination.writeJson(outputDb.getAllByType('schematic'), 'schematics.json'),
  ]);
}
