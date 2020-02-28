import { PureComponent } from 'react';
import {  NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import logoImage from '../assets/images/ficsit-logo@*.*';

import { Image } from '../components/Image';

import { AppRoutes } from './AppRoutes';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

const headerStyles = css({
  backgroundColor: '#232220',
  color: '#ffffff',
  padding: '8px 12px',
  'h1': {
    fontSize: '24px',
    fontWeight: 'normal',
  },
});

const logoStyles = css({
  verticalAlign: 'bottom',
  marginRight: 8,
});

const titleStyles = css({
  margin: 0,
});

const navigationStyles = css({
  '#site-navigation': {
    display: 'none',
  },
  'ul': {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
  },
  'ul li a': {
    padding: '1em',
  },
});

const contentStyles = css({
  display: 'flex',
  flex: 1,
  overflow: 'auto',
});

export class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <style>{`#initialization-error { display: none !important; }`}</style>
        <div css={containerStyles}>
          {this._renderHeader()}
          {this._renderContent()}
        </div>
      </React.Fragment>
    );
  }

  _renderHeader() {
    return (
      <header css={headerStyles}>
        <h1 css={titleStyles}>
          <Image paths={logoImage} alt='FicsIt' height={36} width={144} css={logoStyles} />
          Employee Intranet Portal
        </h1>
        <nav aria-labelledby="site-navigation" css={navigationStyles}>
          <h2 id="site-navigation">Site Navigation</h2>
          <ul>
            <li><NavLink to='/items'>Items</NavLink></li>
            <li><NavLink to='/buildings'>Buildings</NavLink></li>
            <li><NavLink to='/vehicles'>Vehicles</NavLink></li>
            <li><NavLink to='/recipes'>Recipes</NavLink></li>
            <li><NavLink to='/research'>Research</NavLink></li>
          </ul>
        </nav>
      </header>
    )
  }

  _renderContent() {
    return (
      <div css={contentStyles}>
        <AppRoutes />
      </div>
    )
  }
}
