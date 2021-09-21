import React from 'react';
import Layout from './Layout';
import FileList from './FileList';
import Input from './Input';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';

import { useUpload } from 'hooks/upload';

import { api } from 'services/apiClient';
import { queryClient } from 'services/queryClient';

interface FilesUploadedProps {
  FileID: string;
  ResponseFileID: string;
}

interface FileResponseProps {
  id: string;
  name: string;
  size: number;
  key: string;
  url: string;
  createdAt: string;
}

interface UploadProps {
  invalidateQuery?: string;
}

const Upload: React.FC<UploadProps> = ({ invalidateQuery }) => {
  const { addFile, listAllFiles, removeFile } = useUpload();

  const getUploadParams: IDropzoneProps['getUploadParams'] = () => ({
    url: process.env.NEXT_PUBLIC_API_FILE_URL as string,
  });

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = (
    { meta },
    status,
    getUploadParams
  ) => {
    const { xhr } = getUploadParams[0];
    const allFiles = listAllFiles();
    if (status === 'done') {
      const response: FileResponseProps = JSON.parse(xhr?.response);
      addFile({
        FileID: meta.id,
        ResponseFileID: response.id,
      });
      !!invalidateQuery && queryClient.invalidateQueries(invalidateQuery);
    } else if (status === 'removed') {
      allFiles.map((fileUploaded) => {
        if (fileUploaded.FileID === meta.id) {
          api.delete(`file/${fileUploaded.ResponseFileID}`);
        }
      });
      removeFile(meta.id);
    }
  };

  const handleSubmit: IDropzoneProps['onSubmit'] = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={Layout}
      PreviewComponent={FileList}
      InputComponent={Input}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*"
      multiple={false}
    />
  );
};

export default Upload;
