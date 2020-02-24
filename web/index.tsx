import './global';

import * as reactDom from 'react-dom';

import { DefaultLayout } from './layout/DefaultLayout';

const root = document.getElementById('react-root');
reactDom.render(<DefaultLayout />, root);
