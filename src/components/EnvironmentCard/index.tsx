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
} from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';

import { FiEdit3, FiX, FiMenu } from 'react-icons/fi';

const IMAGE =
  'https://www.lottehotel.com/content/dam/lotte-hotel/city/jeju/facilities/business/5350-151125-2000-fac-ltcj.jpg.thumb.768.768.jpg';

const MotionBox = motion<BoxProps>(Box);

interface EnvironmentCardProps {
  title: string;
  description: string;
}

export function EnvironmentCard({ title, description }: EnvironmentCardProps) {
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
    <Center py={4}>
      <MotionBox
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
            width={282}
            objectFit={'cover'}
            src={IMAGE}
            fallbackSrc="https://via.placeholder.com/150"
          />
        </MotionBox>
        <Center>
          <HStack pos="absolute" top="160px" zIndex={-1}>
            <Tooltip
              hasArrow
              label="Visualizar"
              bg="gray.400"
              placement="bottom"
              color="black"
            >
              <IconButton
                colorScheme="blackAlpha"
                aria-label="Editar"
                icon={<Icon as={FiMenu} />}
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
                aria-label="Editar"
                icon={<Icon as={FiX} />}
              />
            </Tooltip>
          </HStack>
        </Center>
        <Stack pt={10} align={'center'}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
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
