
import './globals.css';
import { AuthProvider } from '../context/AuthContext'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
export const metadata = {
  title: 'EduMaster',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <GoogleOAuthProvider clientId="585676252916-0mhdq5756lr6ubo9g520rqrvi58q27gt.apps.googleusercontent.com">
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
