const PREFIX = [
  '%cworker',
  `background-color: #f69e2c; border-radius: 0.5em; color: white; font-weight: bold; padding: 2px 0.5em`,
];

export function startGroup(...args: any[]) {
  console.groupCollapsed(...PREFIX, ...args);
  return () => console.groupEnd();
}

