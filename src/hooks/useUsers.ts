import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

type Users = {
  id: string;
  name: string;
  email: string;
  login: string;
  enable: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getUsers(): Promise<Users[]> {
  const { data } = await api.get<Users[]>('user/getallusers');

  const users = data.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      login: user.login,
      enable: user.enable,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return users;
}

export function useUsers() {
  return useQuery(['users'], () => getUsers(), {
    staleTime: 1000 * 5,
  });
}
