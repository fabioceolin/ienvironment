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
  Spinner,
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
import { UsersProps } from 'hooks/useUsers';
import { Role } from 'enums/Role';
import { Form } from 'components/Skeleton/Form';

type CreateUserFormData = {
  name: string;
  login: string;
  email: string;
  role: number;
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
  const [user, setUser] = useState<User>({} as User);
  const router = useRouter();
  const toast = useToast();
  const { userId } = router.query;

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(CreateUserFormSchema),
  });

  useEffect(() => {
    if (userId) {
      api
        .get(`user?UserID=${userId}`)
        .then((response) => {
          setUser(response.data);
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
    setValue('name', user.name);
    setValue('email', user.email);
  }, [user]);

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
                  isDisabled
                  {...register('login')}
                />
                <Select
                  name="role"
                  label="Permissão"
                  defaultValue={user.role}
                  error={errors.role}
                  {...register('role')}
                >
                  <option
                    value={Role.Administrator}
                    selected={user.role == Role.Administrator}
                  >
                    Administrator
                  </option>
                  <option value={Role.User} selected={user.role == Role.User}>
                    User
                  </option>
                </Select>
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
