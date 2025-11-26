"use client";
import { GenericFilterPage } from '@/components';
import { substructureConfig } from '@/config/filterConfigs';

export default function SubstructurePage() {
  return <GenericFilterPage config={substructureConfig} />;
}
