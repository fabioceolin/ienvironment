import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

type MCUControllers = {
  id: string;
  name: string;
  description: string;
  login: string;
  equipments: string[];
  connected: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getMCUControllers(): Promise<MCUControllers[]> {
  const { data } = await api.get<MCUControllers[]>('MCUControllers/getAll');

  const MCUControllers = data.map((userMCUController) => {
    return {
      id: userMCUController.id,
      name: userMCUController.name,
      description: userMCUController.description,
      login: userMCUController.login,
      equipments: userMCUController.equipments,
      connected: userMCUController.connected,
      enabled: userMCUController.enabled,
      createdAt: new Date(userMCUController.createdAt).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
      updatedAt: new Date(userMCUController.updatedAt).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return MCUControllers;
}

export function useMCUControllers() {
  return useQuery(['MCUControllers'], () => getMCUControllers(), {
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
