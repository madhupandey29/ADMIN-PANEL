"use client";
import { GenericFilterPage } from '@/components';
import { locationConfig } from '@/config/filterConfigs';

export default function LocationPage() {
  return <GenericFilterPage config={locationConfig} />;
}
