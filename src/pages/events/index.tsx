import { useState } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { withSSRAuth } from 'utils/withSSRAuth';
import { useDashboard } from 'hooks/useDashboard';
import { queryClient } from 'services/queryClient';

import { RiRefreshLine, RiChatHistoryLine } from 'react-icons/ri';
import { api } from 'services/apiClient';

export default function Dashboard() {
  const [sendingSignal, setSendingSinal] = useState(false);
  const { data, isLoading, isFetching, error, dataUpdatedAt } = useDashboard();

  const toast = useToast();

  const handleActivateEvent = async (eventId: string) => {
    setSendingSinal(true);

    const { status } = await api.get(`/Event/RaiseManualEvent/${eventId}`);

    switch (status) {
      case 200:
        toast({
          title: 'Sucesso!',
          description: 'Evento ativado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });
        break;

      default:
        toast({
          title: 'Internal error.',
          description: 'Falha ao ativar o evento.',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
        break;
    }

    setSendingSinal(false);
  };

  const handleUpdate = () => {
    queryClient.invalidateQueries('Dashboard');
  };

  return (
    <Flex direction="column" h="100vh">
      <Head>
        <title>iE | Eventos</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1">
          <Box mb="8">
            <Flex justifyContent="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Eventos
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
            <Text color="gray.600">Para acionar um evento, clique nele!</Text>
          </Box>

          <VStack spacing="8">
            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter os eventos</Text>
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
                      {item.events.length > 0 ? (
                        item.events
                          .filter((e) => e.isManual)
                          .map((eventItem) => {
                            return (
                              <Box
                                h="153px"
                                p={['4']}
                                bg="gray.800"
                                shadow="lg"
                                borderRadius={8}
                                key={eventItem.id}
                                _hover={{ filter: 'brightness(1.2)' }}
                                cursor="pointer"
                                onClick={() => {
                                  handleActivateEvent(eventItem.id);
                                }}
                              >
                                {sendingSignal ? (
                                  <Flex
                                    h="100%"
                                    flex={1}
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                    <Spinner
                                      color="pink.500"
                                      size="xl"
                                      thickness="4px"
                                    />
                                  </Flex>
                                ) : (
                                  <>
                                    <Text
                                      fontSize="lg"
                                      noOfLines={1}
                                      align="center"
                                    >
                                      {eventItem.name}
                                    </Text>
                                    <Flex
                                      h="40px"
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <Text
                                        fontSize="smaller"
                                        noOfLines={2}
                                        color="gray.300"
                                        align="center"
                                      >
                                        {eventItem.description}
                                      </Text>
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
                                        {eventItem.updatedAt}
                                      </Text>
                                    </Flex>
                                  </>
                                )}
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
