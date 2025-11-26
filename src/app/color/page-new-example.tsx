"use client";
import { GenericFilterPage } from '@/components';
import { colorConfig } from '@/config/filterConfigs';

export default function ColorPage() {
  return <GenericFilterPage config={colorConfig} />;
}
