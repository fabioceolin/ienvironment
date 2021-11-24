import { Sensor } from './useSensor';
import { Event } from './useEvents';
import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

export type Dashboard = {
  name: string;
  description: string;
  sensor: Sensor[];
  events: Event[];
};

export async function getDashboard(): Promise<Dashboard[]> {
  const { data } = await api.get<Dashboard[]>(`/Environment/Dashboard`);

  const Dashboard = data.map((item) => {
    const Sensor = item.sensor.map((sensorI) => {
      return {
        measurementUnit: sensorI.measurementUnit,
        defaultTriggersActive: sensorI.defaultTriggersActive,
        limitUp: sensorI.limitUp,
        limitDown: sensorI.limitDown,
        name: sensorI.name,
        description: sensorI.description,
        entityType: sensorI.entityType,
        topic: sensorI.topic,
        environmentId: sensorI.environmentId,
        alive: sensorI.alive,
        connected: sensorI.connected,
        currentValue: sensorI.currentValue,
        enabled: sensorI.enabled,
        simulationMode: sensorI.simulationMode,
        keepAlive: sensorI.keepAlive,
        microcontrollerID: sensorI.microcontrollerID,
        autoDisconnectSeconds: sensorI.autoDisconnectSeconds,
        id: sensorI.id,
        createdAt: new Date(sensorI.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        updatedAt: new Date(sensorI.updatedAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    });

    const Events = item.events.map((eventI) => {
      return {
        id: eventI.id,
        name: eventI.name,
        environmentID: eventI.environmentID,
        coolDownSeconds: eventI.coolDownSeconds,
        isManual: eventI.isManual,
        description: eventI.description,
        runningDays: eventI.runningDays,
        startTime: eventI.startTime,
        endTime: eventI.endTime,
        enabled: eventI.enabled,
        timeBased: eventI.timeBased,
        whenExecute: eventI.whenExecute,
        whatExecute: eventI.whatExecute,
        createdAt: new Date(eventI.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        updatedAt: new Date(eventI.updatedAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    });

    item.sensor = Sensor;
    item.events = Events;

    return item;
  });

  return Dashboard;
}

export function useDashboard() {
  return useQuery(['Dashboard'], () => getDashboard(), {
    staleTime: 1000 * 60 * 1, // 1 minutos
    refetchInterval: 1000 * 2, // 1 minutos
  });
}
