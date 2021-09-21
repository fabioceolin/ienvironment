import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

interface ImageCardProps {
  name: string;
  url: string;
  onClick: () => void;
}

export function ImageCard({
  name,
  url = 'https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80',
  onClick,
}: ImageCardProps) {
  return (
    <Flex
      w="full"
      alignItems="center"
      justifyContent="center"
      onClick={onClick}
      cursor="pointer"
      role="group"
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        w="sm"
        mx="auto"
        pos="relative"
      >
        <Box pos="relative">
          <Image
            src={url}
            fallbackSrc="https://images.unsplash.com/photo-1462826303086-329426d1aef5"
            bg="gray.300"
            h={52}
            w="full"
            rounded="lg"
            shadow="md"
            objectFit="cover"
            objectPosition="center"
          />
          <Box
            bg="rgb(0,0,0,0.5)"
            h="40px"
            w="full"
            pos="absolute"
            top="0"
            left="0"
            display="none"
            justifyContent="center"
            alignItems="center"
            _groupHover={{
              transition: 'all 3s ease',
              display: 'flex',
            }}
          >
            <Text>Detalhes</Text>
          </Box>
        </Box>

        <Box
          w="200px"
          p="0 10px"
          bg="rgb(10, 15, 10, 0.7)"
          mt={-5}
          shadow="lg"
          rounded="lg"
          overflow="hidden"
          zIndex={1}
        >
          <Box
            as="h3"
            py={2}
            textAlign="center"
            fontWeight="bold"
            textTransform="uppercase"
            color="white"
            letterSpacing={1}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {name}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
