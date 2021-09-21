import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    gray: {
      '900': '#181B23',
      '800': '#1F2029',
      '700': '#353646',
      '600': '#4B4D63',
      '500': '#616480',
      '400': '#797D9A',
      '300': '#9699B0',
      '200': '#B3B5C6',
      '100': '#D1D2DC',
      '50': '#EEEEF2',
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      '*': {
        scrollbarColor: '#353646 transparent',
      },
      body: {
        bg: 'gray.900',
        color: 'gray.50',
      },
      '*::-webkit-scrollbar': {
        width: '7px',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: '#4B4D63',
        borderRadius: '20px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#353646',
      },
      '.react-modal-overlay': {
        background: 'rgba(0, 0, 0, 0.5)',

        position: 'fixed',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '.react-modal-content': {
        width: '100%',
        maxWidth: '576px',
        background: '#1F2029',
        padding: '3rem',
        position: 'relative',
        borderRadius: '0.25rem',
      },
    },
  },
});
