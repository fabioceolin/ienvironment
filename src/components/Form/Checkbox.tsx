import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
  CheckboxProps as ChakraCheckboxProps,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface CheckboxProps extends ChakraCheckboxProps {
  name: string;
  formWidth?: string;
  label?: string;
  error?: FieldError;
}
const CheckboxBase: ForwardRefRenderFunction<HTMLInputElement, CheckboxProps> =
  ({ name, label, error = null, formWidth = '100%', ...rest }, ref) => {
    return (
      <FormControl width={formWidth} isInvalid={!!error}>
        <ChakraCheckbox
          id={name}
          name={name}
          p="10px"
          rounded="8px"
          colorScheme="pink"
          bgColor="gray.900"
          ref={ref}
          {...rest}
        >
          {label}
        </ChakraCheckbox>

        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    );
  };

export const Checkbox = forwardRef(CheckboxBase);
