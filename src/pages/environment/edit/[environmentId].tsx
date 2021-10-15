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
import Link from 'next/link';
import { useMutation } from 'react-query';
import { withSSRAuth } from 'utils/withSSRAuth';

import { Form } from 'components/Skeleton/Form';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { Input } from 'components/Form/Input';
import { TextArea } from 'components/Form/Textarea';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';
import { Checkbox } from 'components/Form/Checkbox';

type EditEnvironmentFormData = {
  name: string;
  login: string;
  password: string;
  description?: string;
  enabled: boolean;
};

type Environment = {
  name: string;
  description: string;
  enabled: boolean;
};

const EditEnvironmentFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  description: yup.string(),
  enabled: yup.boolean(),
});

export default function EditEnvironment() {
  const [isLoading, setIsLoading] = useState(true);
  const [environment, setEnvironment] = useState<Environment>(
    {} as Environment
  );
  const router = useRouter();
  const toast = useToast();
  const { environmentId } = router.query;

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditEnvironmentFormSchema),
  });

  useEffect(() => {
    if (environmentId) {
      api
        .get(`Environment?EnvironmentID=${environmentId}`)
        .then((response) => {
          setEnvironment(response.data);
          setIsLoading(false);
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

  //set hook forms value
  // useEffect(() => {
  //   setValue('name', environment.name);
  //   setValue('description', environment.description);
  // }, [environment]);

  const EditEnvironment = useMutation(
    async (environment: EditEnvironmentFormData) => {
      const response = await api.put(`/Environment/edit/${environmentId}`, {
        ...environment,
      });
      console.log(environment);
      console.log(response.data);
      return response.data.user;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Ambiente atualizado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('environment');
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

  const { errors } = formState;

  const handleEditEnvironment: SubmitHandler<EditEnvironmentFormData> = async (
    values
  ) => {
    console.log(values);
    await EditEnvironment.mutateAsync(values);

    router.push('/environment');
  };

  return (
    <Box>
      <Head>
        <title>iE | Edit environment</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        {isLoading ? (
          <Form backgroundColor="gray.800" />
        ) : (
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={['6', '8']}
            onSubmit={handleSubmit(handleEditEnvironment)}
          >
            <Heading size="lg" fontWeight="normal">
              Editar ambiente
            </Heading>

            <Divider my="6" borderColor="gray.700" />
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="name"
                  label="Nome"
                  defaultValue={environment.name}
                  error={errors.name}
                  {...register('name')}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <TextArea
                  name="description"
                  label="Descrição"
                  defaultValue={environment.description}
                  error={errors.description}
                  {...register('description')}
                />
              </SimpleGrid>
              <SimpleGrid w="100%" justifyContent="flex-end">
                <Checkbox
                  name="enabled"
                  label="Habilitado"
                  defaultChecked={environment.enabled}
                  error={errors.enabled}
                  {...register('enabled')}
                />
              </SimpleGrid>
            </VStack>
            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/environment" passHref>
                  <Button colorScheme="whiteAlpha">Cancelar</Button>
                </Link>
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
