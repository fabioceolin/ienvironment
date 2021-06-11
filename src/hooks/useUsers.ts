import { role } from 'enums/role';
import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

type Users = {
  Id: string;
  Name: string;
  Email: string;
  Role: role;
  Enabled: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export async function getUsers(): Promise<Users[]> {
  const { data } = await api.get<Users[]>('user/getallusers');

  const users = data.map((user) => {
    return {
      Id: user.Id,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role,
      Enabled: user.Enabled,
      CreatedAt: new Date(user.CreatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      UpdatedAt: new Date(user.CreatedAt).toLocaleDateString('pt-BR', {
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
