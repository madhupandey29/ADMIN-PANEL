"use client";
import { GenericFilterPage } from '@/components';
import { motifConfig } from '@/config/filterConfigs';

export default function MotifPage() {
  return <GenericFilterPage config={motifConfig} />;
}
