import { imageHash } from '@lolpants/image-hash';
import * as base62 from 'base62';
import sharp from 'sharp';


import { FileSystem } from './FileSystem';
import { EntityDatabase } from './EntityDatabase';

/**
 * A container for assets (e.g. images) and metadata about them.
 */
export class AssetDatabase {
  constructor(private _resources: FileSystem, private _output: FileSystem) {}

  async findLargestEntityIcon(info: EntityDatabase.Info) {
    // Should be able to determine the category via any inbound reference.
    const entityReference = info.inbound[0];
    const category = /\/FactoryGame\/(.*)\//.exec(entityReference?.reference.path)?.[1];
    if (!category) {
      console.warn(`Unable to determine category for ${info.entity.ClassName}; no inbound references to infer category from`);
      return;
    }

    // TODO: abstract
    const baseName = /^[^_]+_(.+)_C$/.exec(info.entity.ClassName)![1];

    return await this._findLargestEntityIcon(category, baseName);
  }

  async _findLargestEntityIcon(category: string, name: string) {
    // Break the name up into globbable tokens; we're looking for rough matches.
    const nameGlob = name
      // Split on _
      .replace(/_/g, '*')
      // And CamelCaps.
      .replace(/([^A-Z])([A-Z])/g, '$1*$2');

    // First check for icons with the same name.
    const expression = `${category}/**/*${nameGlob}*_[0-9]+([0-9]).png`;
    let paths = await this._resources.glob(expression);

    // Second, check to see if the category contains only one thing.
    if (!paths.length) {
      paths = await this._resources.glob(`${category}/**/*_[0-9]+([0-9]).png`);
    }

    if (!paths.length) {
      console.warn(`Unable to find icon matching ${expression}`);
    } else {
      const names = new Set(paths.map(_iconName));
      // Drop if they're not all the same icon.
      if (names.size !== 1) {
        paths = [];
        console.warn(`Found too many potential images (${expression}): ${Array.from(names).join(', ')}`);
      }
    }

    return paths.sort((a, b) => _iconSize(b) - _iconSize(a))[0];
  }

  async saveIcon(sourcePath: string, sizes: number[]) {
    const source = await this._resources.readBuffer(sourcePath);
    const hash = _hashImage(source);
    const icon = sharp(source);
    const { height, width } = await icon.metadata();

    return await Promise.all(sizes.map(async size => {
      if (height! < size && width! < size) return undefined;

      const baseName = `${hash}.${size}`;
      const pngPath = this._output.path('images', `${baseName}.png`);
      const webpPath = this._output.path('images', `${baseName}.webp`)
      if (await this._output.readable(pngPath) && await this._output.readable(webpPath)) return baseName;

      const resized = icon.clone().resize(size, size, { fit: 'cover' });
      await this._output.mkdirFor(pngPath);
      await this._output.mkdirFor(webpPath);

      const png = resized
        .clone()
        .png({ 
          // We get a decent amount (~5%) of additional compression from this.
          adaptiveFiltering: true,
        })
        .toFile(this._output.path('images', `${baseName}.png`));
      
      const webp = resized
        .clone()
        .webp({
          quality: 60,
          nearLossless: true,
          reductionEffort: 6,
        })
        .toFile(this._output.path('images', `${baseName}.webp`));

      await Promise.all([png, webp]);
      
      return baseName;
    }));
  }
}

function _iconSize(iconPath: string) {
  const match = /_(\d+)\.png$/.exec(iconPath);
  return match ? parseInt(match[1]) : 0;
}

function _iconName(iconPath: string) {
  const match = /([^\\\/]+?)(_\d+\.png)?$/.exec(iconPath);
  return match?.[1];
}

function _hashImage(image: Buffer) {
  const rawHash = imageHash(image);
  return [rawHash.slice(0, 32), rawHash.slice(32)]
    .map(p => parseInt(p, 16))
    .map(p => base62.encode(p))
    .join('');
}
