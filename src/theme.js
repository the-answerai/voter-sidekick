import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                modal: {
                    background: '#FF0000', // Bright red color for modal background
                },
            },
            fontFamily: {
                sans: ['Inter var', ...fontFamily.sans],
                serif: ['Merriweather', ...fontFamily.serif],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.secondary.800'),
                        a: {
                            color: theme('colors.primary.600'),
                            '&:hover': {
                                color: theme('colors.primary.800'),
                            },
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.secondary.200'),
                        a: {
                            color: theme('colors.primary.400'),
                            '&:hover': {
                                color: theme('colors.primary.300'),
                            },
                        },
                    },
                },
            }),
        },
    },
    variants: {
        extend: {
            typography: ['dark'],
        },
    },
    plugins: [require('@tailwindcss/typography')],
};

export default config;