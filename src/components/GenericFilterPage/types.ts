// Types for Generic Filter Page Component

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'select' | 'number' | 'email' | 'url' | 'password';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
  accept?: string; // For file inputs
  placeholder?: string;
}

export interface FilterColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'image' | 'boolean' | 'number';
  format?: (value: any, row: any) => any;
  minWidth?: number;
}

export interface FilterConfig {
  // Basic Info
  name: string; // e.g., "Category", "Color", "Vendor"
  namePlural: string; // e.g., "Categories", "Colors", "Vendors"
  apiEndpoint: string; // e.g., "/category", "/color"
  icon: React.ReactNode;
  
  // Fields Configuration
  fields: FilterField[];
  
  // Table Columns
  columns: FilterColumn[];
  
  // Features
  features?: {
    hasImage?: boolean;
    hasAdd?: boolean;
    hasEdit?: boolean;
    hasDelete?: boolean;
    hasView?: boolean;
    hasExport?: boolean;
    hasSearch?: boolean;
  };
  
  // Custom validation
  validate?: (data: any) => string | null;
  
  // Custom formatting before submit
  formatBeforeSubmit?: (data: any) => FormData | any;
  
  // Custom data transformation after fetch
  transformData?: (data: any) => any;
}

export interface GenericFilterPageProps {
  config: FilterConfig;
}
