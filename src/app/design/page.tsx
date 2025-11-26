"use client";
import { GenericFilterPage } from '@/components';
import { designConfig } from '@/config/filterConfigs';

export default function DesignPage() {
  return <GenericFilterPage config={designConfig} />;
}
