import {
  Flex,
  Box,
  Text,
  VStack,
  Heading,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import Head from 'next/head';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { withSSRAuth } from 'utils/withSSRAuth';
import { useDashboard } from 'hooks/useDashboard';
import { queryClient } from 'services/queryClient';

import { RiRefreshLine } from 'react-icons/ri';

export default function History() {
  const { data, isLoading, isFetching, error, dataUpdatedAt } = useDashboard();

  const handleUpdate = () => {
    queryClient.invalidateQueries('Dashboard');
  };

  return (
    <Flex direction="column" h="100vh">
      <Head>
        <title>iE | Dashboard</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1">
          <VStack spacing="8">
            <iframe
              width="100%"
              height="480"
              src="https://charts.mongodb.com/charts-project-0-fkdcx/embed/charts?id=f6252a88-6958-405f-b774-30e1cf49e7bf&maxDataAge=60&theme=dark&autoRefresh=false"
            ></iframe>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
