"use client";
import React from 'react';
import GenericFilterPage from '@/components/GenericFilterPage';
import { categoryConfig } from '@/config/filterConfigs';

export default function CategoryPage() {
  return <GenericFilterPage config={categoryConfig} />;
}
