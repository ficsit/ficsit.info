import { PureComponent } from 'react';
import {  NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { Image } from '../components/Image';
import { colors } from '../style';

import { AppRoutes } from './AppRoutes';

import logoImage from '../assets/images/ficsit-logo@*.*';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: colors.Light.N50,
  color: colors.Dark.N950,
});

const headerStyles = css({
  background: `linear-gradient(0deg, ${colors.Secondary.N900}, ${colors.Secondary.N800})`,
  color: colors.Light.N0,
  'a': {
    display: 'inline-block',
    textDecoration: 'none',
    color: 'inherit',
  }
});

const logoStyles = css({
  verticalAlign: 'bottom',
  marginRight: 8,
});

const titleStyles = css({
  fontSize: '24px',
  fontWeight: 'lighter',
  margin: 0,
  'a': {
    padding: '4px 8px',
  },
});

const navigationStyles = css({
  '#site-navigation': {
    display: 'none',
  },
  'ul': {
    display: 'flex',
    listStyle: 'none',
    padding: 2,
    margin: 0,
  },
  'ul li a': {
    margin: 2,
    padding: 4,
    borderRadius: 3,
    // ':hover, &.active': {
    //   backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // },
    ':hover, &.active': {
      backgroundColor: colors.Light.N50,
      color: colors.Dark.N950,
    },
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
          <NavLink to='/'>
            <Image paths={logoImage} alt='FicsIt' height={36} width={144} css={logoStyles} />
            Employee Intranet Portal
          </NavLink>
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
