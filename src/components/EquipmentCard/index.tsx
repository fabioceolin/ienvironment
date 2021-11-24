import {
  Box,
  Text,
  IconButton,
  Flex,
  chakra,
  SimpleGrid,
  Tag,
  ButtonGroup,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';

import {
  RiDeleteBinLine,
  RiEdit2Fill,
  RiExternalLinkFill,
} from 'react-icons/ri';
import { DayOfWeek } from 'utils/enums';

interface EquipmentCardProps {
  title: string;
  description: string;
  simulationMode?: boolean;
  columnsSize?: number;
  runningDays?: number[];
  title1?: string;
  value1?: string | number;
  title2?: string;
  value2?: string | number;
  enabled: boolean;
  onViewButtonClick?: () => void;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
}

export function EquipmentCard({
  title,
  description,
  simulationMode = false,
  columnsSize = 2,
  runningDays,
  title1,
  value1,
  title2,
  value2,
  enabled = true,
  onViewButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
}: EquipmentCardProps) {
  return (
    <Box
      w="full"
      maxW="sm"
      mx="auto"
      px={4}
      py={3}
      bg="gray.800"
      shadow="md"
      rounded="lg"
      filter={!enabled && 'brightness(0.5)'}
    >
      <Box>
        <Flex justifyContent="space-between">
          <chakra.h1
            fontSize="lg"
            fontWeight="bold"
            color="green.50"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            width="100%"
          >
            {title}
          </chakra.h1>
          {simulationMode && (
            <Tag size="sm" colorScheme="pink" minW="inherit">
              Simulação
            </Tag>
          )}
        </Flex>
        <chakra.p h="42px" fontSize="sm" mt={2} color="gray.300" noOfLines={2}>
          {description}
        </chakra.p>
      </Box>

      <Box mt={2}>
        <SimpleGrid
          h="45px"
          columns={columnsSize}
          spacing={['6', '8']}
          w="100%"
        >
          {!!value1 && (
            <Flex flexDir="column">
              <Text noOfLines={1} fontSize="md">
                {title1}
              </Text>
              <Text noOfLines={1} color="gray.300" fontSize="sm">
                {value1}{' '}
              </Text>
            </Flex>
          )}
          {!!value2 && (
            <Flex flexDir="column">
              <Text noOfLines={1} fontSize="md">
                {title2}
              </Text>
              <Text noOfLines={1} color="gray.300" fontSize="sm">
                {value2}
              </Text>
            </Flex>
          )}
          {!!runningDays && (
            <Flex justifyContent="space-around" alignItems="center">
              {runningDays.map((runningDay) => {
                return (
                  <Flex
                    border="1px solid"
                    borderColor="pink.500"
                    color="pink.500"
                    fontWeight="bold"
                    h="30px"
                    w="30px"
                    justifyContent="center"
                    alignItems="center"
                    colorScheme="pink"
                    variant="outline"
                  >
                    <Text fontSize="x-small">
                      {DayOfWeek[runningDay].slice(0, 3)}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </SimpleGrid>

        <Flex alignItems="center" justifyContent="center" mt={4}>
          <ButtonGroup variant="solid" size="sm" spacing={3}>
            {onViewButtonClick && (
              <Tooltip
                hasArrow
                label="Visualizar"
                bg="gray.400"
                placement="bottom"
                color="black"
              >
                <IconButton
                  aria-label=""
                  colorScheme="blue"
                  icon={<RiExternalLinkFill />}
                  onClick={onViewButtonClick}
                />
              </Tooltip>
            )}
            {!!onEditButtonClick && (
              <Tooltip
                hasArrow
                label="Editar"
                bg="gray.400"
                placement="bottom"
                color="black"
              >
                <IconButton
                  aria-label=""
                  colorScheme="green"
                  icon={<RiEdit2Fill />}
                  onClick={onEditButtonClick}
                />
              </Tooltip>
            )}
            {onDeleteButtonClick && (
              <Tooltip
                hasArrow
                label="Remover"
                bg="gray.400"
                placement="bottom"
                color="black"
              >
                <IconButton
                  aria-label=""
                  colorScheme="red"
                  variant="outline"
                  icon={<RiDeleteBinLine />}
                  onClick={onDeleteButtonClick}
                />
              </Tooltip>
            )}
          </ButtonGroup>
        </Flex>
      </Box>
    </Box>
  );
}
