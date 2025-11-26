// Shared types for components

export interface BaseComponentProps {
  className?: string;
  sx?: any; // MUI sx prop
}

export interface LoadingState {
  loading?: boolean;
  error?: string | null;
}

export interface PaginationConfig {
  page: number;
  rowsPerPage: number;
  totalRows: number;
}

export interface SortConfig {
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface FilterConfig {
  search: string;
  filters: Record<string, any>;
}

// Re-export component types
export type { Column, Action } from './DataTable';
export type { FormField, FormSection, FieldType } from './FormDialog';
