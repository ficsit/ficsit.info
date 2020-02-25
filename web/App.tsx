import { PureComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import { DefaultLayout } from './layout/DefaultLayout';
import { Home } from './pages/Home';
import { Item } from './pages/Item';

export class App extends PureComponent {
  render() {
    return (
      <DefaultLayout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/item/:slug' element={<Item />} />
        </Routes>
      </DefaultLayout>
    );
  }
}
