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
import { TextArea } from 'components/Form/Textarea';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';

type CreateEnvironmentFormData = {
  name: string;
  description?: string;
};

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
});

export default function CreateEnvironment() {
  const router = useRouter();
  const toast = useToast();
  const createEnvironment = useMutation(
    async (environment: CreateEnvironmentFormData) => {
      const response = await api.post('Environment/create', { ...environment });
      return response.data.user;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso.',
          description: 'Ambiente criado.',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        queryClient.invalidateQueries('environments');
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

  const handleCreateEnvironment: SubmitHandler<CreateEnvironmentFormData> =
    async (values) => {
      await createEnvironment.mutateAsync(values);

      router.push('/environment');
    };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateEnvironment)}
        >
          <Heading size="lg" fontWeight="normal">
            Adicionar ambiente
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
