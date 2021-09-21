import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  DarkMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import filesize from 'filesize';

import { ImageProps } from 'hooks/useImage';
import { Dialog } from 'components/Dialog';
import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';

interface ImageModalProps {
  image: ImageProps;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  const toast = useToast();
  const dialogState = useDisclosure();

  const handleDeleteImage = async () => {
    if (!image.id) {
      toast({
        title: 'Internal error.',
        description: 'Falha ao obter o ID da imagem.',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }

    const response = await api.delete(`Image/Delete/${image.id}`);

    response.status == 200
      ? toast({
          title: 'Sucesso!',
          description: response.data,
          status: 'success',
          position: 'top-right',
          isClosable: true,
        })
      : toast({
          title: 'Internal error.',
          description: 'Falha ao deletar a imagem.',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });

    queryClient.invalidateQueries('images');
    dialogState.onClose();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <Dialog
        title="Deletar"
        description="Deseja realmente apagar essa imagem?"
        isOpen={dialogState.isOpen}
        onClose={dialogState.onClose}
        onYesClick={() => handleDeleteImage()}
      />
      <ModalContent bg="gray.800">
        <ModalHeader
          bg="gray.900"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          Detalhes
          <ModalCloseButton pos="static" />
        </ModalHeader>
        <ModalBody m="20px 0">
          <SimpleGrid gap={10} align="flex-start" columns={[1, null, 2]}>
            <Box bg="gray.700" h="sm" placeItems="center" display="flex">
              <Image
                w="full"
                src={image.url}
                objectFit="contain"
                alt={image.altName}
              />
            </Box>
            <Flex flexDir="column" justifyContent="space-between">
              <SimpleGrid
                bg="gray.900"
                p="10px"
                h="fit-content"
                gridTemplateAreas={`'name name' 'size id' 'created updated' 'url url'`}
                templateRows="auto"
                columns={[1, null, 2]}
                rounded="md"
                align="flex-start"
                gap="4"
              >
                <Text
                  as="h6"
                  fontWeight="bold"
                  fontSize="small"
                  isTruncated
                  gridArea="name"
                >
                  Nome
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    textTransform="uppercase"
                    isTruncated
                  >
                    {image.altName}
                  </Text>
                </Text>
                <Text as="h6" fontWeight="bold" fontSize="small" isTruncated>
                  Size
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    isTruncated
                  >
                    {filesize(!!image.size ? image.size : 0)}
                  </Text>
                </Text>
                <Text as="h6" fontWeight="bold" fontSize="small" isTruncated>
                  Id
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    isTruncated
                  >
                    {image.id}
                  </Text>
                </Text>
                <Text as="h6" fontWeight="bold" fontSize="small" isTruncated>
                  Data criação
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    isTruncated
                  >
                    {image.createdAt}
                  </Text>
                </Text>
                <Text as="h6" fontWeight="bold" fontSize="small" isTruncated>
                  Data atualização
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    isTruncated
                  >
                    {image.updatedAt}
                  </Text>
                </Text>
                <Text
                  as="h6"
                  fontWeight="bold"
                  fontSize="small"
                  gridArea="url"
                  isTruncated
                >
                  Url
                  <Text
                    fontWeight="normal"
                    fontSize="small"
                    mt="2px"
                    isTruncated
                  >
                    {image.url}
                  </Text>
                </Text>
              </SimpleGrid>
              <HStack>
                <DarkMode>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    w="full"
                    onClick={dialogState.onOpen}
                  >
                    Deletar
                  </Button>
                </DarkMode>
                <Button
                  colorScheme="facebook"
                  w="full"
                  onClick={() => window.open(image.url)}
                >
                  Visualizar
                </Button>
              </HStack>
            </Flex>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter bg="gray.900">
          <Button colorScheme="pink" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
