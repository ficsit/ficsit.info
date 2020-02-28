import { css } from '@emotion/core';

const pictureStyle = css({
  display: 'inline-block',
  overflow: 'hidden',
});

const imageStyle = css({
  display: 'block',
  height: '100%',
  width: '100%',
});

export type ImagePaths = Record<string, Record<string, string>>;

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  paths: ImagePaths;
  alt: string;
  height: number;
  width: number;
}

export function Image({ paths, alt, height, width, style, className, ...props }: ImageProps) {
  const srcSets = _collectSrcSets(paths);

  return (
    <picture css={pictureStyle} style={{ ...style, height, width }} className={className}>
      {Object.entries(srcSets).map(([format, srcSet]) =>
        <source key={format} type={`image/${format}`} srcSet={srcSet.join(', ')} />
      )}
      <img {...props} src={paths['1x']['png']} decoding='async' alt={alt} css={imageStyle} />
    </picture>
  )
}

function _collectSrcSets(paths: ImagePaths) {
  const srcSets = { webp: [], png: [] } as Record<string, string[]>;
  for (const [scale, variations] of Object.entries(paths)) {
    for (const [format, url] of Object.entries(variations)) {
      srcSets[format].push(`${url} ${scale}`);
    }
  }

  return srcSets;
}
