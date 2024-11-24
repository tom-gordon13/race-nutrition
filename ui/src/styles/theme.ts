import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#8cbae8',
            dark: '#115293'
        },
        secondary: {
            main: '#dc004e',
            light: '#ed7fa6',
            dark: '#84002e'
        },
        grey: {
            100: '#e9ecef',
            300: '#ced4da',
            500: '#D3D3D3',
            700: '#343a40',
            900: '#121416',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;
