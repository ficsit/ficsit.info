import { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { Image } from '~/components/Image';
import { colors, sizing } from '~/style';

import { AppRoutes } from './AppRoutes';

import logoImage from '../assets/images/ficsit-logo@*.*';
import { useVersions } from '~/data/versions';

const globalStyles = css({
  WebkitFontSmoothing: 'antialiased',
  'h1, h2, h3, h4, h5, h6': {
    margin: 0,
    fontWeight: 'lighter',
    lineHeight: '1.0',
  },
  h1: {
    fontSize: 36,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 24,
    textTransform: 'uppercase',
  },
  h3: {
    fontSize: 20,
  },
  h4: {
    fontSize: 16,
  },
  h5: {
    fontSize: 14,
  },
  h6: {
    fontSize: 12,
  },
});

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
  overflow: 'hidden',
  willChange: 'transform',
  background: `linear-gradient(0deg, ${colors.Secondary.N900}, ${colors.Secondary.N800})`,
  color: colors.Light.N0,
  a: {
    display: 'inline-block',
    textDecoration: 'none',
    color: 'inherit',
  },
});

const logoStyles = css({
  verticalAlign: 'bottom',
  marginRight: 8,
});

const titleStyles = css({
  fontSize: '24px',
  fontWeight: 'lighter',
  margin: 0,
  whiteSpace: 'nowrap',
  a: {
    padding: '4px 8px',
  },
});

const navigationStyles = css({
  '#site-navigation': {
    display: 'none',
  },
  ul: {
    display: 'flex',
    listStyle: 'none',
    padding: 2,
    margin: 0,
  },
  'ul li a': {
    margin: 2,
    padding: 4,
    borderRadius: 3,
    ':hover, &.active': {
      backgroundColor: colors.Light.N50,
      color: colors.Dark.N950,
    },
  },
});

const versionStyles = css({
  position: 'absolute',
  top: 20,
  right: -38,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transform: 'rotate(45deg)',
  width: 140,
  background: colors.Primary.N500,
  fontSize: sizing.FontSize.Tiny,
  [`@media(max-width: 400px)`]: {
    // display: 'none',
  },
});

const contentStyles = css({
  flex: 1,
  overflow: 'auto',
  overscrollBehavior: 'contain',
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
            Employee Portal
          </NavLink>
        </h1>
        <nav aria-labelledby='site-navigation' css={navigationStyles}>
          <h2 id='site-navigation'>Site Navigation</h2>
          <ul>
            <li>
              <NavLink to='/items'>Items</NavLink>
            </li>
            <li>
              <NavLink to='/buildings'>Buildings</NavLink>
            </li>
            <li>
              <NavLink to='/embetterer'>Embetterer™</NavLink>
            </li>
            {/* <li><NavLink to='/vehicles'>Vehicles</NavLink></li> */}
            {/* <li><NavLink to='/recipes'>Recipes</NavLink></li> */}
            {/* <li><NavLink to='/research'>Research</NavLink></li> */}
          </ul>
        </nav>
        <Version />
      </header>
    );
  }

  _renderContent() {
    return (
      <div css={[globalStyles, contentStyles]}>
        <AppRoutes />
      </div>
    );
  }
}

function Version() {
  const versions = useVersions();
  const branch = 'experimental';

  return (
    <div css={versionStyles}>
      <span className='branch'>{branch}</span>
      <span className='version'>v{versions?.[branch] || '???'}</span>
    </div>
  );
}
