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

type CreateEventFormData = {
  name: string;
  description: string;
  coolDownSeconds: number;
  actuatorId: string;
  actuatorValue: string;
  value: string;
  enabled: boolean;
  startTime?: string;
  endTime?: string;
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sensorId?: string;
  sensorValue?: string;
  comparator?: number;
};

const CreateEventFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  description: yup.string(),
  actuatorId: yup.string().required('Atuador obrigatório'),
  actuatorValue: yup.string().required('Valor obrigatório para o atuador'),
  coolDownSeconds: yup.number(),
  startTime: yup
    .string()
    .matches(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato incorreto de data e hora (hh:mm)'
    ),
  endTime: yup
    .string()
    .matches(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato incorreto de data e hora (hh:mm)'
    ),
  enabled: yup.boolean(),
});

export default function CreateEvent({ environmentId }) {
  const router = useRouter();
  const [eventType, setEventType] = useState<string>('0');
  const toast = useToast();
  const {
    data: sensorData,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = useSensorsByEnvironmentId(environmentId);

  const {
    data: actuatorData,
    isLoading: actuatorIsLoading,
    error: actuatorError,
  } = useActuatorsByEnvironmentId(environmentId);

  const createEvent = useMutation(
    async (event: CreateEventFormData) => {
      let EventCreate;
      switch (eventType) {
        case EventType.Manual.toString():
          EventCreate = {
            name: event.name,
            description: event.description,
            isManual: eventType == EventType.Manual.toString(),
            coolDownSeconds: event.coolDownSeconds,
            environmentId: environmentId as string,
            whatExecute: [
              {
                actuatorId: event.actuatorId,
                value: event.actuatorValue,
              },
            ],
            enabled: event.enabled,
          };
          break;

        case EventType.Temporal.toString():
          EventCreate = {
            name: event.name,
            description: event.description,
            timeBased: eventType == EventType.Temporal.toString(),
            coolDownSeconds: event.coolDownSeconds,
            environmentId: environmentId as string,
            whatExecute: [
              {
                actuatorId: event.actuatorId,
                value: event.actuatorValue,
              },
            ],
            runningDays: [
              event.sunday,
              event.monday,
              event.tuesday,
              event.wednesday,
              event.thursday,
              event.friday,
              event.saturday,
            ].filter(Boolean),
            startTime: event.startTime,
            endTime: event.endTime,
            enabled: event.enabled,
          };
          break;

        case EventType.Conditional.toString():
          EventCreate = {
            name: event.name,
            description: event.description,
            coolDownSeconds: event.coolDownSeconds,
            environmentId: environmentId as string,
            whenExecute: [
              {
                sensorId: event.sensorId,
                value: event.sensorValue,
                comparator: event.comparator,
                nextCondition: 0,
              },
            ],
            whatExecute: [
              {
                actuatorId: event.actuatorId,
                value: event.actuatorValue,
              },
            ],
            enabled: event.enabled,
          };
          break;

        default:
          break;
      }

      console.log(event);
      console.log(EventCreate);
      const response = await api.post('event/create', { ...EventCreate });
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Evento criado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('Events');
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

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(CreateEventFormSchema),
  });

  const { errors } = formState;

  const handleCreateEvent: SubmitHandler<CreateEventFormData> = async (
    values
  ) => {
    await createEvent.mutateAsync(values);

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
          onSubmit={handleSubmit(handleCreateEvent)}
        >
          <Heading size="lg" fontWeight="normal">
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
                name="coolDownSeconds"
                label="Cooldown (segundos)"
                type="number"
                defaultValue={0}
                error={errors.coolDownSeconds}
                {...register('coolDownSeconds')}
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
                    name="startTime"
                    label="Hora de inicio (hh:mm)"
                    error={errors.startTime}
                    {...register('startTime')}
                  />
                  <Input
                    name="endTime"
                    label="Hora de fim (hh:mm)"
                    error={errors.endTime}
                    {...register('endTime')}
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
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Select
                  name="sensorId"
                  label="Sensor"
                  error={errors.sensorId}
                  {...register('sensorId')}
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
                      return (
                        <option key={sensor.id} value={sensor.id}>
                          {sensor.name}
                        </option>
                      );
                    })
                  )}
                </Select>
                <Select
                  name="comparator"
                  label="Comparador"
                  error={errors.comparator}
                  {...register('comparator')}
                >
                  <option value={ComparatorType.Equals}>{'='}</option>
                  <option value={ComparatorType.GreaterThan}>{'>'}</option>
                  <option value={ComparatorType.LessThan}>{'<'}</option>
                  <option value={ComparatorType.DifferentFrom}>{'!='}</option>
                  <option value={ComparatorType.EqualOrLessThan}>{'<='}</option>
                  <option value={ComparatorType.EqualOrGreaterThan}>
                    {'>='}
                  </option>
                </Select>
                <Input
                  name="sensorValue"
                  label="Valor"
                  error={errors.sensorValue}
                  {...register('sensorValue')}
                />
              </SimpleGrid>
            )}

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Select
                name="actuatorId"
                label="Atuador"
                error={errors.actuatorId}
                {...register('actuatorId')}
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
                    return (
                      <option key={actuator.id} value={actuator.id}>
                        {actuator.name}
                      </option>
                    );
                  })
                )}
              </Select>
              <Input
                name="actuatorValue"
                label="Valor"
                error={errors.actuatorValue}
                {...register('actuatorValue')}
              />
            </SimpleGrid>

            <SimpleGrid w="100%" justifyContent="flex-end">
              <Flex>
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
