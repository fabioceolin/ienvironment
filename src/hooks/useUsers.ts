import { Role } from 'enums/Role';
import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type UsersProps = {
  id: string;
  name: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getUsers(): Promise<UsersProps[]> {
  const { data } = await api.get<UsersProps[]>('user/getallusers');
  const users = data.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(user.updatedAt).toLocaleDateString('pt-BR', {
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
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
