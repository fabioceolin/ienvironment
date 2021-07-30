import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

type DialogProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
};

export function Dialog({ title, description, onClose, isOpen }: DialogProps) {
  const cancelRef = useRef();
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
    >
      <AlertDialogOverlay />

      <AlertDialogContent bg="gray.800">
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter>
          <Button colorScheme="pink" ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button colorScheme="red" ml={3}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
