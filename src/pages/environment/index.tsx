import React from 'react';
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
} from '@chakra-ui/react';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { EnvironmentCard } from 'components/EnvironmentCard';
import { useEnvironment } from 'hooks/useEnvironments';

import { RiAddLine } from 'react-icons/ri';

export default function EnvironmentList() {
  const { data, isLoading, isFetching, error } = useEnvironment();
  return (
    <Box>
      <Header />

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
            templateColumns="1fr 1fr 1fr"
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
