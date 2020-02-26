import { imageSizes, Indexable } from '@local/schema';
import { css } from '@emotion/core';

const pixelDensities = [1, 2, 3];

const imageStyle = css({
  display: 'inline-block',
  overflow: 'hidden',
});

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  hash?: string;
  width: number;
  maxWidth: number;
  alt: string;
}

export function Image({ hash, height, width, maxWidth, alt, ...props }: ImageProps) {
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
    <picture key={hash}>
      <source type='image/webp' srcSet={webpSrcSet} />
      <source type='image/png' srcSet={pngSrcSet} />
      <img {...props} src={`${targets[0]?.image}.png`} alt={alt} height={height}  width={width} css={imageStyle} />
    </picture>
  )
}

export interface EntityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  entity: Indexable;
  width: number;
  maxWidth?: number;
}
export function EntityImage({ entity, width, maxWidth = 256, ...props }: EntityImageProps) {
  return <Image {...props} height={width} width={width} hash={entity.icon} maxWidth={maxWidth} alt={entity.name} />;
}

export interface ItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  item: Indexable;
  width: number;
}
export function ItemImage({ item, width, ...props }: ItemImageProps) {
  return <EntityImage {...props} entity={item} width={width} maxWidth={256} />;
}

export interface BuildingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  building: Indexable;
  width: number;
}
export function BuildingImage({ building, width, ...props }: BuildingImageProps) {
  return <EntityImage {...props} entity={building} width={width} maxWidth={256} />;
}
