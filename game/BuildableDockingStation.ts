import { BuildableFactorySchema } from './BuildableFactory';
import { declareClass, declareFloat, DeclarationShape, declareInteger, declareString } from './declare';

/**
 * Schema for `FGBuildableDockingStation`.
 *
 * Base class for docking stations in the game, this is a load/unload station
 * depending on the conveyor connections given.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableDockingStation.h
 */
export const BuildableDockingStationSchema = declareClass(
  'FGBuildableDockingStation',
  BuildableFactorySchema,
  {
    mFuelTransferSpeed: declareFloat(),
    mMapText: declareString(),
    mStackTransferSize: declareFloat(),
    mStorageSizeX: declareInteger(),
    mStorageSizeY: declareInteger(),
    mTransferSpeed: declareFloat(),
  },
);

export type BuildableDockingStation = DeclarationShape<typeof BuildableDockingStationSchema>;
