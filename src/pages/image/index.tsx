import React, { useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
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

import { Header } from 'components/Header';
import { Sidebar } from 'components/Sidebar';
import { queryClient } from 'services/queryClient';
import { UserCardSkeleton } from 'components/Skeleton/UserCardSkeleton';
import { ImageCard } from 'components/ImageCard';
import { ImageProps, useImages } from 'hooks/useImage';
import Upload from 'components/Upload';
import { ImageModal } from 'components/ImageModal';

export default function ImageList() {
  const [image, setImage] = useState<ImageProps>({} as ImageProps);
  const { data, isLoading, isFetching, error } = useImages();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleClickImage = (imageId: string) => {
    setImage(data.find((image) => image.id === imageId));
    onOpen();
  };

  return (
    <Box>
      <Head>
        <title>iE | Image</title>
      </Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <ImageModal image={image} isOpen={isOpen} onClose={onClose} />

        <Box flex="1" borderRadius={8}>
          <Flex mb="8" flexDir="column">
            <Heading size="lg" fontWeight="normal">
              Upload
            </Heading>
            <Upload invalidateQuery="images" />
            <Heading size="lg" fontWeight="normal">
              Media
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
          </Flex>

          {isLoading ? (
            <SimpleGrid
              flex="1"
              gap="4"
              columns={[1, null, 3]}
              templateRows="auto 1fr"
              align="flex-start"
            >
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </SimpleGrid>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha as imagens</Text>
            </Flex>
          ) : (
            <SimpleGrid
              flex="1"
              gap="4"
              columns={[1, null, 3, 4]}
              templateRows="auto 1fr"
              align="flex-start"
            >
              {data.map((image: ImageProps) => {
                return (
                  <ImageCard
                    key={image.id}
                    name={image.altName}
                    url={image.url}
                    onClick={() => handleClickImage(image.id)}
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
