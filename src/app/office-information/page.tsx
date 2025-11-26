"use client";
import { GenericFilterPage } from '@/components';
import { officeInformationConfig } from '@/config/filterConfigs';

export default function OfficeInformationPage() {
  return <GenericFilterPage config={officeInformationConfig} />;
}
