"use client";
import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Tooltip,
  Skeleton,
  TableSortLabel,
  Checkbox,
  Menu,
  MenuItem,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Image from 'next/image';

export interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'chip' | 'select' | 'custom';
}

export interface Action<T = any> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  show?: (row: T) => boolean;
}

interface ColumnFilter {
  type: 'text' | 'select' | 'number' | 'date' | 'boolean';
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

interface EnhancedDataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  customActions?: Action<T>[];
  rowsPerPage?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  emptyMessage?: string;
  stickyHeader?: boolean;
  dense?: boolean;
  showPagination?: boolean;
  getRowId?: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  enableColumnFilters?: boolean;
  enableColumnManagement?: boolean;
  storageKey?: string; // Key for localStorage persistence
}

function EnhancedDataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  customActions = [],
  rowsPerPage = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  selectable = false,
  onSelectionChange,
  emptyMessage = 'No data available',
  stickyHeader = true,
  dense = false,
  showPagination = true,
  getRowId = (row) => row._id || row.id,
  onRowClick,
  rowClassName,
  enableColumnFilters = true,
  enableColumnManagement = true,
  storageKey,
}: EnhancedDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<T | null>(null);
  
  // Column filters state
  const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilter>>({});
  const [filterAnchorEl, setFilterAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  
  // Column management state - Load from localStorage if available
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${storageKey}-columns`);
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved columns:', e);
        }
      }
    }
    return new Set(columns.map(col => col.id));
  });
  const [columnManagementOpen, setColumnManagementOpen] = useState(false);

  // Save visible columns to localStorage whenever they change
  React.useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(Array.from(visibleColumns)));
    }
  }, [visibleColumns, storageKey]);

  // Get unique values for a column (for filter dropdown)
  const getUniqueColumnValues = useCallback((columnId: string) => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[columnId];
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && value.name) {
          values.add(value.name);
        } else {
          values.add(String(value));
        }
      }
    });
    return Array.from(values).sort();
  }, [data]);

  // Apply column filters
  const applyColumnFilters = useCallback((rows: T[]) => {
    if (Object.keys(columnFilters).length === 0) return rows;
    
    return rows.filter(row => {
      return Object.entries(columnFilters).every(([columnId, filter]) => {
        const value = row[columnId];
        const filterValue = filter.value;
        
        if (filterValue === '' || filterValue === null || filterValue === undefined) return true;
        
        // Handle nested objects
        const actualValue = typeof value === 'object' && value?.name ? value.name : value;
        
        switch (filter.type) {
          case 'text':
            const strValue = String(actualValue).toLowerCase();
            const strFilter = String(filterValue).toLowerCase();
            
            switch (filter.operator) {
              case 'equals':
                return strValue === strFilter;
              case 'contains':
                return strValue.includes(strFilter);
              case 'startsWith':
                return strValue.startsWith(strFilter);
              case 'endsWith':
                return strValue.endsWith(strFilter);
              default:
                return strValue.includes(strFilter);
            }
            
          case 'number':
            const numValue = Number(actualValue);
            const numFilter = Number(filterValue);
            
            switch (filter.operator) {
              case 'equals':
                return numValue === numFilter;
              case 'gt':
                return numValue > numFilter;
              case 'lt':
                return numValue < numFilter;
              case 'gte':
                return numValue >= numFilter;
              case 'lte':
                return numValue <= numFilter;
              default:
                return numValue === numFilter;
            }
            
          case 'select':
            return String(actualValue) === String(filterValue);
            
          case 'boolean':
            return Boolean(actualValue) === Boolean(filterValue);
            
          case 'date':
            const dateValue = new Date(actualValue).toDateString();
            const dateFilter = new Date(filterValue).toDateString();
            return dateValue === dateFilter;
            
          default:
            return true;
        }
      });
    });
  }, [columnFilters]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    // Ensure data is always an array
    let result = Array.isArray(data) ? data : [];
    
    // Apply search filter
    if (search) {
      result = result.filter((row) => {
        return columns.some((column) => {
          if (!column.filterable && column.filterable !== undefined) return false;
          const value = row[column.id];
          if (value === null || value === undefined) return false;
          
          // Handle nested objects
          if (typeof value === 'object' && value.name) {
            return value.name.toString().toLowerCase().includes(search.toLowerCase());
          }
          
          return value.toString().toLowerCase().includes(search.toLowerCase());
        });
      });
    }
    
    // Apply column filters
    result = applyColumnFilters(result);
    
    return result;
  }, [data, search, columns, applyColumnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      // Handle nested objects
      const aVal = typeof aValue === 'object' && aValue?.name ? aValue.name : aValue;
      const bVal = typeof bValue === 'object' && bValue?.name ? bValue.name : bValue;
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = useCallback((columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  }, [orderBy, order]);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = new Set(paginatedData.map(row => getRowId(row)));
      setSelected(newSelected);
      onSelectionChange?.(paginatedData);
    } else {
      setSelected(new Set());
      onSelectionChange?.([]);
    }
  }, [paginatedData, getRowId, onSelectionChange]);

  const handleSelect = useCallback((row: T) => {
    const id = getRowId(row);
    const newSelected = new Set(selected);
    
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    
    setSelected(newSelected);
    const selectedRows = data.filter(r => newSelected.has(getRowId(r)));
    onSelectionChange?.(selectedRows);
  }, [selected, data, getRowId, onSelectionChange]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setMenuRow(null);
  }, []);

  // Filter handlers
  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLElement>, columnId: string) => {
    event.stopPropagation();
    setFilterAnchorEl(prev => ({ ...prev, [columnId]: event.currentTarget }));
  }, []);

  const handleFilterClose = useCallback((columnId: string) => {
    setFilterAnchorEl(prev => ({ ...prev, [columnId]: null }));
  }, []);

  const handleFilterChange = useCallback((columnId: string, filter: ColumnFilter) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: filter,
    }));
    setPage(1); // Reset to first page when filter changes
  }, []);

  const handleClearFilter = useCallback((columnId: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setColumnFilters({});
    setSearch('');
  }, []);

  // Column management handlers
  const handleToggleColumn = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  }, []);

  const handleShowAllColumns = useCallback(() => {
    setVisibleColumns(new Set(columns.map(col => col.id)));
  }, [columns]);

  const handleHideAllColumns = useCallback(() => {
    setVisibleColumns(new Set());
  }, []);

  // Get visible columns
  const visibleColumnsArray = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.id));
  }, [columns, visibleColumns]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.keys(columnFilters).length + (search ? 1 : 0);
  }, [columnFilters, search]);

  const getImageUrl = (img: string | undefined): string | undefined => {
    if (!img) return undefined;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${process.env.NEXT_PUBLIC_API_URL}/images/${img}`;
  };

  const renderCellContent = useCallback((column: Column<T>, row: T) => {
    const value = row[column.id];
    
    if (column.format) {
      return column.format(value, row);
    }
    
    switch (column.type) {
      case 'image':
        if (!value) return '-';
        const imageUrl = getImageUrl(value as string);
        if (!imageUrl) return '-';
        return (
          <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <Image
              src={imageUrl}
              alt="preview"
              fill
              style={{ objectFit: 'cover' }}
              sizes="40px"
            />
          </Box>
        );
      
      case 'chip':
        if (!value) return '-';
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        );
      
      case 'boolean':
        return (
          <Chip
            label={value ? 'Yes' : 'No'}
            size="small"
            color={value ? 'success' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        );
      
      case 'date':
        if (!value) return '-';
        return new Date(value).toLocaleDateString();
      
      default:
        // Handle nested objects
        if (typeof value === 'object' && value?.name) {
          return value.name;
        }
        return value || '-';
    }
  }, []);

  const hasActions = onEdit || onDelete || onView || customActions.length > 0;
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selected.has(getRowId(row)));
  const isSomeSelected = paginatedData.some(row => selected.has(getRowId(row))) && !isAllSelected;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Compact Toolbar - Search and Manage Columns */}
      {(searchable || enableColumnManagement || activeFiltersCount > 0 || selected.size > 0) && (
        <Box sx={{ mb: 0.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'nowrap' }}>
          {/* Manage Columns - LEFT ALIGNED */}
          {enableColumnManagement && (
            <Tooltip title="Manage Columns">
              <IconButton
                size="small"
                onClick={() => setColumnManagementOpen(true)}
                sx={{
                  border: '1.5px solid',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  borderRadius: '6px',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.4)',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ViewColumnIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Search Bar */}
          {searchable && (
            <TextField
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={{
                flex: 1,
                minWidth: 200,
                maxWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  fontSize: '13px',
                  height: 32,
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  py: 0.5,
                  fontSize: '13px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          
          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''}`}
              size="small"
              onDelete={handleClearAllFilters}
              color="primary"
              sx={{ fontWeight: 500, height: 24, fontSize: '11px' }}
            />
          )}
          
          {/* Selected Count */}
          {selected.size > 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', whiteSpace: 'nowrap' }}>
              {selected.size} selected
            </Typography>
          )}
        </Box>
      )}

      {/* Table */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TableContainer sx={{ maxHeight: stickyHeader ? 600 : undefined }}>
          <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox" sx={{ py: 1 }}>
                    <Checkbox
                      indeterminate={isSomeSelected}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      sx={{ color: 'primary.main' }}
                      size="small"
                    />
                  </TableCell>
                )}
                {visibleColumnsArray.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      py: 1,
                      px: 1.5,
                      fontWeight: 700,
                      fontSize: '13px',
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {column.sortable !== false ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSort(column.id)}
                          sx={{ '& .MuiTableSortLabel-icon': { fontSize: '16px' } }}
                        >
                          <Typography variant="inherit" sx={{ fontSize: '13px', fontWeight: 700 }}>
                            {column.label}
                          </Typography>
                        </TableSortLabel>
                      ) : (
                        <Typography variant="inherit" sx={{ fontSize: '13px', fontWeight: 700 }}>
                          {column.label}
                        </Typography>
                      )}
                      
                      {/* Filter Icon */}
                      {enableColumnFilters && column.filterable !== false && (
                        <Tooltip title="Filter">
                          <IconButton
                            size="small"
                            onClick={(e) => handleFilterClick(e, column.id)}
                            sx={{
                              padding: '2px',
                              color: columnFilters[column.id] ? 'primary.main' : 'text.secondary',
                            }}
                          >
                            <FilterListIcon sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell
                    align="center"
                    sx={{
                      py: 1,
                      px: 1,
                      fontWeight: 700,
                      fontSize: '13px',
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                      minWidth: 100,
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Skeleton variant="rectangular" width={18} height={18} />
                      </TableCell>
                    )}
                    {visibleColumnsArray.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell
                    colSpan={visibleColumnsArray.length + (hasActions ? 1 : 0) + (selectable ? 1 : 0)}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                paginatedData.map((row) => {
                  const rowId = getRowId(row);
                  const isSelected = selected.has(rowId);
                  
                  return (
                    <TableRow
                      key={rowId}
                      hover
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        ...(isSelected && {
                          bgcolor: 'action.selected',
                        }),
                      }}
                      className={rowClassName?.(row)}
                    >
                      {selectable && (
                        <TableCell padding="checkbox" sx={{ py: 0.75 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(row)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ color: 'primary.main' }}
                            size="small"
                          />
                        </TableCell>
                      )}
                      {visibleColumnsArray.map((column) => (
                        <TableCell 
                          key={column.id} 
                          align={column.align || 'left'}
                          sx={{ 
                            py: 0.75, 
                            px: 1.5,
                            fontSize: '13px'
                          }}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      {hasActions && (
                        <TableCell align="center" sx={{ py: 0.75, px: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onView(row);
                                  }}
                                  sx={{ color: 'info.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                  }}
                                  sx={{ color: 'warning.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(row);
                                  }}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {customActions.length > 0 && (
                              <>
                                <Tooltip title="More">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, row)}
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {showPagination && !loading && paginatedData.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {(page - 1) * rowsPerPage + 1} to{' '}
              {Math.min(page * rowsPerPage, sortedData.length)} of {sortedData.length} entries
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>

      {/* Custom Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {customActions.map((action, index) => {
          if (menuRow && action.show && !action.show(menuRow)) return null;
          
          return (
            <MenuItem
              key={index}
              onClick={() => {
                if (menuRow) action.onClick(menuRow);
                handleMenuClose();
              }}
              sx={{
                color: action.color ? `${action.color}.main` : 'text.primary',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {action.icon}
                {action.label}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Column Filters Popovers */}
      {enableColumnFilters && visibleColumnsArray.map((column) => (
        <Popover
          key={`filter-${column.id}`}
          open={Boolean(filterAnchorEl[column.id])}
          anchorEl={filterAnchorEl[column.id]}
          onClose={() => handleFilterClose(column.id)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Filter: {column.label}
              </Typography>
              {columnFilters[column.id] && (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleClearFilter(column.id);
                    handleFilterClose(column.id);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Text Filter */}
            {(column.type === 'text' || !column.type) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={columnFilters[column.id]?.operator || 'contains'}
                    onChange={(e) => {
                      const currentFilter = columnFilters[column.id] || { type: 'text', value: '' };
                      handleFilterChange(column.id, {
                        ...currentFilter,
                        type: 'text',
                        operator: e.target.value as any,
                      });
                    }}
                    label="Operator"
                  >
                    <MenuItem value="contains">Contains</MenuItem>
                    <MenuItem value="equals">Equals</MenuItem>
                    <MenuItem value="startsWith">Starts with</MenuItem>
                    <MenuItem value="endsWith">Ends with</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Filter value..."
                  value={columnFilters[column.id]?.value || ''}
                  onChange={(e) => {
                    handleFilterChange(column.id, {
                      type: 'text',
                      value: e.target.value,
                      operator: columnFilters[column.id]?.operator || 'contains',
                    });
                  }}
                  fullWidth
                />
              </Box>
            )}

            {/* Number Filter */}
            {column.type === 'number' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={columnFilters[column.id]?.operator || 'equals'}
                    onChange={(e) => {
                      const currentFilter = columnFilters[column.id] || { type: 'number', value: '' };
                      handleFilterChange(column.id, {
                        ...currentFilter,
                        type: 'number',
                        operator: e.target.value as any,
                      });
                    }}
                    label="Operator"
                  >
                    <MenuItem value="equals">Equals (=)</MenuItem>
                    <MenuItem value="gt">Greater than (&gt;)</MenuItem>
                    <MenuItem value="gte">Greater or equal (≥)</MenuItem>
                    <MenuItem value="lt">Less than (&lt;)</MenuItem>
                    <MenuItem value="lte">Less or equal (≤)</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Filter value..."
                  value={columnFilters[column.id]?.value || ''}
                  onChange={(e) => {
                    handleFilterChange(column.id, {
                      type: 'number',
                      value: e.target.value,
                      operator: columnFilters[column.id]?.operator || 'equals',
                    });
                  }}
                  fullWidth
                />
              </Box>
            )}

            {/* Select Filter (Dropdown with unique values) */}
            {(column.type === 'chip' || column.type === 'select') && (
              <FormControl size="small" fullWidth>
                <InputLabel>Select value</InputLabel>
                <Select
                  value={columnFilters[column.id]?.value || ''}
                  onChange={(e) => {
                    handleFilterChange(column.id, {
                      type: 'select',
                      value: e.target.value,
                    });
                  }}
                  label="Select value"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {getUniqueColumnValues(column.id).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Boolean Filter */}
            {column.type === 'boolean' && (
              <FormControl size="small" fullWidth>
                <InputLabel>Select value</InputLabel>
                <Select
                  value={columnFilters[column.id]?.value ?? ''}
                  onChange={(e) => {
                    handleFilterChange(column.id, {
                      type: 'boolean',
                      value: e.target.value === '' ? '' : e.target.value === 'true',
                    });
                  }}
                  label="Select value"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Date Filter */}
            {column.type === 'date' && (
              <TextField
                size="small"
                type="date"
                value={columnFilters[column.id]?.value || ''}
                onChange={(e) => {
                  handleFilterChange(column.id, {
                    type: 'date',
                    value: e.target.value,
                  });
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Box>
        </Popover>
      ))}

      {/* Column Management Dialog */}
      {enableColumnManagement && (
        <Dialog
          open={columnManagementOpen}
          onClose={() => setColumnManagementOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Manage Columns
            </Typography>
            <IconButton size="small" onClick={() => setColumnManagementOpen(false)}>
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleShowAllColumns}
                fullWidth
              >
                Show All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleHideAllColumns}
                fullWidth
              >
                Hide All
              </Button>
            </Box>
            <List>
              {columns.map((column) => (
                <ListItem
                  key={column.id}
                  dense
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={column.label}
                    secondary={column.id}
                  />
                  <Switch
                    edge="end"
                    checked={visibleColumns.has(column.id)}
                    onChange={() => handleToggleColumn(column.id)}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              {visibleColumns.size} of {columns.length} columns visible
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setColumnManagementOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default EnhancedDataTable;
