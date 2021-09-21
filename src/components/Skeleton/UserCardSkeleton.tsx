import {
  Box,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

export function UserCardSkeleton() {
  return (
    <Box
      p={['6', '8']}
      bg="gray.800"
      shadow="0 0 20px rgba(0, 0, 0, 0.05)"
      borderRadius={8}
      pb="4"
      textAlign="center"
    >
      <VStack alignItems="center" spacing={4}>
        <SkeletonCircle size="96px" />
        <Skeleton h="28px" w="100%" />
        <Skeleton h="24px" w="100%" />
        <Skeleton h="24px" w="100%" />
        <Flex justify="flex-end">
          <HStack spacing="4">
            <Skeleton h="40px" w="125px" rounded="full" />
            <Skeleton h="40px" w="125px" rounded="full" />
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
}
