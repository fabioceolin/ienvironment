import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

type Environment = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getEnviroments(): Promise<Environment[]> {
  const { data } = await api.get<Environment[]>('Environment/GetAll');

  return data;
}

export function useEnvironment() {
  return useQuery(['environments'], () => getEnviroments(), {
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
