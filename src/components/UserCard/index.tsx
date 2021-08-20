import { Heading, Avatar, Box, Text, Stack, Button } from '@chakra-ui/react';

interface UserCardProps {
  Id: string;
  Name: string;
  Email: string;
  Enabled: boolean;
  Role: number;
  avatarUrl?: string;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
}

export function UserCard({
  Name,
  Email,
  avatarUrl = '',
  onRightButtonClick,
  onLeftButtonClick,
}: UserCardProps) {
  return (
    <Box
      p={['6', '8']}
      bg="gray.800"
      shadow="0 0 20px rgba(0, 0, 0, 0.05)"
      borderRadius={8}
      pb="4"
      textAlign="center"
    >
      <Avatar
        size="xl"
        name={Name}
        // src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
        src={avatarUrl}
        alt="Imagem do usuário"
        mb={4}
      />
      <Heading
        fontSize="2xl"
        fontFamily="body"
        flexWrap="nowrap"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {Name}
      </Heading>
      <Text fontWeight={600} color="gray.500" mb={4}>
        {Email}
      </Text>
      <Text textAlign="center" px={3}>
        Administrador
      </Text>

      <Stack mt={8} direction="row" spacing={4}>
        <Button
          flex={1}
          fontSize="sm"
          rounded="full"
          bg="pink.500"
          _hover={{
            bg: 'pink.600',
          }}
          _focus={{
            bg: 'pink.600',
          }}
          onClick={onLeftButtonClick}
        >
          Editar
        </Button>
        <Button
          flex={1}
          fontSize="sm"
          rounded="full"
          bg="red.500"
          color="white"
          _hover={{
            bg: 'red.600',
          }}
          _focus={{
            bg: 'red.500',
          }}
          onClick={onRightButtonClick}
        >
          Deletar
        </Button>
      </Stack>
    </Box>
  );
}
