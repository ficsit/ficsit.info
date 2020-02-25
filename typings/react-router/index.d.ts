declare module 'react-router' {
  import { Component, ReactNode, ReactElement } from 'react';

  export interface Location {
    pathname: string;
    search?: string;
    hash?: string;
  }

  /**
   * Returns a hash of the dynamic params that were matched in the route path.
   * This is useful for using ids embedded in the URL to fetch data, but we
   * eventually want to provide something at a higher level for this.
   */
  export function useParams<TParams = any>(): TParams;

  /**
   * Returns the current location object, which represents the current URL in web
   * browsers.
   *
   * NOTE: If you're using this it may mean you're doing some of your own "routing"
   * in your app, and we'd like to know what your use case is. We may be able to
   * provide something higher-level to better suit your needs.
   */
  export function useLocation(): Location;

  /**
   * Used in a route config to render an element.
   */
  export class Route extends Component<RouteProps> {}
  export interface RouteProps {
    children?: ReactNode;
    element?: ReactElement;
    path?: string;
  }

  /**
   * A wrapper for useRoutes that treats its children as route and/or redirect
   * objects.
   */
  export class Routes extends Component<RoutesProps> {}
  export interface RoutesProps {
    basename?: string;
    caseSensitive?: boolean;
    children?: ReactNode;
  }
}
