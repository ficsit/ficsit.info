import { inlineIconSize, navButtonIconSize, navListIconSize, pixelDensities, EntityKind, entityPosterIconSizes, entityMaxIconSize } from '@local/schema';
import { imageHash } from '@lolpants/image-hash';
import * as base62 from 'base62';
import * as crypto from 'crypto';
import sharp from 'sharp';

import { assetMap } from './assetMap';
import { FileSystem } from './FileSystem';
import { EntityDatabase } from './EntityDatabase';

const commonImageSizes = [
  inlineIconSize,
  navButtonIconSize,
  navListIconSize,
];

/**
 * A container for assets (e.g. images) and metadata about them.
 */
export class AssetDatabase {
  private _found = {} as Record<string, string>;

  constructor(private _resources: FileSystem, private _output: FileSystem) {}

  async findLargestEntityIcon({ entity }: EntityDatabase.Info): Promise<string | undefined> {
    const baseName = /^[^_]+_(.+)_C$/.exec(entity.ClassName)![1]
      .replace(/([^_])(Mk\d)$/, '$1_$2');

    return await this._findLargestEntityIcon(baseName, (entity as any).mDisplayName);
  }

  async _findLargestEntityIcon(baseName: string, name: string) {
    if (!this._found[baseName]) {
      const basePath = assetMap[baseName];
      if (!basePath) {
        console.warn(`No asset path for ${baseName} (${name}), please add it to parsing/state/assetMap`);
        return undefined;
      }
  
      const paths = await this._resources.glob(`${basePath}_+([0-9]).png`);
      const foundPath = paths.sort((a, b) => _iconSize(b) - _iconSize(a))[0];
      if (!foundPath) {
        console.warn(`Expected assets for ${baseName} to exist at ${basePath}, but found none`);
      }
      this._found[baseName] = foundPath;
    }

    return this._found[baseName];
  }

  async saveEntityIcon(sourcePath: string, kind: EntityKind): Promise<string> {
    const sizes = _expandSizes(kind);
    const source = await this._resources.readBuffer(sourcePath);
    const hash = _hashImage(source);
    const image = sharp(source);

    await Promise.all(sizes.flatMap(size => {
      const resized = image.clone().resize(size, size, { fit: 'cover' });
      return [
        this._writeImage(resized, `${hash}.${size}.png`),
        this._writeImage(resized, `${hash}.${size}.webp`),
      ];
    }));

    return hash;
  }

  async _writeImage(image: sharp.Sharp, baseName: string) {
    const path = this._output.path('icons', baseName)
    if (await this._output.readable(path)) return;

    await this._output.mkdirFor(path);
    image = image.clone();

    if (baseName.endsWith('.png')) {
      image = image.png({ 
        // We get a decent amount (~5%) of additional compression from this.
        adaptiveFiltering: true,
      });
    } else if (baseName.endsWith('.webp')) {
      image = image.webp({
        quality: 60,
        nearLossless: true,
        reductionEffort: 6,
      });
    } else {
      throw new Error(`Unknown format ${baseName}`);
    }

    await image.toFile(path);
  }
}

function _iconSize(iconPath: string) {
  const match = /_(\d+)\.png$/.exec(iconPath);
  return match ? parseInt(match[1]) : 0;
}

function _hashImage(image: Buffer) {
  const hashBase16 = crypto
    .createHash('sha256')
    .update(imageHash(image, true, 32))
    .digest('hex');

  // crunch it down.
  return [hashBase16.slice(0, 32), hashBase16.slice(32)]
    .map(p => parseInt(p, 16))
    .map(p => base62.encode(p))
    .join('');
}

function _expandSizes(kind: EntityKind) {
  const sizes = [...commonImageSizes, entityPosterIconSizes[kind]];
  const expanded = sizes.flatMap(baseSize => pixelDensities.map(density => baseSize * density));
  const unique = Array.from(new Set(expanded));
  return unique
    .filter(size => size <= entityMaxIconSize[kind])
    .sort((a, b) => a - b);
}
