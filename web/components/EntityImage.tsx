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

  return <Image {...props} key={entity.slug} paths={paths} alt={entity.name} height={size} width={size} />;
}

export interface ItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  item: Indexable;
  size: number;
}
export function ItemImage({ item, size: width, ...props }: ItemImageProps) {
  return <EntityImage {...props} entity={item} size={width} maxSize={256} />;
}

export interface BuildingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  building: Indexable;
  size: number;
}
export function BuildingImage({ building, size: width, ...props }: BuildingImageProps) {
  return <EntityImage {...props} entity={building} size={width} maxSize={512} />;
}
