import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type ImageProps = {
  id: string;
  fileName: string;
  altName: string;
  url: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export async function getImages(): Promise<ImageProps[]> {
  const { data } = await api.get<ImageProps[]>('Image/GetAll');
  const images = data.map((image) => {
    return {
      id: image.id,
      fileName: image.fileName,
      altName: image.altName,
      url: image.url,
      size: image.size,
      createdAt: new Date(image.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(image.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return images;
}

export function useImages() {
  return useQuery(['images'], () => getImages(), {
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
