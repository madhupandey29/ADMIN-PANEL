"use client";
import { GenericFilterPage } from '@/components';
import { suitableforConfig } from '@/config/filterConfigs';

export default function SuitableforPage() {
  return <GenericFilterPage config={suitableforConfig} />;
}
