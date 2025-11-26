"use client";
import { GenericFilterPage } from '@/components';
import { locationDetailsConfig } from '@/config/filterConfigs';

export default function LocationDetailsPage() {
  return <GenericFilterPage config={locationDetailsConfig} />;
}
