"use client";
import { GenericFilterPage } from '@/components';
import { cityConfig } from '@/config/filterConfigs';

export default function CityPage() {
  return <GenericFilterPage config={cityConfig} />;
}
