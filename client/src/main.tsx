import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { initSessionKey } from './crypto/session.ts';

// createRoot(document.getElementById('root')!).render(
//   <App />
// )

async function bootstrap() {
  await initSessionKey();

  createRoot(document.getElementById('root')!).render(<App />);
}

bootstrap();
