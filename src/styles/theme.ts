export const theme = {
    colors: {
        // Background colors
        background: '#0a0a0f',
        backgroundLight: '#121218',

        // Foreground
        foreground: '#ffffff',
        foregroundMuted: '#a1a1aa',

        // Primary
        primary: '#3b82f6',
        primaryForeground: '#ffffff',
        primaryHover: '#2563eb',

        // Accent
        accent: '#18181b',
        accentHover: '#27272a',

        // Border
        border: '#27272a',
        borderHover: '#3f3f46',

        // Glass effects
        glassBackground: 'rgba(255, 255, 255, 0.05)',
        glassBackgroundStrong: 'rgba(255, 255, 255, 0.1)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',

        // Status colors
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',

        // Special
        yellow: '#facc15',
        cyan: '#06b6d4',
        red: '#ef4444',
    },

    gradients: {
        primary: 'linear-gradient(to right, #3b82f6, #06b6d4)',
        primaryStrong: 'linear-gradient(to right, #2563eb, #0891b2)',
        dark: 'linear-gradient(to bottom, #0a0a0f, rgba(10, 10, 15, 0.6), transparent)',
        darkReverse: 'linear-gradient(to top, #0a0a0f, rgba(10, 10, 15, 0.6), transparent)',
        darkHorizontal: 'linear-gradient(to right, #0a0a0f, transparent, rgba(10, 10, 15, 0.5))',
        overlay: 'linear-gradient(to top, #000000, rgba(0, 0, 0, 0.5), transparent)',
    },

    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        primary: '0 10px 30px rgba(59, 130, 246, 0.3)',
        primaryStrong: '0 10px 40px rgba(59, 130, 246, 0.5)',
    },

    borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
    },

    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    transitions: {
        fast: '150ms ease',
        normal: '300ms ease',
        slow: '500ms ease',
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    zIndex: {
        modal: 1000,
        dropdown: 900,
        header: 50,
        overlay: 40,
    },
};

export type Theme = typeof theme;
