import {
  Box,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

type FormProps = {
  backgroundColor: string;
};

export function Form({ backgroundColor = 'gray.800' }: FormProps) {
  return (
    <Box
      p={['6', '8']}
      boxShadow="lg"
      bg={backgroundColor}
      flex="1"
      borderRadius={8}
    >
      <Skeleton h="50px" w="45%" />
      <Divider my="6" borderColor="gray.700" />
      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Skeleton h="40px" />
          <Skeleton h="40px" />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Skeleton h="40px" />
          <Skeleton h="40px" />
        </SimpleGrid>
      </VStack>
      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Skeleton h="40px" w="90px" />
          <Skeleton h="40px" w="90px" />
        </HStack>
      </Flex>
    </Box>
  );
}
