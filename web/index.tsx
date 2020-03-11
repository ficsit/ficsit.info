import './global';

import * as reactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './scaffold';

const root = document.getElementById('react-root');
reactDom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root,
);
