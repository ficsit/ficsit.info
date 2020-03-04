import { imageSizes, Indexable } from '@local/schema';

import { Image, ImagePaths } from './Image';

const pixelDensities = [1, 2, 3];

export interface EntityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  entity: Indexable;
  size: number;
  maxSize?: number;
}
export function EntityImage({ entity, size, maxSize = 256, ...props }: EntityImageProps) {
  const paths = _pathsForEntity(maxSize, size, entity);

  return <Image {...props} key={entity.slug} paths={paths} title={entity.name} alt={entity.name} height={size} width={size} />;
}

function _pathsForEntity(maxSize: number, size: number, entity: Indexable) {
  const paths = {} as ImagePaths;
  const basePath = `/assets/icons/${entity.icon}`;
  for (const density of pixelDensities) {
    const imageSize = imageSizes.find(s => s <= maxSize && s >= size * density);
    if (!imageSize) break;
    paths[`${density}x`] = {
      webp: `${basePath}.${imageSize}.webp`,
      png: `${basePath}.${imageSize}.png`,
    };
  }

  return paths;
}
