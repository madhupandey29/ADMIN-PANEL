"use client";
import { GenericFilterPage } from '@/components';
import { finishConfig } from '@/config/filterConfigs';

export default function FinishPage() {
  return <GenericFilterPage config={finishConfig} />;
}
