"use client";
import { GenericFilterPage } from '@/components';
import { stateConfig } from '@/config/filterConfigs';

export default function StatePage() {
  return <GenericFilterPage config={stateConfig} />;
}
