import { PureComponent } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { Building } from '../pages/Building';
import { Home } from '../pages/Home';
import { Item } from '../pages/Item';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
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
      <header>
        <h1>FicsIt Employee Intranet Portal</h1>
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
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/buildings/' element={<Building />} />
          <Route path='/buildings/:slug' element={<Building />} />
          <Route path='/items/' element={<Item />} />
          <Route path='/items/:slug' element={<Item />} />
        </Routes>
      </div>
    )
  }
}
