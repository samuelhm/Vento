import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import './index.css'
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster richColors closeButton position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
