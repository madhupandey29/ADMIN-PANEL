"use client";
import { GenericFilterPage } from '@/components';
import { aboutUsConfig } from '@/config/filterConfigs';

export default function AboutUsPage() {
  return <GenericFilterPage config={aboutUsConfig} />;
}
