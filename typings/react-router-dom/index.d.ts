declare module 'react-router-dom' {
  import { Component, MouseEventHandler, ReactNode } from 'react';
  import { Location, Route, Routes } from 'react-router';

  export { Route, Routes };

  /**
   * A <Router> for use in web browsers. Provides the cleanest URLs.
   */
  export class BrowserRouter extends Component<BrowserRouterProps> {}
  export interface BrowserRouterProps {
    children?: ReactNode;
    timeout?: number;
    window?: Window;
  }

  /**
   * A <Router> for use in web browsers. Stores the location in the hash
   * portion of the URL so it is not sent to the server.
   */
  export class HashRouter extends Component<HashRouterProps> {}
  export interface HashRouterProps {
    children?: ReactNode;
    timeout?: number;
    window?: Window;
  }

  /**
   * The public API for rendering a history-aware <a>.
   */
  export class Link extends Component<LinkProps> {}
  export interface LinkProps {
    as?: typeof Component,
    onClick?: MouseEventHandler,
    replace?: boolean;
    state?: any;
    target?: string;
    to: string | Location;
  }

  /**
   * A <Link> wrapper that knows if it's "active" or not.
   */
  export class NavLink extends Component<NavLinkProps> {}
  export interface NavLinkProps extends LinkProps {
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true',
    activeClassName?: string,
    activeStyle?: object,
    className?: string,
    style?: object,
  }

  /**
   * A declarative interface for showing a window.confirm dialog with the given
   * message when the user tries to navigate away from the current page.
   *
   * This also serves as a reference implementation for anyone who wants to
   * create their own custom prompt component.
   */
  export class Prompt extends Component<PromptProps> {}
  export interface PromptProps {
    message: string;
    when?: boolean;
  }

  /**
   * Prevents navigation away from the current page using a window.confirm prompt
   * with the given message.
   */
  export function usePrompt(message: string, when?: boolean): void;
}
