import { Routes, Route } from 'react-router-dom';

import { BuildingPage } from '~/pages/Building';
import { HomePage } from '~/pages/Home';
import { ItemPage } from '~/pages/Item';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/buildings/' element={<BuildingPage />} />
      <Route path='/buildings/:slug' element={<BuildingPage />} />
      <Route path='/items/' element={<ItemPage />} />
      <Route path='/items/:slug' element={<ItemPage />} />
    </Routes>
  )
}
