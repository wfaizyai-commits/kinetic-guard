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

  // Hide the NATIVE splash the moment the web view has painted, so the user
  // only ever sees the in-app AnimatedSplash (no static→animated double flash).
  requestAnimationFrame(() => requestAnimationFrame(hideSplash));
}

bootstrap();
