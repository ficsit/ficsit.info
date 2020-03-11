declare const React: typeof import('react');

declare namespace NodeJS {
  interface Global {
    React: typeof import('react');
  }
}

declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.webp' {
  const path: string;
  export default path;
}

declare module '*.svg' {
  type SvgComponentProps = React.SVGAttributes<SVGElement>;
  function SvgComponent(props: SvgComponentProps): React.ReactSVGElement;
  export default SvgComponent;
}

declare module '*' {
  const paths: Record<string, Record<string, string>>;
  export default paths;
}
