import { Routes, Route } from 'react-router-dom';

import { BuildingPage } from '~/pages/Building';
import { SolverPage } from '~/pages/Solver';
import { HomePage } from '~/pages/Home';
import { ItemPage } from '~/pages/Item';
import { RecipePage } from '~/pages/Recipe';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/buildings/' element={<BuildingPage />} />
      <Route path='/buildings/:slug' element={<BuildingPage />} />
      <Route path='/items/' element={<ItemPage />} />
      <Route path='/items/:slug' element={<ItemPage />} />
      <Route path='/recipes/' element={<RecipePage />} />
      <Route path='/recipes/:slug' element={<RecipePage />} />
      <Route path='/embetterer/' element={<SolverPage />} />
    </Routes>
  );
}
