import { imageSizes, Indexable } from '@local/schema';
import { css } from '@emotion/core';

const pixelDensities = [1, 2, 3];

const pictureStyle = css({
  display: 'inline-block',
  overflow: 'hidden',
});

const imageStyle = css({
  display: 'block',
  height: '100%',
  width: '100%',
});

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  hash?: string;
  size: number;
  maxWidth: number;
  alt: string;
}

export function Image({ hash, height, size: width, maxWidth, alt, style, className, ...props }: ImageProps) {
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
    <picture key={hash} css={pictureStyle} style={{ ...style, height, width }} className={className}>
      <source type='image/webp' srcSet={webpSrcSet} />
      <source type='image/png' srcSet={pngSrcSet} />
      <img {...props} src={`${targets[0]?.image}.png`} alt={alt} css={imageStyle} />
    </picture>
  )
}

export interface EntityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  entity: Indexable;
  size: number;
  maxSize?: number;
}
export function EntityImage({ entity, size, maxSize = 256, ...props }: EntityImageProps) {
  return <Image {...props} height={size} size={size} hash={entity.icon} maxWidth={maxSize} alt={entity.name} />;
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
