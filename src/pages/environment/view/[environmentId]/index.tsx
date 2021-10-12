import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Flex,
  Box,
  SimpleGrid,
  Text,
  Heading,
  Button,
  Icon,
  Spinner,
  useDisclosure,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Thead,
  Tr,
  Tbody,
  Th,
  Td,
  ButtonGroup,
  IconButton,
  chakra,
  Link,
} from '@chakra-ui/react';

import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useEventsByEnvironmentId } from 'hooks/useEvents';
import { useActuatorsByEnvironmentId } from 'hooks/useActuator';
import { useSensorsByEnvironmentId } from 'hooks/useSensor';
import { Environment } from 'hooks/useEnvironments';

import {
  RiAddLine,
  RiExternalLinkFill,
  RiEdit2Fill,
  RiDeleteBinLine,
  RiArrowLeftLine,
} from 'react-icons/ri';
import { withSSRAuth } from 'utils/withSSRAuth';
import { setupAPIClient } from 'services/api';

type EnvironmentList = {
  environment: Environment;
};

export default function EnvironmentList({ environment }: EnvironmentList) {
  const [ClickedEnvironmentID, setClickedEnvironmentID] = useState<string>('');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();
  const router = useRouter();

  const headers = ['name', 'description', 'actions'];

  const {
    data: eventData,
    isLoading: eventIsLoading,
    isFetching: eventIsFetching,
    error: eventError,
  } = useEventsByEnvironmentId(environment.id);

  const {
    data: sensorData,
    isLoading: sensorIsLoading,
    isFetching: sensorIsFetching,
    error: sensorError,
  } = useSensorsByEnvironmentId(environment.id);

  const {
    data: actuatorData,
    isLoading: actuatorIsLoading,
    isFetching: actuatorIsFetching,
    error: actuatorError,
  } = useActuatorsByEnvironmentId(environment.id);

  const newData =
    eventData &&
    eventData.map((event) => ({
      name: event.name,
      description: event.description,
    }));

  return (
    <Box>
      <Head>
        <title>iE | Environment</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8}>
          <Flex mb="8" align="center">
            <IconButton
              variant="link"
              colorScheme="pink"
              aria-label="Voltar"
              icon={<RiArrowLeftLine size={30} />}
              size="md"
              onClick={() => {
                router.back();
              }}
            />
            <Heading size="lg" fontWeight="normal">
              {environment?.name}
            </Heading>
          </Flex>
          <Box w="full" flex="1" align="flex-start">
            <Tabs isFitted p="3" variant="line" colorScheme="pink">
              <TabList>
                <Tab>Sensores</Tab>
                <Tab>Atuadores</Tab>
                <Tab>Eventos</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex mb="8" justify="space-between" align="center">
                    <Heading size="md" fontWeight="normal" color="gray.500">
                      Sensores
                      {!sensorIsLoading && sensorIsFetching && (
                        <Spinner size="sm" color="gray.500" ml="4" />
                      )}
                    </Heading>
                    <NextLink
                      href={`./${environment.id}/sensor/create`}
                      passHref
                    >
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="pink"
                        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      >
                        Adicionar
                      </Button>
                    </NextLink>
                  </Flex>
                  <Flex w="full" alignItems="center" justifyContent="center">
                    {sensorIsLoading ? (
                      <Flex justify="center">
                        <Spinner />
                      </Flex>
                    ) : sensorError ? (
                      <Flex justify="center">
                        <Text>Falha ao obter dados dos ambientes</Text>
                      </Flex>
                    ) : (
                      <SimpleGrid
                        flex="1"
                        gap="4"
                        columns={[1, null, 3]}
                        templateRows="auto 1fr"
                        align="flex-start"
                      >
                        {sensorData?.map((sensor) => {
                          return (
                            <Box
                              w="full"
                              maxW="sm"
                              mx="auto"
                              px={4}
                              py={3}
                              bg="gray.800"
                              shadow="md"
                              rounded="lg"
                            >
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <chakra.span fontSize="sm" color="gray.400">
                                  Modo simulação
                                </chakra.span>
                                <chakra.span
                                  bg="brand.300"
                                  color="brand.900"
                                  px={3}
                                  py={1}
                                  rounded="full"
                                  textTransform="uppercase"
                                  fontSize="xs"
                                >
                                  psychology
                                </chakra.span>
                              </Flex>

                              <Box>
                                <chakra.h1
                                  fontSize="lg"
                                  fontWeight="bold"
                                  mt={2}
                                  color="white"
                                >
                                  {sensor.name}
                                </chakra.h1>
                                <chakra.p
                                  h="42px"
                                  fontSize="sm"
                                  mt={2}
                                  color="gray.300"
                                  noOfLines={2}
                                >
                                  {sensor.description}
                                </chakra.p>
                              </Box>

                              <Box>
                                <Flex
                                  alignItems="center"
                                  mt={2}
                                  color="gray.200"
                                >
                                  <span>Visit on:</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                  >
                                    edx.org
                                  </Link>
                                  <span>or</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                    wordBreak="break-word"
                                  >
                                    classcentral.com
                                  </Link>
                                </Flex>

                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mt={4}
                                >
                                  <ButtonGroup
                                    variant="solid"
                                    size="sm"
                                    spacing={3}
                                  >
                                    <IconButton
                                      aria-label=""
                                      colorScheme="blue"
                                      icon={<RiExternalLinkFill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="green"
                                      icon={<RiEdit2Fill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="red"
                                      variant="outline"
                                      icon={<RiDeleteBinLine />}
                                    />
                                  </ButtonGroup>
                                </Flex>
                              </Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex mb="8" justify="space-between" align="center">
                    <Heading size="md" fontWeight="normal" color="gray.500">
                      Atuadores
                      {!actuatorIsLoading && actuatorIsFetching && (
                        <Spinner size="sm" color="gray.500" ml="4" />
                      )}
                    </Heading>
                    <NextLink
                      href={`./${environment.id}/actuator/create`}
                      passHref
                    >
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="pink"
                        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      >
                        Adicionar
                      </Button>
                    </NextLink>
                  </Flex>
                  <Flex w="full" alignItems="center" justifyContent="center">
                    {actuatorIsLoading ? (
                      <Flex justify="center">
                        <Spinner />
                      </Flex>
                    ) : actuatorError ? (
                      <Flex justify="center">
                        <Text>Falha ao obter dados dos atuadores</Text>
                      </Flex>
                    ) : (
                      <SimpleGrid
                        flex="1"
                        gap="4"
                        columns={[1, null, 3]}
                        templateRows="auto 1fr"
                        align="flex-start"
                      >
                        {actuatorData?.map((actuator) => {
                          return (
                            <Box
                              w="full"
                              maxW="sm"
                              mx="auto"
                              px={4}
                              py={3}
                              bg="gray.800"
                              shadow="md"
                              rounded="lg"
                            >
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <chakra.span fontSize="sm" color="gray.400">
                                  Modo simulação
                                </chakra.span>
                                <chakra.span
                                  bg="brand.300"
                                  color="brand.900"
                                  px={3}
                                  py={1}
                                  rounded="full"
                                  textTransform="uppercase"
                                  fontSize="xs"
                                >
                                  psychology
                                </chakra.span>
                              </Flex>

                              <Box>
                                <chakra.h1
                                  fontSize="lg"
                                  fontWeight="bold"
                                  mt={2}
                                  color="white"
                                >
                                  {actuator.name}
                                </chakra.h1>
                                <chakra.p
                                  h="42px"
                                  fontSize="sm"
                                  mt={2}
                                  color="gray.300"
                                  noOfLines={2}
                                >
                                  {actuator.description}
                                </chakra.p>
                              </Box>

                              <Box>
                                <Flex
                                  alignItems="center"
                                  mt={2}
                                  color="gray.200"
                                >
                                  <span>Visit on:</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                  >
                                    edx.org
                                  </Link>
                                  <span>or</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                    wordBreak="break-word"
                                  >
                                    classcentral.com
                                  </Link>
                                </Flex>

                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mt={4}
                                >
                                  <ButtonGroup
                                    variant="solid"
                                    size="sm"
                                    spacing={3}
                                  >
                                    <IconButton
                                      aria-label=""
                                      colorScheme="blue"
                                      icon={<RiExternalLinkFill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="green"
                                      icon={<RiEdit2Fill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="red"
                                      variant="outline"
                                      icon={<RiDeleteBinLine />}
                                    />
                                  </ButtonGroup>
                                </Flex>
                              </Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex mb="8" justify="space-between" align="center">
                    <Heading size="md" fontWeight="normal" color="gray.500">
                      Eventos
                      {!eventIsLoading && eventIsFetching && (
                        <Spinner size="sm" color="gray.500" ml="4" />
                      )}
                    </Heading>
                    <NextLink
                      href={`./${environment.id}/event/create`}
                      passHref
                    >
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="pink"
                        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      >
                        Adicionar
                      </Button>
                    </NextLink>
                  </Flex>
                  <Flex w="full" alignItems="center" justifyContent="center">
                    {eventIsLoading ? (
                      <Flex justify="center">
                        <Spinner />
                      </Flex>
                    ) : eventError ? (
                      <Flex justify="center">
                        <Text>Falha ao obter dados dos ambientes</Text>
                      </Flex>
                    ) : (
                      <SimpleGrid
                        flex="1"
                        gap="4"
                        columns={[1, null, 3]}
                        templateRows="auto 1fr"
                        align="flex-start"
                      >
                        {eventData?.map((event) => {
                          return (
                            <Box
                              w="full"
                              maxW="sm"
                              mx="auto"
                              px={4}
                              py={3}
                              bg="gray.800"
                              shadow="md"
                              rounded="lg"
                            >
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <chakra.span fontSize="sm" color="gray.400">
                                  Modo simulação
                                </chakra.span>
                                <chakra.span
                                  bg="brand.300"
                                  color="brand.900"
                                  px={3}
                                  py={1}
                                  rounded="full"
                                  textTransform="uppercase"
                                  fontSize="xs"
                                >
                                  psychology
                                </chakra.span>
                              </Flex>

                              <Box>
                                <chakra.h1
                                  fontSize="lg"
                                  fontWeight="bold"
                                  mt={2}
                                  color="white"
                                >
                                  {event.name}
                                </chakra.h1>
                                <chakra.p
                                  h="42px"
                                  fontSize="sm"
                                  mt={2}
                                  color="gray.300"
                                  noOfLines={2}
                                >
                                  {event.description}
                                </chakra.p>
                              </Box>

                              <Box>
                                <Flex
                                  alignItems="center"
                                  mt={2}
                                  color="gray.200"
                                >
                                  <span>Visit on:</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                  >
                                    edx.org
                                  </Link>
                                  <span>or</span>
                                  <Link
                                    mx={2}
                                    cursor="pointer"
                                    textDecor="underline"
                                    color="brand.400"
                                    wordBreak="break-word"
                                  >
                                    classcentral.com
                                  </Link>
                                </Flex>

                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mt={4}
                                >
                                  <ButtonGroup
                                    variant="solid"
                                    size="sm"
                                    spacing={3}
                                  >
                                    <IconButton
                                      aria-label=""
                                      colorScheme="blue"
                                      icon={<RiExternalLinkFill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="green"
                                      icon={<RiEdit2Fill />}
                                    />
                                    <IconButton
                                      aria-label=""
                                      colorScheme="red"
                                      variant="outline"
                                      icon={<RiDeleteBinLine />}
                                    />
                                  </ButtonGroup>
                                </Flex>
                              </Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { environmentId } = ctx.query;
  const { data: environment } = await apiClient.get(
    `Environment?EnvironmentID=${environmentId}`
  );
  return {
    props: { environment },
  };
});
