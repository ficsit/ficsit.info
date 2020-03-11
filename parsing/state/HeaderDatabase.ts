import pAll from 'p-all';

import { FileSystem } from './FileSystem';

interface HeaderInfo {
  classes: ClassInfo[];
}

interface ClassInfo {
  name: string;
  extensions: string[];
}

/**
 * A container for lazy-loading class headers and basic metadata about them.
 */
export class HeaderDatabase {
  _headers = {} as Record<string, HeaderInfo>;
  _classes = {} as Record<string, ClassInfo>;

  constructor(private _fs: FileSystem) {}

  async load() {
    const paths = await this._fs.glob('**/*.h');
    const jobs = paths.map(p => () => this._loadHeader(p));
    await pAll(jobs, { concurrency: 10 });
  }

  get(className: string) {
    className = normalizeClassName(className);
    if (!(className in this._classes)) {
      throw new Error(`Unknown class ${className}`);
    }
    return this._classes[className];
  }

  findAncestor<TValue>(className: string, callback: (name: string) => TValue): TValue | undefined {
    className = normalizeClassName(className);
    if (!(className in this._classes)) {
      // HACK
      if (className.startsWith('FGBuildable') || className.substr(1).startsWith('FGBuildable')) {
        return this.findAncestor('FGBuildable', callback);
      } else {
        return;
      }
    }

    const { name, extensions } = this._classes[className];

    const result = callback(name) || callback(name.substr(1));
    if (result) return result;

    for (const extension of extensions) {
      const childResult = this.findAncestor(extension, callback);
      if (childResult) return childResult;
    }
  }

  async _loadHeader(path: string) {
    const data = await this._fs.read(path);
    const source = data.replace(/\r\n/g, '\n');

    const classes = [];
    for (const [, name, rawExtensions] of source.matchAll(
      /[\s\n]+class.*?\s+(\w+)(?:\s*:\s*(.+)\s*)?\n\{/gm,
    )) {
      let extensions = [] as string[];
      if (rawExtensions) {
        extensions = rawExtensions
          .replace(/\/\/.+$/, '')
          .split(/\s*,\s*/g)
          .map(e => e.match(/(\w+)$/)![0]);
      }

      const classInfo = { name, extensions };
      classes.push(classInfo);
      this._indexClassInfo(classInfo);
    }

    this._headers[path] = { classes };
  }

  _indexClassInfo(classInfo: ClassInfo) {
    if (classInfo.name in this._classes) {
      throw new Error(`Duplicate class: ${classInfo.name}`);
    }
    this._classes[classInfo.name] = classInfo;

    // Also index without the first character, since nearly all classes are
    // referred to without their prefix.
    // …unless they're an interface for blueprints.
    if (classInfo.extensions.length === 1 && classInfo.extensions[0] === 'UInterface') return;

    const withoutPrefix = classInfo.name.substr(1);
    if (withoutPrefix in this._classes) {
      throw new Error(`Duplicate class: ${withoutPrefix} via (${classInfo.name})`);
    }

    this._classes[withoutPrefix] = classInfo;
  }
}

export function normalizeClassName(nameOrPath: string) {
  return nameOrPath.match(/([^.'"]+)'?"?$/)![1];
}
