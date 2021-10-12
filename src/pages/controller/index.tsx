import React, { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import NextLink from 'next/link';
import {
  useDisclosure,
  Spinner,
  Flex,
  Text,
  Icon,
  Box,
  Heading,
  Button,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';

import { api } from 'services/apiClient';

import { RiAddLine } from 'react-icons/ri';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useMCUControllers } from 'hooks/useMCUControllers';
import { queryClient } from 'services/queryClient';
import { UserCard } from 'components/UserCard';
import { Dialog } from 'components/Dialog';
import { UserCardSkeleton } from 'components/Skeleton/UserCardSkeleton';

export default function ControllerList() {
  const [ClickedControllerID, setClickedControllerID] = useState<string>('');
  const { data, isLoading, isFetching, error } = useMCUControllers();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();

  const handleOpenDialog = (controllerId: string) => {
    onOpen();
    setClickedControllerID(controllerId);
  };

  const handleEditClick = (controllerId: string) => {
    router.push(`controller/edit/${controllerId}`);
  };
  const handleDeleteUser = async (controllerId: string) => {
    if (!controllerId) {
      toast({
        title: 'Internal error.',
        description: 'Falha ao obter o ID do controlador.',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }

    const response = await api.delete(`/MCUControllers/delete/${controllerId}`);

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
          description: 'Falha ao deletar o controlador.',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });

    setClickedControllerID('');
    queryClient.invalidateQueries('MCUControllers');
    onClose();
  };

  return (
    <Box>
      <Head>
        <title>iE | Controller</title>
      </Head>
      <Header />

      <Dialog
        title="Deletar"
        description="Deseja realmente apagar esse usuário?"
        isOpen={isOpen}
        onClose={onClose}
        onYesClick={() => handleDeleteUser(ClickedControllerID)}
      />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Controlador
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
            <NextLink href="/controller/create" passHref>
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

          {isLoading ? (
            <SimpleGrid
              flex="1"
              gap="4"
              columns={[1, null, 3]}
              templateRows="auto 1fr"
              align="flex-start"
            >
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </SimpleGrid>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos controladores</Text>
            </Flex>
          ) : (
            <SimpleGrid
              flex="1"
              gap="4"
              columns={[1, null, 3]}
              templateRows="auto 1fr"
              align="flex-start"
            >
              {data.map((controller) => {
                return (
                  <UserCard
                    Id={controller.id}
                    Name={controller.name}
                    Email={controller.description}
                    Role={`Login: ${controller.login}`}
                    key={controller.id}
                    Enabled={controller.enabled}
                    onRightButtonClick={() => handleOpenDialog(controller.id)}
                    onLeftButtonClick={() => handleEditClick(controller.id)}
                  />
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
