import React, { useEffect, useState } from 'react';
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
import { EntityType } from 'utils/enums';
import { useMCUControllers } from 'hooks/useMCUControllers';
import { TextArea } from 'components/Form/Textarea';
import { Actuator } from 'hooks/useActuator';
import { Form } from 'components/Skeleton/Form';

type EditActuatorFormData = {
  name: string;
  description: string;
  entityType: number;
  environmentId: string;
  enabled: boolean;
  simulationMode: boolean;
  microcontrollerID: string;
  autoDisconnectSeconds: number;
};

const EditActuatorFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  description: yup.string(),
  microcontrollerID: yup.string().required('Microcontrolador obrigatório'),
  entityType: yup.number().required('Tipo de dado obrigatório'),
  autoDisconnectSeconds: yup.number(),
  simulationMode: yup.boolean(),
  enabled: yup.boolean(),
});

export default function EditActuator() {
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [actuator, setActuator] = useState<Actuator>({} as Actuator);
  const router = useRouter();
  const toast = useToast();
  const { environmentId, actuatorId } = router.query;
  const { data, isLoading, error } = useMCUControllers();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditActuatorFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    if (actuatorId) {
      api
        .get(`actuator/getById/${actuatorId}`)
        .then((response) => {
          setActuator(response.data);
          setIsLoadingForm(false);
        })
        .catch((error: AxiosError) => {
          toast({
            title: `Erro ${error.request.status}.`,
            description: error.message,
            status: 'error',
            duration: 9000,
            position: 'top-right',
            isClosable: true,
          });
        });
    }
  }, []);

  const editActuator = useMutation(
    async (actuatorForm: EditActuatorFormData) => {
      actuatorForm.environmentId = environmentId as string;
      const response = await api.put(`Actuator/Update?id=${actuator.id}`, {
        ...actuatorForm,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Atuador atualizado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('Actuators');
      },
      onError: (error: AxiosError) => {
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

  const handleCreateActuator: SubmitHandler<EditActuatorFormData> = async (
    values
  ) => {
    await editActuator.mutateAsync(values);

    router.back();
  };

  return (
    <Box>
      <Head>
        <title>iE | Editar atuador</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        {isLoadingForm ? (
          <Form backgroundColor="gray.800" />
        ) : (
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={['6', '8']}
            onSubmit={handleSubmit(handleCreateActuator)}
          >
            <Heading size="lg" fontWeight="normal">
              Editar atuador
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="name"
                  label="Nome"
                  defaultValue={actuator.name}
                  error={errors.name}
                  {...register('name')}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <TextArea
                  name="description"
                  label="Descrição"
                  defaultValue={actuator.description}
                  error={errors.description}
                  {...register('description')}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Select
                  name="microcontrollerID"
                  label="Microcontrolador"
                  error={errors.microcontrollerID}
                  {...register('microcontrollerID')}
                >
                  <option value="">Selecione</option>
                  {isLoading ? (
                    <option disabled value={12}>
                      Carregando...
                    </option>
                  ) : error ? (
                    <option disabled value={123}>
                      Erro ao obter os microcontroladores
                    </option>
                  ) : (
                    data.map((microcontroller) => {
                      return (
                        <option
                          key={microcontroller.id}
                          value={microcontroller.id}
                          selected={
                            microcontroller.id === actuator.microcontrollerID
                          }
                        >
                          {microcontroller.name}
                        </option>
                      );
                    })
                  )}
                </Select>
                <Select
                  name="entityType"
                  label="Tipo de dado"
                  error={errors.entityType}
                  {...register('entityType')}
                >
                  <option
                    value={EntityType.String}
                    selected={actuator.entityType == EntityType.String}
                  >
                    Texto
                  </option>
                  <option
                    value={EntityType.Int}
                    selected={actuator.entityType == EntityType.Int}
                  >
                    Inteiro
                  </option>
                  <option
                    value={EntityType.Boolean}
                    selected={actuator.entityType == EntityType.Boolean}
                  >
                    Booleano
                  </option>
                  <option
                    value={EntityType.Numeric}
                    selected={actuator.entityType == EntityType.Numeric}
                  >
                    Decimal
                  </option>
                </Select>
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="autoDisconnectSeconds"
                  type="number"
                  label="Auto desconectar (segundos)"
                  defaultValue={actuator.autoDisconnectSeconds}
                  error={errors.autoDisconnectSeconds}
                  {...register('autoDisconnectSeconds')}
                />
              </SimpleGrid>

              <SimpleGrid w="100%" justifyContent="flex-end">
                <Flex>
                  <Checkbox
                    name="simulationMode"
                    label="Modo simulação"
                    whiteSpace="nowrap"
                    mr="15px"
                    defaultChecked={actuator.simulationMode}
                    error={errors.simulationMode}
                    {...register('simulationMode')}
                  />
                  <Checkbox
                    name="enabled"
                    label="Habilitado"
                    whiteSpace="nowrap"
                    defaultChecked={actuator.enabled}
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
        )}
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
