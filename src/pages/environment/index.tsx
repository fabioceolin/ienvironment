import React, { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import NextLink from 'next/link';
import {
  Flex,
  Box,
  SimpleGrid,
  Text,
  Heading,
  Button,
  Icon,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { api } from 'services/apiClient';

import { Dialog } from 'components/Dialog';
import { EnvironmentCard } from 'components/EnvironmentCard';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useEnvironment } from 'hooks/useEnvironments';
import { withSSRAuth } from 'utils/withSSRAuth';

import { RiAddLine } from 'react-icons/ri';
import { queryClient } from 'services/queryClient';

export default function EnvironmentList() {
  const [ClickedEnvironmentID, setClickedEnvironmentID] = useState<string>('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data, isLoading, isFetching, error } = useEnvironment();
  const toast = useToast();

  const handleOpenDialog = (environmentID: string) => {
    onOpen();
    setClickedEnvironmentID(environmentID);
  };

  const handleEditClick = (environmentID: string) => {
    router.push(`environment/edit/${environmentID}`);
  };

  const handleViewClick = (environmentID: string) => {
    router.push(`environment/view/${environmentID}`);
  };

  const handleDeleteUser = async (environmentID: string) => {
    if (!environmentID) {
      toast({
        title: 'Internal error.',
        description: 'Falha ao obter o ID do ambiente.',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }

    const response = await api.delete(`environment/delete/${environmentID}`);

    response.status == 200
      ? toast({
          title: 'Sucesso!',
          description: response.data,
          status: 'success',
          position: 'top-right',
          isClosable: true,
        })
      : toast({
          title: 'Internal error.',
          description: 'Falha ao deletar o ambiente.',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });

    setClickedEnvironmentID('');
    queryClient.invalidateQueries('environments');
    onClose();
  };

  return (
    <Box>
      <Head>
        <title>iE | Environment</title>
      </Head>
      <Header />

      <Dialog
        title="Deletar"
        description="Deseja realmente apagar esse usuário?"
        isOpen={isOpen}
        onClose={onClose}
        onYesClick={() => handleDeleteUser(ClickedEnvironmentID)}
      />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Ambientes
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
            <NextLink href="/environment/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Adicionar
              </Button>
            </NextLink>
          </Flex>
          <SimpleGrid
            flex="1"
            gap="4"
            columns={[1, null, 3]}
            templateRows="auto 1fr"
            align="flex-start"
          >
            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos ambientes</Text>
              </Flex>
            ) : (
              data.map((environment) => {
                return (
                  <EnvironmentCard
                    key={environment.id}
                    title={environment.name}
                    description={environment.description}
                    imageUrl={environment.img?.url}
                    enabled={environment.enabled}
                    onDeleteButtonClick={() => handleOpenDialog(environment.id)}
                    onEditButtonClick={() => handleEditClick(environment.id)}
                    onViewButtonClick={() => handleViewClick(environment.id)}
                  />
                );
              })
            )}
          </SimpleGrid>
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
