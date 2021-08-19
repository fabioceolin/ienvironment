import React from 'react';
import NextLink from 'next/link';
import {
  useBreakpointValue,
  useDisclosure,
  Spinner,
  Flex,
  Text,
  Icon,
  Box,
  Heading,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';

import { api } from 'services/apiClient';

import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useMCUControllers } from 'hooks/useMCUControllers';
import { queryClient } from 'services/queryClient';
import { UserCard } from 'components/UserCard';
import { Dialog } from 'components/Dialog';

export default function ControllerList() {
  const { data, isLoading, isFetching, error } = useMCUControllers();
  const { isOpen, onClose, onOpen } = useDisclosure();

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ['user', userId],
      async () => {
        const response = await api.get(`users/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutos
      }
    );
  }

  return (
    <Box>
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
          <Dialog
            title="Deletar"
            description="Deseja realmente apagar esse usuário?"
            isOpen={isOpen}
            onClose={onClose}
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
                    Email={user.description}
                    Role={1}
                    key={user.id}
                    Enabled={user.enabled}
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
