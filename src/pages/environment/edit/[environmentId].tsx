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
import { AxiosError, AxiosResponse } from 'axios';
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
import { ImageProps, useImages } from 'hooks/useImage';
import { Checkbox } from 'components/Form/Checkbox';
import { ImageCard } from 'components/ImageCard';

type EditEnvironmentFormData = {
  name: string;
  description?: string;
  img?: ImageProps;
  enabled: boolean;
};

type Environment = {
  name: string;
  description: string;
  enabled: boolean;
  img?: ImageProps;
};

const EditEnvironmentFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  description: yup.string(),
  enabled: yup.boolean(),
});

export default function EditEnvironment() {
  const [image, setImage] = useState<ImageProps>({} as ImageProps);
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useImages();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        .then((response: AxiosResponse<Environment>) => {
          setEnvironment(response.data);
          setImage(response.data.img);
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

  const EditEnvironment = useMutation(
    async (environment: EditEnvironmentFormData) => {
      environment.img = image;
      environment.img.updatedAt = '2021-10-05T14:48:00.000Z';
      environment.img.createdAt = '2021-10-05T14:48:00.000Z';
      const response = await api.put(`/Environment/edit/${environmentId}`, {
        ...environment,
      });
      return response.data;
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

        queryClient.invalidateQueries('environments');
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

  const handleEditEnvironment: SubmitHandler<EditEnvironmentFormData> = async (
    values
  ) => {
    await EditEnvironment.mutateAsync(values);

    router.push('/environment');
  };

  const handleClickImage = (imageId: string) => {
    setImage(data.find((image) => image.id === imageId));
    onClose();
  };

  return (
    <Box>
      <Head>
        <title>iE | Edit environment</title>
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
                <Flex alignItems="center" mt={1}>
                  <Image
                    src={image?.url}
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
