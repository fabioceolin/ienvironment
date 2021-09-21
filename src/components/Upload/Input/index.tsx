import React from 'react';

import { chakra } from '@chakra-ui/react';

import { IInputProps } from 'react-dropzone-uploader';

const Input: React.FC<IInputProps> = ({
  className,
  style,
  getFilesFromEvent,
  accept,
  multiple,
  disabled,
  onFiles,
  extra,
}) => {
  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) {
      return (
        <chakra.p
          d="flex"
          justifyContent="center"
          alignItems="center"
          p="15px 0"
          color="#CCC"
        >
          Clique ou arraste os arquivos aqui...
        </chakra.p>
      );
    }
    if (isDragReject) {
      return (
        <chakra.p
          d="flex"
          justifyContent="center"
          alignItems="center"
          p="15px 0"
          color="#bb2124"
        >
          Arquivo não suportado...
        </chakra.p>
      );
    }
    return (
      <chakra.p
        d="flex"
        justifyContent="center"
        alignItems="center"
        p="15px 0"
        color="#22bb33"
      >
        {' '}
        Solte os arquivos aqui...
      </chakra.p>
    );
  };
  return (
    <chakra.div
      d="flex"
      placeContent="center"
      w="full"
      role="group"
      active={extra.active}
      reject={extra.reject}
    >
      <chakra.input
        id="upload"
        className={className}
        style={style}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={async (e) => {
          const target = e.target;
          const chosenFiles = await getFilesFromEvent(e);
          onFiles(chosenFiles);
          //@ts-ignore
          target.value = null;
        }}
        w="0.1px"
        h="0.1px"
        opacity={0}
        overflow="hidden"
        pos="absolute"
        zIndex={-1}
      />
      <chakra.label
        htmlFor="upload"
        d="flex"
        w="full"
        placeItems="center"
        placeContent="center"
        isTruncated
        cursor="pointer"
        overflow="hidden"
        p="0.625rem 1.25rem"
      >
        <chakra.figure
          w="50px"
          h="50px"
          borderRadius="50%"
          bg="pink.500"
          _groupHover={{
            bg: 'pink.600',
          }}
          d="flex"
          alignItems="center"
          justifyContent="center"
          m="10px"
        >
          <chakra.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
            w="1.5em"
            h="1.5em"
            verticalAlign="middle"
            fill="currentcolor"
            mt="-0.25em"
            // mr="0.25em"
          >
            <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
          </chakra.svg>
        </chakra.figure>
        {renderDragMessage(extra.active, extra.reject)}
      </chakra.label>
    </chakra.div>
  );
};

export default Input;
