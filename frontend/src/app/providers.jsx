import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext.jsx';

// Contextos globales de la app. El carrito (CU-04) se suma acá con su CarritoProvider.
export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
