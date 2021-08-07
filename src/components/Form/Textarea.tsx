import {
  Textarea as ChakraTextarea,
  Icon,
  InputGroup,
  InputLeftElement,
  FormLabel,
  FormControl,
  FormErrorMessage,
  TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react';
import { ElementType, forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface TextareaProps extends ChakraTextareaProps {
  name: string;
  label?: string;
  error?: FieldError;
  icon?: ElementType;
}
const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, icon, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup>
        {!!icon && (
          <InputLeftElement
            h="100%"
            pointerEvents="none"
            fontSize="lg"
            color="pink.500"
            children={<Icon as={icon} />}
          />
        )}
        <ChakraTextarea
          name={name}
          id={name}
          focusBorderColor="pink.500"
          bgColor="gray.900"
          variant="filled"
          _hover={{ bgColor: 'gray.900' }}
          size="lg"
          ref={ref}
          {...rest}
        />
      </InputGroup>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const TextArea = forwardRef(TextareaBase);
