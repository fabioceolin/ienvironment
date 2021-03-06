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
import { Checkbox } from 'components/Form/Checkbox';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';

type CreateControllerFormData = {
  name: string;
  login: string;
  password: string;
  description?: string;
  enabled: boolean;
};

type Controller = {
  id: string;
  name: string;
  description: string;
  login: string;
  password: string;
  enabled: boolean;
};

const EditControllerFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  login: yup.string().required('Login obrigatório'),
  password: yup.string().required('Senha obrigatória'),
  description: yup.string().nullable(),
  enabled: yup.boolean(),
});

export default function EditController() {
  const [isLoading, setIsLoading] = useState(true);
  const [controller, setController] = useState<Controller>({} as Controller);
  const router = useRouter();
  const toast = useToast();
  const { controllerId } = router.query;

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditControllerFormSchema),
  });

  useEffect(() => {
    if (controllerId) {
      api
        .get(`MCUControllers/getById/${controllerId}`)
        .then((response) => {
          setController(response.data);
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

  const editController = useMutation(
    async (controllerForm: CreateControllerFormData) => {
      if (controllerForm.password === controller.password)
        controllerForm.password = null;
      const response = await api.put(`MCUControllers/edit/${controllerId}`, {
        ...controllerForm,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Usuário atualizado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('MCUControllers');
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

  const { errors } = formState;

  const handleEditController: SubmitHandler<CreateControllerFormData> = async (
    values
  ) => {
    await editController.mutateAsync(values);

    router.push('/controller');
  };

  return (
    <Box>
      <Head>
        <title>iE | Edit controller</title>
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
            onSubmit={handleSubmit(handleEditController)}
          >
            <Heading size="lg" fontWeight="normal">
              Editar controlador
            </Heading>

            <Divider my="6" borderColor="gray.700" />
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="name"
                  label="Nome"
                  defaultValue={controller.name}
                  error={errors.name}
                  {...register('name')}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="login"
                  label="Login"
                  defaultValue={controller.login}
                  error={errors.login}
                  {...register('login')}
                />
                <Input
                  name="password"
                  type="password"
                  label="Senha"
                  defaultValue={controller.password}
                  error={errors.password}
                  {...register('password')}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <TextArea
                  name="description"
                  label="Descrição"
                  defaultValue={controller.description}
                  error={errors.description}
                  {...register('description')}
                />
              </SimpleGrid>
              <SimpleGrid w="100%" justifyContent="flex-end">
                <Checkbox
                  name="enable"
                  label="Habilitado"
                  defaultChecked={controller.enabled}
                  error={errors.enabled}
                  {...register('enabled')}
                />
              </SimpleGrid>
            </VStack>
            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/controller" passHref>
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
