import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initStatusBar, hideSplash } from './services/native.js'

async function bootstrap() {
  // Initialize native UI chrome before rendering
  await initStatusBar();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Hide splash after first render
  setTimeout(hideSplash, 200);
}

bootstrap();
