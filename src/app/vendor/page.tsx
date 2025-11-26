"use client";
import { GenericFilterPage } from '@/components';
import { vendorConfig } from '@/config/filterConfigs';

export default function VendorPage() {
  return <GenericFilterPage config={vendorConfig} />;
}
