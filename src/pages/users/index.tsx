import React, { useState } from 'react';
import Head from 'next/head';
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
import { useUsers } from 'hooks/useUsers';
import { queryClient } from 'services/queryClient';
import { UserCard } from 'components/UserCard';
import { Dialog } from 'components/Dialog';

export default function UserList() {
  const [ClickedUserID, setClickedUserID] = useState<string>('');
  const { data, isLoading, isFetching, error } = useUsers();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();

  const handleOpenDialog = (userID: string) => {
    onOpen();
    setClickedUserID(userID);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      toast({
        title: 'Internal error.',
        description: 'Falha ao obter o ID do usuário.',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }

    const response = await api.delete(`user/delete/${userId}`);

    response.status == 200
      ? toast({
          title: 'Sucesso!',
          description: response.data,
          status: 'error',
          position: 'top-right',
          isClosable: true,
        })
      : toast({
          title: 'Internal error.',
          description: 'Falha ao deletar o usuário.',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });

    setClickedUserID('');
    queryClient.invalidateQueries('users');
    onClose();
  };

  return (
    <Box>
      <Head>
        <title>iE | Users</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
            <NextLink href="/users/create" passHref>
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
          <Dialog
            title="Deletar"
            description="Deseja realmente apagar esse usuário?"
            isOpen={isOpen}
            onClose={onClose}
            onYesClick={() => handleDeleteUser(ClickedUserID)}
          />

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários</Text>
            </Flex>
          ) : (
            <SimpleGrid
              flex="1"
              gap="4"
              minChildWidth="320px"
              templateRows="auto 1fr"
              align="flex-start"
            >
              {data.map((user) => {
                return (
                  <UserCard
                    Id={user.id}
                    Name={user.name}
                    Email={user.email}
                    Role={user.role}
                    Enabled={user.enabled}
                    key={user.id}
                    onRightButtonClick={() => handleOpenDialog(user.id)}
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
