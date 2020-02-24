#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import { EntityKind } from '@local/schema';
import * as parsing from '@local/parsing';

const DATA_ROOT = path.resolve(__dirname, '..', 'static', 'data');
const ASSETS = path.resolve(__dirname, '..', 'static', 'assets');
const COMMUNITY_RESOURCES = path.resolve(__dirname, '..', '.community-resources');

main(process.argv[2]);
async function main(version: string) {
  const destination = path.join(DATA_ROOT, version);
  fs.rmdirSync(destination, { recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  const debugDestination = path.join(destination, 'debug');
  fs.mkdirSync(path.join(debugDestination), { recursive: true });

  const communityResources = new parsing.FileSystem(COMMUNITY_RESOURCES);
  const assets = new parsing.FileSystem(ASSETS)

  const headerDb = new parsing.HeaderDatabase(communityResources);
  await headerDb.load();
  
  const entityDb = new parsing.EntityDatabase(communityResources, headerDb);
  await entityDb.load();

  const assetDb = new parsing.AssetDatabase(communityResources, assets);
  const outputDb = new parsing.OutputDatabase();

  await parsing.fillItems(outputDb, entityDb, assetDb);
  await parsing.fillBuildings(outputDb, entityDb, assetDb);
  await parsing.fillRecipes(outputDb, entityDb, assetDb);
  await parsing.fillSchematics(outputDb, entityDb);

  await parsing.fillStaticEntries(outputDb);

  // Debug data.
  fs.writeFileSync(path.join(debugDestination, 'entityDb.json'), JSON.stringify(entityDb, null, 2));
  fs.writeFileSync(path.join(debugDestination, 'outputDb.json'), JSON.stringify(outputDb, null, 2));

  // Final data
  fs.writeFileSync(path.join(destination, `items.json`), JSON.stringify(outputDb.getAllByKind(EntityKind.Item), null, 2));
  fs.writeFileSync(path.join(destination, `buildings.json`), JSON.stringify(outputDb.getAllByKind(EntityKind.Building), null, 2));
  fs.writeFileSync(path.join(destination, `recipes.json`), JSON.stringify(outputDb.getAllByKind(EntityKind.Recipe), null, 2)); 
  fs.writeFileSync(path.join(destination, `schematics.json`), JSON.stringify(outputDb.getAllByKind(EntityKind.Schematic), null, 2)); 
}
