import React, { useState } from 'react';
import Head from 'next/head';
import {
  Flex,
  Box,
  Heading,
  Divider,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { withSSRAuth } from 'utils/withSSRAuth';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { Input } from 'components/Form/Input';
import { Select } from 'components/Form/Select';
import { Checkbox } from 'components/Form/Checkbox';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';
import {
  ComparatorType,
  DayOfWeek,
  EventType,
  NextConditionType,
} from 'utils/enums';
import { useSensorsByEnvironmentId } from 'hooks/useSensor';
import { useActuatorsByEnvironmentId } from 'hooks/useActuator';
import { TextArea } from 'components/Form/Textarea';
import { number } from 'yup/lib/locale';

type CreateSensorFormData = {
  measurementUnit: string;
  limitUp: number;
  limitDown: number;
  name: string;
  description: string;
  entityType: number;
  environmentId: string;
  enabled: boolean;
  simulationMode: boolean;
  microcontrollerID: string;
  autoDisconnectSeconds: number;
};

const CreateSensorFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  description: yup.string(),
  microcontrollerID: yup.string().required('Microcontrolador obrigatório'),
  entityType: yup.number().required('Tipo de dado obrigatório'),
  limitUp: yup
    .number()
    .transform((v) => (isNaN(v) ? undefined : v))
    .nullable()
    .default(null),
  limitDown: yup
    .number()
    .transform((v) => (isNaN(v) ? undefined : v))
    .nullable()
    .default(null),
  measurementUnit: yup.string().required('Unidade de medida obrigatória'),
  autoDisconnectSeconds: yup.number(),
  simulationMode: yup.boolean(),
  enabled: yup.boolean(),
});

