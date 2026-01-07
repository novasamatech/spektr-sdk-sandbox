import './index.css';

import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

const rootNode = document.getElementById('root');

if (rootNode) {
  createRoot(rootNode).render(<App />);
}
