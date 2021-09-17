import React from 'react';
import { Box, chakra, Flex } from '@chakra-ui/react';

interface ImageCardProps {
  name: string;
  url: string;
}

export function ImageCard({
  name,
  url = 'https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80',
}: ImageCardProps) {
  return (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        w="sm"
        mx="auto"
      >
        <Box
          bg="gray.300"
          h={52}
          w="full"
          rounded="lg"
          shadow="md"
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage:
              // 'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)',
              `url(${url})`,
          }}
        ></Box>

        <Box
          w="85%"
          bg="rgb(10, 15, 10, 0.7)"
          mt={-5}
          shadow="lg"
          rounded="lg"
          overflow="hidden"
        >
          <chakra.h3
            py={2}
            textAlign="center"
            fontWeight="bold"
            textTransform="uppercase"
            color="white"
            letterSpacing={1}
          >
            {name}
          </chakra.h3>
        </Box>
      </Flex>
    </Flex>
  );
}
