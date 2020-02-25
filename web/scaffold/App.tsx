import { PureComponent } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Item } from '../pages/Item';

export class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <style>{`#initialization-error { display: none !important; }`}</style>
        {this._renderHeader()}
        {this._renderContent()}
      </React.Fragment>
    );
  }

  _renderHeader() {
    return (
      <header>
        <h1>Ficsit Employee Intranet Portal</h1>
        <nav aria-labelledby="site-navigation">
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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/items/' element={<Item />} />
        <Route path='/items/:slug' element={<Item />} />
      </Routes>
    )
  }
}
