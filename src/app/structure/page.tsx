"use client";
import { GenericFilterPage } from '@/components';
import { structureConfig } from '@/config/filterConfigs';

export default function StructurePage() {
  return <GenericFilterPage config={structureConfig} />;
}
