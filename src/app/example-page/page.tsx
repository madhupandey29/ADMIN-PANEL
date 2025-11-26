"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';
import type { Column, Action, FormSection } from '@/components';

// Example data interface
interface ExampleItem {
    _id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    role: string;
    createdAt: string;
    avatar?: string;
}

// Mock data for demonstration
const mockData: ExampleItem[] = [
    {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        role: 'Admin',
        createdAt: '2024-01-15',
    },
    {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'active',
        role: 'User',
        createdAt: '2024-01-16',
    },
    {
        _id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        status: 'inactive',
        role: 'User',
        createdAt: '2024-01-17',
    },
];

export default function ExamplePage() {
    const [data, setData] = useState<ExampleItem[]>(mockData);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ExampleItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<ExampleItem[]>([]);

    // Define table columns
    const columns: Column<ExampleItem>[] = useMemo(() => [
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            minWidth: 150,
        },
        {
            id: 'email',
            label: 'Email',
            sortable: true,
            minWidth: 200,
        },
        {
            id: 'role',
            label: 'Role',
            type: 'chip',
            sortable: true,
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            format: (value) => (
                <Chip
                    label={value}
                    size="small"
                    color={value === 'active' ? 'success' : 'default'}
                    sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                />
            ),
        },
        {
            id: 'createdAt',
            label: 'Created Date',
            type: 'date',
            sortable: true,
        },
    ], []);

    // Define custom actions
    const customActions: Action<ExampleItem>[] = useMemo(() => [
        {
            icon: <DownloadIcon />,
            label: 'Export',
            onClick: (row) => {
                console.log('Exporting:', row);
                alert(`Exporting data for ${row.name}`);
            },
            color: 'primary',
        },
    ], []);

    // Define form sections
    const formSections: FormSection[] = useMemo(() => [
        {
            title: 'Personal Information',
            description: 'Enter the user details',
            fields: [
                {
                    name: 'name',
                    label: 'Full Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter full name',
                    gridSize: { xs: 12, md: 6 },
                },
                {
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    required: true,
                    placeholder: 'user@example.com',
                    gridSize: { xs: 12, md: 6 },
                    validation: (value) => {
                        if (!value.includes('@')) {
                            return 'Invalid email address';
                        }
                        return null;
                    },
                },
            ],
        },
        {
            title: 'Role & Status',
            fields: [
                {
                    name: 'role',
                    label: 'Role',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Admin', value: 'Admin' },
                        { label: 'User', value: 'User' },
                        { label: 'Manager', value: 'Manager' },
                    ],
                    gridSize: { xs: 12, md: 6 },
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                    ],
                    defaultValue: 'active',
                    gridSize: { xs: 12, md: 6 },
                },
            ],
        },
    ], []);

    // Handlers
    const handleEdit = (item: ExampleItem) => {
        setEditingItem(item);
        setDialogOpen(true);
    };

    const handleDelete = (item: ExampleItem) => {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            setData(prev => prev.filter(i => i._id !== item._id));
            alert(`${item.name} has been deleted`);
        }
    };

    const handleView = (item: ExampleItem) => {
        alert(`Viewing details for ${item.name}\n\nEmail: ${item.email}\nRole: ${item.role}\nStatus: ${item.status}`);
    };

    const handleSubmit = async (formData: any) => {
        console.log('Form submitted:', formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (editingItem) {
            // Update existing item
            setData(prev => prev.map(item =>
                item._id === editingItem._id
                    ? { ...item, ...formData }
                    : item
            ));
            alert(`${formData.name} has been updated`);
        } else {
            // Add new item
            const newItem: ExampleItem = {
                _id: String(Date.now()),
                ...formData,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setData(prev => [...prev, newItem]);
            alert(`${formData.name} has been added`);
        }

        setDialogOpen(false);
        setEditingItem(null);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setDialogOpen(true);
    };

    const handleSelectionChange = (selected: ExampleItem[]) => {
        setSelectedItems(selected);
        console.log('Selected items:', selected);
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) {
            alert('Please select items to delete');
            return;
        }

        if (confirm(`Delete ${selectedItems.length} selected items?`)) {
            const selectedIds = new Set(selectedItems.map(item => item._id));
            setData(prev => prev.filter(item => !selectedIds.has(item._id)));
            setSelectedItems([]);
            alert(`${selectedItems.length} items deleted`);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Example Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Demonstration of EnhancedDataTable and EnhancedFormDialog components
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {selectedItems.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBulkDelete}
                        >
                            Delete Selected ({selectedItems.length})
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        Add New
                    </Button>
                </Box>
            </Box>

            {/* Info Card */}
            <Box sx={{
                mb: 3,
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'info.main',
            }}>
                <Typography variant="body2" sx={{ color: 'info.dark', mb: 1 }}>
                    <strong>💡 This is a demo page</strong> showing how to use the reusable components.
                </Typography>
                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                    <strong>New Features:</strong> Try the <strong>Excel-like column filters</strong> (click filter icons in headers)
                    and <strong>column management</strong> (click column icon in toolbar to show/hide columns).
                    Also try searching, sorting, editing, deleting, and selecting rows.
                </Typography>
            </Box>

            {/* Data Table */}
            <EnhancedDataTable
                columns={columns}
                data={data}
                loading={loading}

                // Actions
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                customActions={customActions}

                // Selection
                selectable
                onSelectionChange={handleSelectionChange}

                // Search & Pagination
                searchable
                searchPlaceholder="Search by name, email, or role..."
                rowsPerPage={5}
                showPagination

                // New Features - Excel-like filtering and column management
                enableColumnFilters
                enableColumnManagement

                // Styling
                stickyHeader

                // Row interactions
                onRowClick={(row) => console.log('Row clicked:', row)}
                getRowId={(row) => row._id}

                // Empty state
                emptyMessage="No users found. Click 'Add New' to create one."
            />

            {/* Form Dialog */}
            <EnhancedFormDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSubmit}
                title={editingItem ? 'Edit User' : 'Add New User'}
                sections={formSections}
                initialData={editingItem || {}}
                maxWidth="md"
                submitLabel={editingItem ? 'Update' : 'Create'}
                validateOnChange
            />

            {/* Stats Footer */}
            <Box sx={{
                mt: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 3,
            }}>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Total Users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Active Users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {data.filter(item => item.status === 'active').length}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Selected
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {selectedItems.length}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
