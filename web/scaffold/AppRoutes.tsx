import { Routes, Route } from 'react-router-dom';

import { Building } from '../pages/Building';
import { Home } from '../pages/Home';
import { Item } from '../pages/Item';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/buildings/' element={<Building />} />
      <Route path='/buildings/:slug' element={<Building />} />
      <Route path='/items/' element={<Item />} />
      <Route path='/items/:slug' element={<Item />} />
    </Routes>
  )
}
