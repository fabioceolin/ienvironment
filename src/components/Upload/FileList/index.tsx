import React from 'react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import filesize from 'filesize';
import { chakra } from '@chakra-ui/react';
import { MdCheckCircle, MdError } from 'react-icons/md';

import { IPreviewProps } from 'react-dropzone-uploader';

const FileList: React.FC<IPreviewProps> = ({ meta }) => {
  const { id, previewUrl, name, size, percent, status } = meta;
  return (
    <chakra.ul mt="5px" w="full" p="10px" borderRadius="4px" key={id}>
      <chakra.li
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        color="gray.800"
        mt="15px"
      >
        <chakra.div d="flex" alignItems="center">
          <chakra.div
            w="36px"
            h="36px"
            borderRadius="5px"
            bgImage={'url(' + previewUrl + ')'}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPos="center"
            mr="10px"
          />
          <chakra.div d="flex" flexDir="column">
            <chakra.strong color="#ccc">{name}</chakra.strong>
            <chakra.span fontSize="12px" color="#ccc" mt="5px">
              {filesize(size)}
            </chakra.span>
          </chakra.div>
        </chakra.div>

        <div>
          {status !== 'done' &&
            status !== 'error_validation' &&
            status !== 'error_upload_params' && (
              <CircularProgress
                value={percent}
                size="45px"
                thickness="12px"
                mr="4px"
                color="pink.500"
              >
                <CircularProgressLabel color="#ccc">
                  {Math.round(percent)}%
                </CircularProgressLabel>
              </CircularProgress>
            )}
          {status === 'done' && <MdCheckCircle size={24} color="#22bb33" />}
          {(status === 'error_validation' ||
            status === 'error_upload_params') && (
            <MdError size={24} color="#bb2124" />
          )}
        </div>
      </chakra.li>
    </chakra.ul>
  );
};

export default FileList;
