import React from 'react';
import { chakra } from '@chakra-ui/react';

import { ILayoutProps } from 'react-dropzone-uploader';

const Layout: React.FC<ILayoutProps> = ({
  extra,
  dropzoneProps,
  files,
  input,
  previews,
}) => {
  return (
    <chakra.span
      d="flex"
      flexDir="column"
      w="full"
      justifyContent="center"
      alignItems="center"
      p="15px 0"
    >
      <chakra.div
        className="dropzone"
        w="full"
        border="4px dashed #353646"
        borderRadius="4px"
        cursor="pointer"
        transition="height 0.2s ease"
        borderColor={
          extra.active ? '#22bb33' : extra.reject ? '#bb2124' : '#353646'
        }
      >
        <div {...dropzoneProps}>{files.length < extra.maxFiles && input}</div>
      </chakra.div>
      <chakra.div
        d="flex"
        flexDirection="column"
        w="full"
        justifyContent="center"
        alignItems="center"
        bg="#27242c"
        mt="10px"
      >
        {previews}
      </chakra.div>
    </chakra.span>
  );
};

export default Layout;
