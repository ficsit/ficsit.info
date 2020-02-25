import { imageSizes } from '@local/schema';

export interface ImageProps {
  hash?: string;
  size: number;
  alt: string;
}

export function Image({ hash, size, alt }: ImageProps) {
  const targetSizes = imageSizes
    .filter(targetSize => targetSize <= size)
    .sort((a, b) => b - a);

  const sources = targetSizes.flatMap(targetSize => {
    const basePath = `/assets/images/${hash}.${targetSize}`;

    return [
      <source type='image/webp' src={`${basePath}.webp`} />,
      <source type='image/png' src={`${basePath}.png`} />,
    ];
  });

  return (
    <picture>
      {sources}
      <img src={`/assets/images/${hash}.${targetSizes[0]}.png`} alt={alt} />
    </picture>
  )
}
