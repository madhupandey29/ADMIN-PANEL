"use client";
import { GenericFilterPage } from '@/components';
import { contentConfig } from '@/config/filterConfigs';

export default function ContentPage() {
  return <GenericFilterPage config={contentConfig} />;
}
