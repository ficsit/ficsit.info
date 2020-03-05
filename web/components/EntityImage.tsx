import { pixelDensities, Entity, entityMaxIconSize } from '@local/schema';

import { Image, ImagePaths } from './Image';

export interface EntityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  entity: Entity;
  size: number;
}
export function EntityImage({ entity, size, ...props }: EntityImageProps) {
  const paths = _pathsForEntity(size, entity);

  return <Image {...props} key={entity.slug} paths={paths} title={entity.name} alt={entity.name} height={size} width={size} />;
}

function _pathsForEntity(size: number, entity: Entity) {
  const maxSize = entityMaxIconSize[entity.kind];
  const paths = {} as ImagePaths;
  const basePath = `/assets/icons/${entity.icon}`;
  for (const density of pixelDensities) {
    const imageSize = size * density;
    if (imageSize > maxSize) break;
    paths[`${density}x`] = {
      webp: `${basePath}.${imageSize}.webp`,
      png: `${basePath}.${imageSize}.png`,
    };
  }

  return paths;
}
