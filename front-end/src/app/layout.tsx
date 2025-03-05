'use client';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingGlobalProvider } from './admin/contexts/loadingGlobalContext';
import { metadata } from './metadata';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{metadata.title}</title>
                <meta
                    name="description"
                    content={metadata.description}
                />
            </head>
            <body>
                <LoadingGlobalProvider>
                    <GoogleOAuthProvider clientId="585676252916-0mhdq5756lr6ubo9g520rqrvi58q27gt.apps.googleusercontent.com">
                        <AuthProvider>{children}</AuthProvider>
                    </GoogleOAuthProvider>
                </LoadingGlobalProvider>
            </body>
        </html>
    );
}
