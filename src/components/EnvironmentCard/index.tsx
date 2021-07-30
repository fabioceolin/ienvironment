import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  ImageProps,
  BoxProps,
} from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';

const IMAGE =
  'https://www.lottehotel.com/content/dam/lotte-hotel/city/jeju/facilities/business/5350-151125-2000-fac-ltcj.jpg.thumb.768.768.jpg';

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);

interface EnvironmentCardProps {
  title: string;
  description: string;
}

export function EnvironmentCard({ title, description }: EnvironmentCardProps) {
  const slashMotion: Variants = {
    hover: {
      y: -20,
      transition: {
        duration: 0.4,
        type: 'tween',
        ease: 'easeInOut',
      },
    },
  };
  return (
    <Center py={12}>
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
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: `url(${IMAGE})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <MotionImage
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            variants={slashMotion}
            src={IMAGE}
          />
        </MotionBox>
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
