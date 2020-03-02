import { imageSizes, Indexable } from '@local/schema';

import { Image, ImagePaths } from './Image';

const pixelDensities = [1, 2, 3];

export interface EntityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  entity: Indexable;
  size: number;
  maxSize?: number;
}
export function EntityImage({ entity, size, maxSize = 256, ...props }: EntityImageProps) {
  const basePath = `/assets/icons/${entity.icon}`;
  const paths = {} as ImagePaths;
  for (const density of pixelDensities) {
    const imageSize = imageSizes.find(s => s <= maxSize && s >= size * density);
    if (!imageSize) break;
    paths[`${density}x`] = {
      webp: `${basePath}.${imageSize}.webp`,
      png: `${basePath}.${imageSize}.png`,
    };
  }

  return <Image {...props} key={entity.slug} paths={paths} title={entity.name} alt={entity.name} height={size} width={size} />;
}
