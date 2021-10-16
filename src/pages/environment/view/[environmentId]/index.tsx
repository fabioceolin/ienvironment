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
  IconButton,
} from '@chakra-ui/react';

import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useEventsByEnvironmentId } from 'hooks/useEvents';
import { useActuatorsByEnvironmentId } from 'hooks/useActuator';
import { useSensorsByEnvironmentId } from 'hooks/useSensor';
import { Environment } from 'hooks/useEnvironments';

import { RiAddLine, RiArrowLeftLine } from 'react-icons/ri';
import { withSSRAuth } from 'utils/withSSRAuth';
import { setupAPIClient } from 'services/api';
import { EquipmentCard } from 'components/EquipmentCard';

type EnvironmentList = {
  environment: Environment;
};

export default function EnvironmentList({ environment }: EnvironmentList) {
  const [ClickedEnvironmentID, setClickedEnvironmentID] = useState<string>('');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();
  const router = useRouter();

  const handleEditSensorClick = (sensorID: string) => {
    router.push(`./${environment.id}/sensor/edit/${sensorID}`);
  };

  const handleEditActuatorClick = (actuatorID: string) => {
    router.push(`./${environment.id}/actuator/edit/${actuatorID}`);
  };

  const handleEditEventClick = (eventID: string) => {
    router.push(`./${environment.id}/event/edit/${eventID}`);
  };

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
                router.push('/environment');
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
                            <EquipmentCard
                              key={sensor.id}
                              title={sensor.name}
                              description={sensor.description}
                              title1="Limite inferior"
                              value1={sensor.limitDown}
                              title2="Limite superior"
                              value2={sensor.limitUp}
                              simulationMode={sensor.simulationMode}
                              enabled={sensor.enabled}
                              onEditButtonClick={() =>
                                handleEditSensorClick(sensor.id)
                              }
                            />
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
                            <EquipmentCard
                              key={actuator.id}
                              title={actuator.name}
                              description={actuator.description}
                              columnsSize={1}
                              title1="Tópico"
                              value1={actuator.topic}
                              simulationMode={actuator.simulationMode}
                              enabled={actuator.enabled}
                              onEditButtonClick={() =>
                                handleEditActuatorClick(actuator.id)
                              }
                            />
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
                            <EquipmentCard
                              key={event.id}
                              title={event.name}
                              description={event.description}
                              columnsSize={1}
                              runningDays={event.runningDays}
                              enabled={event.enabled}
                              onEditButtonClick={() =>
                                handleEditEventClick(event.id)
                              }
                            />
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
