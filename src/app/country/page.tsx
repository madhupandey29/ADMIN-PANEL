"use client";
import { GenericFilterPage } from '@/components';
import { countryConfig } from '@/config/filterConfigs';

export default function CountryPage() {
  return <GenericFilterPage config={countryConfig} />;
}
