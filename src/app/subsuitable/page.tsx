"use client";
import { GenericFilterPage } from '@/components';
import { subsuitableConfig } from '@/config/filterConfigs';

export default function SubsuitablePage() {
  return <GenericFilterPage config={subsuitableConfig} />;
}
