import {
  Flex,
  Box,
  Text,
  VStack,
  Grid,
  Divider,
  Heading,
  Spinner,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import Head from 'next/head';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { withSSRAuth } from 'utils/withSSRAuth';
import { useDashboard } from 'hooks/useDashboard';
import { queryClient } from 'services/queryClient';

import {
  RiRefreshLine,
  RiChatHistoryLine,
  RiSignalTowerLine,
} from 'react-icons/ri';

export default function Dashboard() {
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
          <Flex mb="8" justifyContent="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Dashboard
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
            <Flex alignItems="center">
              <IconButton
                variant="ghost"
                colorScheme="pink"
                aria-label="Atualizar"
                size="sm"
                _hover={{ background: 'rgba(251, 182, 206, 0.12)' }}
                _focus={{ boxShadow: 'none' }}
                icon={<RiRefreshLine size="18px" />}
                mr="2"
                onClick={handleUpdate}
              />
              {!isLoading && isFetching ? (
                <Text color="gray.600" fontWeight="light">
                  Atualizando...
                </Text>
              ) : (
                <Text color="gray.600" fontWeight="light">
                  {new Date(dataUpdatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </Text>
              )}
            </Flex>
          </Flex>
          <VStack spacing="8">
            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos ambientes</Text>
              </Flex>
            ) : (
              data?.map((item) => {
                return (
                  <Box w="100%" key={item.name}>
                    <Heading size="md" fontWeight="normal">
                      {item.name}
                    </Heading>
                    <Text
                      mt="2"
                      color="gray.600"
                      fontWeight="light"
                      noOfLines={1}
                    >
                      {item.description}
                    </Text>
                    <Divider my="4" borderColor="gray.700" />
                    <Grid
                      templateColumns={{
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        xl: 'repeat(4, 1fr)',
                      }}
                      gap={6}
                      w="100%"
                    >
                      {item.sensor.length > 0 ? (
                        item.sensor.map((sensorItem) => {
                          return (
                            <Box
                              p={['4']}
                              bg="gray.800"
                              shadow="lg"
                              borderRadius={8}
                              key={sensorItem.id}
                            >
                              <Text
                                fontSize="sm"
                                noOfLines={1}
                                color="gray.300"
                              >
                                {sensorItem.name}
                              </Text>
                              <Flex
                                justifyContent="space-around"
                                alignItems="center"
                              >
                                <Icon
                                  as={RiSignalTowerLine}
                                  h="35px"
                                  w="35px"
                                  color="pink.600"
                                />
                                <Flex
                                  justifyContent="flex-end"
                                  alignItems="baseline"
                                >
                                  <Text fontSize="4xl" fontWeight="bold">
                                    {sensorItem.currentValue
                                      ? sensorItem.currentValue
                                      : 0}
                                  </Text>
                                  <Text ml="5px">
                                    {sensorItem.measurementUnit}
                                  </Text>
                                </Flex>
                              </Flex>
                              <Divider my="4" borderColor="gray.700" />
                              <Flex>
                                <Icon
                                  as={RiChatHistoryLine}
                                  color="pink.700"
                                  h="20px"
                                  w="20px"
                                />
                                <Text ml="5px" fontSize="sm">
                                  {sensorItem.updatedAt}
                                </Text>
                              </Flex>
                            </Box>
                          );
                        })
                      ) : (
                        <Text>Nenhum sensor foi encontrado</Text>
                      )}
                    </Grid>
                  </Box>
                );
              })
            )}
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
