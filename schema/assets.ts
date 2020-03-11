import { EntityKind } from './Entity';

/**
 * We scale all images to support these pixel densities.
 */
export const pixelDensities = [1, 2, 3];

/**
 * The size of an icon when presented inline with text.
 */
export const inlineIconSize = 24;

/**
 * The size of an icon when presented as a standalone navigation button.
 */
export const navButtonIconSize = 32;

/**
 * The size of an icon when presented in a navigation list.
 */
export const navListIconSize = 48;

/**
 * The size of an icon when presented as a poster in entity details.
 */
export const entityPosterIconSizes: Record<EntityKind, number> = {
  [EntityKind.Building]: 256,
  [EntityKind.Item]: 128,
};

/**
 * The maximum size (in px, not dp) of an icon.
 */
export const entityMaxIconSize: Record<EntityKind, number> = {
  [EntityKind.Building]: 512,
  [EntityKind.Item]: 256,
};
