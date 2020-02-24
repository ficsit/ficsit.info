export class Reference {
  constructor(
    public path: string, 
    public kind?: string,
    public className = normalizeClassName(path),
  ) {}

  toJSON() {
    return `<reference:${this.className}>`;
  }
}

export function normalizeClassName(nameOrPath: string) {
  return nameOrPath.match(/([^.'"]+)'?"?$/)![1]
}