export default function CreateEvent({ environmentId }) {
  const router = useRouter();
  const [eventType, setEventType] = useState<string>('0');
  const toast = useToast();
  const {
    data: sensorData,
    isLoading: sensorIsLoading,
    isFetching: sensorIsFetching,
    error: sensorError,
  } = useSensorsByEnvironmentId(environmentId);

  const {
    data: actuatorData,
    isLoading: actuatorIsLoading,
    isFetching: actuatorIsFetching,
    error: actuatorError,
  } = useActuatorsByEnvironmentId(environmentId);
  const createSensor = useMutation(
    async (sensor: CreateSensorFormData) => {
      sensor.environmentId = environmentId as string;
      console.log(sensor);
      const response = await api.post('sensor/create', { ...sensor });
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Sensor criado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('Sensors');
      },
      onError: (error: AxiosError) => {
        console.log(error.request, error.response, error.config.data);
        toast({
          title: `Erro ${error.request.status}.`,
          description: error.message,
          status: 'error',
          duration: 9000,
          position: 'top-right',
          isClosable: true,
        });
      },
    }
  );

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(CreateSensorFormSchema),
  });

  const { errors } = formState;

  const handleCreateSensor: SubmitHandler<CreateSensorFormData> = async (
    values
  ) => {
    await createSensor.mutateAsync(values);

    router.back();
  };

  return (
    <Box>
      <Head>
        <title>iE | Create Event</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateSensor)}
        >
          <Heading
            size="lg"
            fontWeight="normal"
            onClick={() => {
              console.log(eventType);
            }}
          >
            Criar evento
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="name"
                label="Nome"
                error={errors.name}
                {...register('name')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <TextArea
                name="description"
                label="Descrição"
                error={errors.description}
                {...register('description')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="coolDown"
                label="Cooldown (segundos)"
                type="number"
                error={errors.coolDown}
                {...register('coolDown')}
              />
              <Select
                name="EventType"
                label="Tipo de evento"
                error={errors.entityType}
                onChange={(event) => {
                  setEventType(event.target.value);
                }}
              >
                <option value={EventType.Manual}>Manual</option>
                <option value={EventType.Temporal}>Temporal</option>
                <option value={EventType.Conditional}>Condicional</option>
              </Select>
            </SimpleGrid>

            {eventType === '1' && (
              <>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                  <Input
                    name="measurementUnit"
                    label="Hora de inicio"
                    error={errors.measurementUnit}
                    {...register('measurementUnit')}
                  />
                  <Input
                    name="autoDisconnectSeconds"
                    label="Hora de fim"
                    error={errors.autoDisconnectSeconds}
                    {...register('autoDisconnectSeconds')}
                  />
                </SimpleGrid>
                <SimpleGrid w="100%">
                  <Flex justifyContent="space-between">
                    <Checkbox
                      name="sunday"
                      label="Domingo"
                      value={DayOfWeek.Sunday}
                      whiteSpace="nowrap"
                      formWidth="auto"
                      error={errors.sunday}
                      {...register('sunday')}
                    />
                    <Checkbox
                      name="monday"
                      label="Segunda"
                      whiteSpace="nowrap"
                      formWidth="auto"
                      value={DayOfWeek.Monday}
                      error={errors.monday}
                      {...register('monday')}
                    />
                    <Checkbox
                      name="tuesday"
                      label="Terça"
                      formWidth="auto"
                      value={DayOfWeek.Tuesday}
                      whiteSpace="nowrap"
                      error={errors.tuesday}
                      {...register('tuesday')}
                    />
                    <Checkbox
                      name="wednesday"
                      label="Quarta"
                      formWidth="auto"
                      value={DayOfWeek.Wednesday}
                      whiteSpace="nowrap"
                      error={errors.wednesday}
                      {...register('wednesday')}
                    />
                    <Checkbox
                      name="thursday"
                      label="Quinta"
                      formWidth="auto"
                      value={DayOfWeek.Thursday}
                      whiteSpace="nowrap"
                      error={errors.thursday}
                      {...register('thursday')}
                    />
                    <Checkbox
                      name="friday"
                      label="Sexta"
                      formWidth="auto"
                      value={DayOfWeek.Friday}
                      whiteSpace="nowrap"
                      error={errors.friday}
                      {...register('friday')}
                    />
                    <Checkbox
                      name="saturday"
                      label="Sabado"
                      formWidth="fit-content"
                      value={DayOfWeek.Saturday}
                      whiteSpace="nowrap"
                      error={errors.saturday}
                      {...register('saturday')}
                    />
                  </Flex>
                </SimpleGrid>
              </>
            )}

            {eventType === '2' && (
              <>
                <VStack
                  spacing="8"
                  w="100%"
                  border="1px solid rgb(255,255,255,0.2)"
                >
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={['6', '8']}
                    w="100%"
                  >
                    <Select
                      name="actuator1"
                      label="Atuador"
                      error={errors.actuator1}
                      {...register('actuator1')}
                    >
                      <option value="">Selecione</option>
                      {actuatorIsLoading ? (
                        <option disabled value={12}>
                          Carregando...
                        </option>
                      ) : actuatorError ? (
                        <option disabled value={123}>
                          Erro ao obter os atuadores
                        </option>
                      ) : (
                        actuatorData.map((actuator) => {
                          console.log(actuator);
                          return (
                            <option key={actuator.id} value={actuator.id}>
                              {actuator.name}
                            </option>
                          );
                        })
                      )}
                    </Select>
                    <Select
                      name="comparator1"
                      label="Comparador"
                      error={errors.comparator1}
                      {...register('comparator1')}
                    >
                      <option value={ComparatorType.Equals}>{'='}</option>
                      <option value={ComparatorType.GreaterThan}>{'>'}</option>
                      <option value={ComparatorType.LessThan}>{'<'}</option>
                      <option value={ComparatorType.DifferentFrom}>
                        {'!='}
                      </option>
                      <option value={ComparatorType.EqualOrLessThan}>
                        {'<='}
                      </option>
                      <option value={ComparatorType.EqualOrGreaterThan}>
                        {'>='}
                      </option>
                    </Select>
                    <Input
                      name="value1"
                      label="Valor"
                      error={errors.value1}
                      {...register('value1')}
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={['6', '8']}
                    w="100%"
                  >
                    <Select
                      name="grouping1"
                      label="Proxima condição"
                      error={errors.grouping1}
                      {...register('grouping1')}
                    >
                      <option value={NextConditionType.And}>Ou</option>
                      <option value={NextConditionType.Or}>E</option>
                    </Select>
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={['6', '8']}
                    w="100%"
                  >
                    <Select
                      name="actuator2"
                      label="Atuador"
                      error={errors.actuator2}
                      {...register('actuator2')}
                    >
                      <option value="">Selecione</option>
                      {actuatorIsLoading ? (
                        <option disabled value={12}>
                          Carregando...
                        </option>
                      ) : actuatorError ? (
                        <option disabled value={123}>
                          Erro ao obter os atuadores
                        </option>
                      ) : (
                        actuatorData.map((actuator) => {
                          console.log(actuator);
                          return (
                            <option key={actuator.id} value={actuator.id}>
                              {actuator.name}
                            </option>
                          );
                        })
                      )}
                    </Select>
                    <Select
                      name="comparator1"
                      label="Comparador"
                      error={errors.comparator1}
                      {...register('comparator1')}
                    >
                      <option value={ComparatorType.Equals}>{'='}</option>
                      <option value={ComparatorType.GreaterThan}>{'>'}</option>
                      <option value={ComparatorType.LessThan}>{'<'}</option>
                      <option value={ComparatorType.DifferentFrom}>
                        {'!='}
                      </option>
                      <option value={ComparatorType.EqualOrLessThan}>
                        {'<='}
                      </option>
                      <option value={ComparatorType.EqualOrGreaterThan}>
                        {'>='}
                      </option>
                    </Select>
                    <Input
                      name="value1"
                      label="Valor"
                      error={errors.value1}
                      {...register('value1')}
                    />
                  </SimpleGrid>
                </VStack>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                  <Select
                    name="sensor1"
                    label="Sensor"
                    error={errors.sensor1}
                    {...register('sensor1')}
                  >
                    <option value="">Selecione</option>
                    {sensorIsLoading ? (
                      <option disabled value={12}>
                        Carregando...
                      </option>
                    ) : sensorError ? (
                      <option disabled value={123}>
                        Erro ao obter os sensores
                      </option>
                    ) : (
                      sensorData.map((sensor) => {
                        console.log(sensor);
                        return (
                          <option key={sensor.id} value={sensor.id}>
                            {sensor.name}
                          </option>
                        );
                      })
                    )}
                  </Select>
                  <Select
                    name="comparator2"
                    label="Comparador"
                    error={errors.comparator2}
                    {...register('comparator2')}
                  >
                    <option value={ComparatorType.Equals}>{'='}</option>
                    <option value={ComparatorType.GreaterThan}>{'>'}</option>
                    <option value={ComparatorType.LessThan}>{'<'}</option>
                    <option value={ComparatorType.DifferentFrom}>{'!='}</option>
                    <option value={ComparatorType.EqualOrLessThan}>
                      {'<='}
                    </option>
                    <option value={ComparatorType.EqualOrGreaterThan}>
                      {'>='}
                    </option>
                  </Select>
                  <Input
                    name="value1"
                    label="Valor"
                    error={errors.value1}
                    {...register('value1')}
                  />
                </SimpleGrid>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                  <Select
                    name="grouping1"
                    label="Proxima condição"
                    error={errors.grouping1}
                    {...register('grouping1')}
                  >
                    <option value={NextConditionType.And}>Ou</option>
                    <option value={NextConditionType.Or}>E</option>
                  </Select>
                </SimpleGrid>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                  <Select
                    name="sensor2"
                    label="Sensor"
                    error={errors.sensor2}
                    {...register('sensor2')}
                  >
                    <option value="">Selecione</option>
                    {sensorIsLoading ? (
                      <option disabled value={12}>
                        Carregando...
                      </option>
                    ) : sensorError ? (
                      <option disabled value={123}>
                        Erro ao obter os sensores
                      </option>
                    ) : (
                      sensorData.map((sensor) => {
                        console.log(sensor);
                        return (
                          <option key={sensor.id} value={sensor.id}>
                            {sensor.name}
                          </option>
                        );
                      })
                    )}
                  </Select>
                  <Select
                    name="comparator2"
                    label="Comparador"
                    error={errors.comparator2}
                    {...register('comparator2')}
                  >
                    <option value={ComparatorType.Equals}>{'='}</option>
                    <option value={ComparatorType.GreaterThan}>{'>'}</option>
                    <option value={ComparatorType.LessThan}>{'<'}</option>
                    <option value={ComparatorType.DifferentFrom}>{'!='}</option>
                    <option value={ComparatorType.EqualOrLessThan}>
                      {'<='}
                    </option>
                    <option value={ComparatorType.EqualOrGreaterThan}>
                      {'>='}
                    </option>
                  </Select>
                  <Input
                    name="value1"
                    label="Valor"
                    error={errors.value1}
                    {...register('value1')}
                  />
                </SimpleGrid>
              </>
            )}
            <SimpleGrid w="100%" justifyContent="flex-end">
              <Flex>
                <Checkbox
                  name="simulationMode"
                  label="Modo simulação"
                  whiteSpace="nowrap"
                  mr="15px"
                  error={errors.simulationMode}
                  {...register('simulationMode')}
                />
                <Checkbox
                  name="enabled"
                  label="Habilitado"
                  whiteSpace="nowrap"
                  defaultChecked
                  error={errors.enabled}
                  {...register('enabled')}
                />
              </Flex>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                onClick={() => {
                  router.back();
                }}
                colorScheme="whiteAlpha"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="pink"
                type="submit"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const { environmentId } = ctx.query;
  return {
    props: { environmentId },
  };
});
