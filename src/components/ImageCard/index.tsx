import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

interface ImageCardProps {
  name: string;
  hoverText: string;
  url: string;
  onClick: () => void;
}

export function ImageCard({
  name,
  hoverText,
  url = 'https://via.placeholder.com/300x230/?text=300%20x%20230',
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
            fallbackSrc="https://via.placeholder.com/300x230/?text=300%20x%20230"
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
            <Text>{hoverText}</Text>
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
