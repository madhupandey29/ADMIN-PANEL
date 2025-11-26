"use client";
import { GenericFilterPage } from '@/components';
import { contactConfig } from '@/config/filterConfigs';

export default function ContactPage() {
  return <GenericFilterPage config={contactConfig} />;
}
