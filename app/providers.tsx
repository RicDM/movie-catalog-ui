'use client';

import { Header } from '@/components/Header';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FavoritesProvider>
                <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background }}>
                    <Header />
                    {children}
                </div>
            </FavoritesProvider>
        </ThemeProvider>
    );
}
