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

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { Input } from 'components/Form/Input';
import { Select } from 'components/Form/Select';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';
import { role } from 'enums/role';

type CreateUserFormData = {
  name: string;
  login: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: number;
};

type User = {
  id: string;
  name: string;
  login: string;
  email: string;
  role: number;
};

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  login: yup.string().required('Login obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(6, 'No minimo 6 caracteres'),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
  role: yup.number().required('Permissão obrigatória'),
});

export default function EditUser() {
  const [user, setUser] = useState<User>({} as User);
  const router = useRouter();
  const toast = useToast();
  const { userId } = router.query;

  useEffect(() => {
    if (userId) {
      api
        .get(`user?UserID=${userId}`)
        .then((response) => {
          setUser(response.data);
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

  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const response = await api.put(`user/edit/${userId}`, { ...user });
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

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(CreateUserFormSchema),
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
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
                label="Nome completo"
                defaultValue={user.name}
                error={errors.name}
                {...register('name')}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                defaultValue={user.email}
                error={errors.email}
                {...register('email')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="login"
                label="Login"
                defaultValue={user.login}
                error={errors.login}
                {...register('login')}
              />
              <Select
                name="role"
                label="Permissão"
                defaultValue={user.role}
                error={errors.role}
                {...register('role')}
              >
                <option value={role.Adm}>Administrator</option>
                <option value={role.User}>User</option>
              </Select>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={errors.password}
                {...register('password')}
              />
              <Input
                name="password_confirmation"
                type="password"
                error={errors.password_confirmation}
                label="Confirmação da senha"
                {...register('password_confirmation')}
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
      </Flex>
    </Box>
  );
}
