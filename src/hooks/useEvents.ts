import { useQuery } from 'react-query';
import { api } from 'services/apiClient';

type WhatExecute = {
  actuatorId: string;
  value: string;
};

type WhenExecute = {
  sensorId: string;
  value: string;
  comparator: number[];
  nextCondition: number[];
};

export type Event = {
  id: string;
  name: string;
  environmentID: string;
  coolDownSeconds: number;
  isManual: boolean;
  description: string;
  runningDays: number[];
  startTime: string;
  endTime?: string;
  enabled: boolean;
  timeBased: boolean;
  whenExecute: Array<WhenExecute>;
  whatExecute?: Array<WhatExecute>;
  createdAt: string;
  updatedAt: string;
};

export async function getEventsByEnvironmentId(
  environmentId: string
): Promise<Event[]> {
  const { data } = await api.get<Event[]>(
    `/Event/GetByEnvironmentId/${environmentId}`
  );

  console.log(data);

  const Events = data.map((event) => {
    return {
      id: event.id,
      name: event.name,
      environmentID: event.environmentID,
      coolDownSeconds: event.coolDownSeconds,
      isManual: event.isManual,
      description: event.description,
      runningDays: event.runningDays,
      startTime: event.startTime,
      endTime: event.endTime,
      enabled: event.enabled,
      timeBased: event.timeBased,
      whenExecute: event.whenExecute,
      whatExecute: event.whatExecute,
      createdAt: new Date(event.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      updatedAt: new Date(event.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return Events;
}

export function useEventsByEnvironmentId(environmentId: string) {
  return useQuery(
    ['Events', environmentId],
    () => getEventsByEnvironmentId(environmentId),
    {
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  );
}
