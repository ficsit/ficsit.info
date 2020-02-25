declare const React: typeof import('react');

declare namespace NodeJS {
  interface Global {
    React: typeof import('react');
  }
}
