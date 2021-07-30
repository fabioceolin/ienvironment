import React from 'react';
import { Flex, Box, SimpleGrid, Text, Spinner } from '@chakra-ui/react';

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { EnvironmentCard } from 'components/EnvironmentCard';
import { useEnvironment } from 'hooks/useEnvironments';

export default function EnvironmentList() {
  const { data, isLoading, isFetching, error } = useEnvironment();
  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

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
      </Flex>
    </Box>
  );
}
