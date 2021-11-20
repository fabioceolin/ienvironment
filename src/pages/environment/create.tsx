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
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { withSSRAuth } from 'utils/withSSRAuth';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { Input } from 'components/Form/Input';
import { TextArea } from 'components/Form/Textarea';
import { Checkbox } from 'components/Form/Checkbox';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';
import { useRouter } from 'next/router';
import { ImageProps, useImages } from 'hooks/useImage';
import { ImageCard } from 'components/ImageCard';

type CreateEnvironmentFormData = {
  name: string;
  description?: string;
  img?: ImageProps;
  enabled: boolean;
};

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
});

export default function CreateEnvironment() {
  const [image, setImage] = useState<ImageProps>({} as ImageProps);
  const { data } = useImages();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const createEnvironment = useMutation(
    async (environment: CreateEnvironmentFormData) => {
      environment.img = image;
      environment.img.updatedAt = '2021-10-05T14:48:00.000Z';
      environment.img.createdAt = '2021-10-05T14:48:00.000Z';
      const response = await api.post('Environment/create', { ...environment });
      return response.data;
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

  const handleClickImage = (imageId: string) => {
    setImage(data.find((image) => image.id === imageId));
    onClose();
  };

  return (
    <Box>
      <Head>
        <title>iE | Create environment</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent bg="gray.800">
            <ModalHeader>Escolha uma imagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid
                flex="1"
                gap="4"
                columns={{ sm: 2, md: 3, lg: 4, xl: 5 }}
                templateRows="auto 1fr"
                align="flex-start"
              >
                {data?.map((image: ImageProps) => {
                  return (
                    <ImageCard
                      key={image.id}
                      name={image.altName}
                      hoverText="Selecionar"
                      url={image.url}
                      onClick={() => handleClickImage(image.id)}
                    />
                  );
                })}
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="pink" mr={3} onClick={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
              <Flex alignItems="center" mt={1}>
                <Image
                  src={image.url}
                  fallbackSrc="https://via.placeholder.com/300x230/?text=300%20x%20230"
                  bg="gray.300"
                  h={40}
                  w={48}
                  rounded="lg"
                  shadow="md"
                  objectFit="cover"
                  objectPosition="center"
                />
                <Flex flexDir="column" ml={5} alignItems="flex-start">
                  <Heading size="md">Selecione uma imagem</Heading>
                  <Button
                    mt={3}
                    w="full"
                    type="button"
                    variant="outline"
                    colorScheme="pink"
                    size="sm"
                    fontWeight="medium"
                    transition="all 0.3s ease"
                    _hover={{
                      backgroundColor: 'pink.100',
                    }}
                    _focus={{ shadow: 'none' }}
                    onClick={onOpen}
                  >
                    Alterar
                  </Button>
                </Flex>
              </Flex>
            </SimpleGrid>

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
            <SimpleGrid w="100%" justifyContent="flex-end">
              <Checkbox
                name="enable"
                label="Habilitado"
                defaultChecked
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
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
