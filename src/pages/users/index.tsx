import NextLink from 'next/link';
import {
  Spinner,
  Flex,
  Text,
  Icon,
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Checkbox,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { useUsers } from 'hooks/useUsers';
import { queryClient } from 'services/queryClient';
import { api } from 'services/apiClient';
import { role } from 'enums/role';

export default function UserList() {
  const { data, isLoading, isFetching, error } = useUsers();

  console.log(data);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

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

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
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
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th px={['4', '4', '6']} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Permissão</Th>}
                    <Th width="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {data.map((user) => {
                    return (
                      <Tr key={user.Id}>
                        <Td px={['4', '4', '6']} color="gray.300" width="8">
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Link
                              color="purple.400"
                              // onMouseEnter={() => handlePrefetchUser(user.id)}
                            >
                              <Text fontWeight="Bold">{user.Name}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">
                              {user.Email}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && (
                          <Td>
                            <Text color="gray.300">
                              {user.Role === role.Adm
                                ? 'Administrator'
                                : 'User'}
                            </Text>
                          </Td>
                        )}
                        <Td>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          >
                            Editar
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
