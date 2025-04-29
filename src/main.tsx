
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from '@/contexts/UserContext'

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <UserProvider>
      <App />
    </UserProvider>
  );
} else {
  console.error("Root element not found");
}
