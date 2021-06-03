import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({showProfileData = true}: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Fábio Ceolin</Text>
          <Text 
            color="gray.300"
            fontSize="small"
          >
            fabioceolin98@gmail.com
          </Text>
        </Box>
      )}
      

      <Avatar size="md" name="Fábio Ceolin"  />
    </Flex>
  );
}