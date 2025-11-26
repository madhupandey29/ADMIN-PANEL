"use client";
import { GenericFilterPage } from '@/components';
import { groupcodeConfig } from '@/config/filterConfigs';

export default function GroupcodePage() {
  return <GenericFilterPage config={groupcodeConfig} />;
}
