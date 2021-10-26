import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type Environment = {
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

export async function getEnviromentById(
  environmentId: string
): Promise<Environment> {
  const { data } = await api.get<Environment>(
    `Environment?EnvironmentID=${environmentId}`
  );

  return data;
}

export function useEnvironment() {
  return useQuery(['environments'], () => getEnviroments(), {
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useEnvironmentById(environmentId: string) {
  return useQuery(
    ['environment', environmentId],
    () => getEnviromentById(environmentId),
    {
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  );
}
