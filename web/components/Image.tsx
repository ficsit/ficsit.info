import { imageSizes, Indexable } from '@local/schema';

const pixelDensities = [1, 2, 3];

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  hash?: string;
  width: number;
  maxWidth: number;
  alt: string;
}

export function Image({ hash, width, maxWidth, alt, ...props }: ImageProps) {
  const basePath = `/assets/images/${hash}`;
  // Chrome is dumb and likes choosing larger (256px+ images) even when it
  // doesn't need to.
  const targets = pixelDensities
    .map(density => {
      const imageSize = imageSizes.find(size => size <= maxWidth && size >= width * density);
      if (!imageSize) return;
      return { image: `${basePath}.${imageSize}`, density: `${density}x` };
    })
    .filter(function <T>(target: T | undefined): target is T { return !!target });

  const webpSrcSet = targets.map(({ image, density }) => `${image}.webp ${density}`).join(', ');
  const pngSrcSet = targets.map(({ image, density }) => `${image}.png ${density}`).join(', ');

  return (
    <picture>
      <source type='image/webp' srcSet={webpSrcSet} />
      <source type='image/png' srcSet={pngSrcSet} />
      <img {...props} src={`${targets[0]?.image}.png`} alt={alt} width={width} />
    </picture>
  )
}

export interface ItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  item: Indexable;
  width: number;
}
export function ItemImage({ item, ...props }: ItemImageProps) {
  return <Image {...props} hash={item.icon} maxWidth={256} alt={item.name} />;
}

export interface BuildingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  building: Indexable;
  width: number;
}
export function BuildingImage({ building, ...props }: BuildingImageProps) {
  return <Image {...props} hash={building.icon} maxWidth={512} alt={building.name} />;
}
