import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  HStack,
  Image,
  BoxProps,
  IconButton,
  Tooltip,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';

import { FiEdit3, FiX, FiMenu } from 'react-icons/fi';

const MotionBox = motion<BoxProps>(Box);

interface EnvironmentCardProps {
  title: string;
  description: string;
  enabled: boolean;
  imageUrl?: string;
  onViewButtonClick?: () => void;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
}

export function EnvironmentCard({
  title,
  description,
  enabled,
  imageUrl,
  onViewButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
}: EnvironmentCardProps) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });
  const slashMotion: Variants = {
    hover: {
      y: -60,
      transition: {
        duration: 0.3,
        type: 'tween',
        ease: 'easeInOut',
      },
    },
  };
  return (
    <Center py={4} filter={!enabled && 'brightness(0.5)'}>
      <MotionBox
        h="100%"
        whileHover="hover"
        initial="hidden"
        animate="visible"
        role={'group'}
        p={6}
        maxW={'33 0px'}
        w={'full'}
        bg={'gray.800'}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <MotionBox
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          variants={slashMotion}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={'100%'}
            objectFit={'cover'}
            src={imageUrl}
            fallbackSrc="https://via.placeholder.com/300x230/?text=300%20x%20230"
          />
        </MotionBox>
        <Center>
          <HStack
            pos={isWideVersion ? 'absolute' : 'static'}
            top="160px"
            zIndex={isWideVersion ? -1 : 0}
            pt={isWideVersion ? '' : 3}
          >
            <Tooltip
              hasArrow
              label="Visualizar"
              bg="gray.400"
              placement="bottom"
              color="black"
            >
              <IconButton
                colorScheme="blackAlpha"
                aria-label="Visualizar"
                icon={<Icon as={FiMenu} />}
                onClick={onViewButtonClick}
              />
            </Tooltip>
            <Tooltip
              hasArrow
              label="Editar"
              bg="gray.400"
              placement="bottom"
              color="black"
            >
              <IconButton
                colorScheme="blackAlpha"
                aria-label="Editar"
                icon={<Icon as={FiEdit3} />}
                onClick={onEditButtonClick}
              />
            </Tooltip>
            <Tooltip
              hasArrow
              label="Remover"
              bg="gray.400"
              placement="bottom"
              color="black"
            >
              <IconButton
                colorScheme="blackAlpha"
                aria-label="Remover"
                icon={<Icon as={FiX} />}
                onClick={onDeleteButtonClick}
              />
            </Tooltip>
          </HStack>
        </Center>
        <Stack pt={isWideVersion ? 10 : 3} align={'center'}>
          <Heading
            fontSize={'2xl'}
            fontFamily={'body'}
            fontWeight={500}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {title}
          </Heading>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            {description}
          </Text>
        </Stack>
      </MotionBox>
    </Center>
  );
}
