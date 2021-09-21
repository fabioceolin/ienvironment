import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { theme } from 'styles/theme';

import { QueryClientProvider } from 'react-query';
import { SidebarDrawerProvider } from 'contexts/SidebarDrawerContext';
import { AuthProvider } from 'contexts/AuthContext';
import { UploadProvider } from 'hooks/upload';
import { queryClient } from 'services/queryClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <SidebarDrawerProvider>
            <UploadProvider>
              <Component {...pageProps} />
            </UploadProvider>
          </SidebarDrawerProvider>
        </AuthProvider>
      </ChakraProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
