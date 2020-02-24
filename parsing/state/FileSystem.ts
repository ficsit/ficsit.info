import * as fs from 'fs';
import globOriginal from 'glob';
import * as path from 'path';
import * as util from 'util';

const glob = util.promisify(globOriginal);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Simple container for file system methods; to aid in dependency injection.
 */
export class FileSystem {
  constructor(private _root: string) {}

  path(...pathParts: string[]) {
    return path.join(this._root, ...pathParts);
  }

  async readable(...pathParts: string[]) {
    return new Promise(resolve => {
      const fullPath = this.path(...pathParts);
      fs.access(fullPath, fs.constants.R_OK, (error) => {
        error ? resolve(false) : resolve(true);
      });
    });
  }

  async mkdirFor(...pathParts: string[]) {
    const fullPath = this.path(...pathParts);
    const directoryPath = path.dirname(fullPath);
    await mkdir(directoryPath, { recursive: true });
  }

  async read(...pathParts: string[]) {
    const fullPath = this.path(...pathParts);
    return await readFile(fullPath, 'utf-8');
  }

  async readBuffer(...pathParts: string[]) {
    const fullPath = this.path(...pathParts);
    return await readFile(fullPath);
  }

  async write(data: string, ...pathParts: string[]) {
    const fullPath = this.path(...pathParts);
    await this.mkdirFor(...pathParts);
    return await writeFile(fullPath, data, 'utf-8');
  }

  async writeJson(data: any, ...pathParts: string[]) {
    return await this.write(JSON.stringify(data, null, 2), ...pathParts);
  }

  async writeBuffer(data: Buffer, ...pathParts: string[]) {
    const fullPath = this.path(...pathParts);
    return await writeFile(fullPath, data);
  }

  async glob(expression: string) {
    return await glob(expression, { 
      cwd: this._root,
    });
  }
}
