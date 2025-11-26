"use client";
import { GenericFilterPage } from '@/components';
import { blogConfig } from '@/config/filterConfigs';

export default function BlogPage() {
  return <GenericFilterPage config={blogConfig} />;
}
