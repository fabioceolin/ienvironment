import {
  Select as ChakraSelect,
  Icon,
  InputGroup,
  InputLeftElement,
  FormLabel,
  FormControl,
  FormErrorMessage,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';
import { ElementType, forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  icons?: ElementType;
}
const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, label, icons, error = null, children, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup>
        {!!icons && (
          <InputLeftElement
            h="100%"
            pointerEvents="none"
            fontSize="lg"
            color="pink.500"
            children={<Icon as={icons} />}
          />
        )}
        <ChakraSelect
          name={name}
          id={name}
          focusBorderColor="pink.500"
          bgColor="gray.900"
          variant="filled"
          _hover={{ bgColor: 'gray.900' }}
          size="lg"
          ref={ref}
          {...rest}
        >
          {children}
        </ChakraSelect>
      </InputGroup>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
