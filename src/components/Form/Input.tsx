import {Input as ChakraInput, Icon, InputGroup, InputLeftElement, FormLabel, FormControl, FormErrorMessage, InputProps as ChakraInputProps } from '@chakra-ui/react'
import { ElementType, forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  icon?: ElementType
}
const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, icon, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup>
      {!!icon && <InputLeftElement h="100%" pointerEvents="none" fontSize="lg" color="pink.500" children={<Icon as={icon} />} />}
      <ChakraInput 
        name={name} 
        id={name}
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{bgColor: 'gray.900'}}
        size="lg"
        ref={ref}
        {...rest}
      />
      </InputGroup>

      { !!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)