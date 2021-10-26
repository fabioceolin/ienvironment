import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type Sensor = {
  measurementUnit: string;
  defaultTriggersActive: boolean;
  limitUp: number;
  limitDown: number;
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
): Promise<Sensor[]> {
  const { data } = await api.get<Sensor[]>(
    `/Sensor/GetByEnvironmentId/${environmentId}`
  );

  const Sensors = data.map((sensor) => {
    return {
      measurementUnit: sensor.measurementUnit,
      defaultTriggersActive: sensor.defaultTriggersActive,
      limitUp: sensor.limitUp,
      limitDown: sensor.limitDown,
      name: sensor.name,
      description: sensor.description,
      entityType: sensor.entityType,
      topic: sensor.topic,
      environmentId: sensor.environmentId,
      alive: sensor.alive,
      connected: sensor.connected,
      currentValue: sensor.currentValue,
      enabled: sensor.enabled,
      simulationMode: sensor.simulationMode,
      keepAlive: sensor.keepAlive,
      microcontrollerID: sensor.microcontrollerID,
      autoDisconnectSeconds: sensor.autoDisconnectSeconds,
      id: sensor.id,
      createdAt: new Date(sensor.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(sensor.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return Sensors;
}

export function useSensorsByEnvironmentId(environmentId: string) {
  return useQuery(
    ['Sensors', environmentId],
    () => getSensorsByEnvironmentId(environmentId),
    {
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  );
}
