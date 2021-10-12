import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type Actuator = {
  lastSignalReceivedTime: string;
  name: string;
  description: string;
  entityType: number;
  topic: string;
  environmentId: string;
  alive: boolean;
  connected: boolean;
  currentValue: string;
  enabled: boolean;
  simulationMode: boolean;
  keepAlive: string;
  microcontrollerID: string;
  autoDisconnectSeconds: number;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export async function getSensorsByEnvironmentId(
  environmentId: string
): Promise<Actuator[]> {
  const { data } = await api.get<Actuator[]>(
    `/Actuator/GetByEnvironmentId/${environmentId}`
  );

  const Actuator = data.map((actuator) => {
    return {
      lastSignalReceivedTime: actuator.lastSignalReceivedTime,
      name: actuator.name,
      description: actuator.description,
      entityType: actuator.entityType,
      topic: actuator.topic,
      environmentId: actuator.environmentId,
      alive: actuator.alive,
      connected: actuator.connected,
      currentValue: actuator.currentValue,
      enabled: actuator.enabled,
      simulationMode: actuator.simulationMode,
      keepAlive: actuator.keepAlive,
      microcontrollerID: actuator.microcontrollerID,
      autoDisconnectSeconds: actuator.autoDisconnectSeconds,
      id: actuator.id,
      createdAt: new Date(actuator.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(actuator.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return Actuator;
}

export function useActuatorsByEnvironmentId(environmentId: string) {
  return useQuery(
    ['Actuators', environmentId],
    () => getSensorsByEnvironmentId(environmentId),
    {
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  );
}
