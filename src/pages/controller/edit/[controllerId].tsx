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

import { Form } from 'components/Skeleton/Form';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { Input } from 'components/Form/Input';
import { TextArea } from 'components/Form/Textarea';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';
import { UsersProps } from 'hooks/useUsers';

type CreateControllerFormData = {
  name: string;
  login: string;
  password: string;
  description?: string;
};

type User = UsersProps & {
  login: string;
};

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  role: yup.number().required('Permissão obrigatória'),
});

export default function EditUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [controller, setController] = useState<User>({} as User);
  const router = useRouter();
  const toast = useToast();
  const { controllerId } = router.query;

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(CreateUserFormSchema),
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

  //set hook forms value
  useEffect(() => {
    setValue('name', controller.name);
    setValue('email', controller.email);
  }, [controller]);

  const createUser = useMutation(
    async (user: CreateControllerFormData) => {
      const response = await api.put(
        `MCUControllers/edit/{id}/${controllerId}`,
        { ...user }
      );
      return response.data.user;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Usuário criado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('users');
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

  const handleCreateUser: SubmitHandler<CreateControllerFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);

    router.push('/users');
  };

  return (
    <Box>
      <Head>
        <title>iE | Edit user</title>
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
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <Heading size="lg" fontWeight="normal">
              Editar usuário
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
                <Input
                  name="login"
                  label="Login"
                  error={errors.login}
                  {...register('login')}
                />
                <Input
                  name="password"
                  type="password"
                  label="Senha"
                  error={errors.password}
                  {...register('password')}
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
            </VStack>
            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/users" passHref>
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
