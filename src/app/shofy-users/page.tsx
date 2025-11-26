"use client";
import { GenericFilterPage } from '@/components';
import { shofyUsersConfig } from '@/config/filterConfigs';

export default function ShofyUsersPage() {
  return <GenericFilterPage config={shofyUsersConfig} />;
}
