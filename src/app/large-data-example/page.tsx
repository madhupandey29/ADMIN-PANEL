"use client";
import React, { useState, useMemo } from 'react';
import {
    Box, Button, Typography, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, Tabs, Tab, Grid, Divider, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';
import type { Column, FormSection } from '@/components';

// Product interface with 30 fields including 3 images
interface Product {
    _id: string;
    // Images (3 fields)
    mainImage: string;
    thumbnail: string;
    galleryImage: string;
    // Basic Info (5 fields)
    name: string;
    sku: string;
    barcode: string;
    slug: string;
    description: string;
    // Categorization (5 fields)
    category: string;
    subCategory: string;
    brand: string;
    manufacturer: string;
    supplier: string;
    // Pricing (5 fields)
    price: number;
    costPrice: number;
    salePrice: number | null;
    msrp: number;
    marginPercent: number;
    // Inventory (5 fields)
    stock: number;
    reservedStock: number;
    reorderLevel: number;
    warehouse: string;
    condition: string;
    // Product Details (4 fields)
    weight: string;
    dimensions: string;
    color: string;
    size: string;
    // Status & Metadata (3 fields)
    status: 'active' | 'inactive' | 'draft' | 'archived';
    featured: boolean;
    trending: boolean;
}

const generateMockData = (count: number): Product[] => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'];
    const brands = ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'Dell', 'HP', 'Lenovo'];
    const statuses: Array<'active' | 'inactive' | 'draft' | 'archived'> = ['active', 'inactive', 'draft', 'archived'];
    const suppliers = ['Supplier Inc', 'Global Trade Co', 'Best Wholesale', 'Prime Distributors', 'Elite Supply'];
    const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D', 'Warehouse E'];
    const conditions = ['New', 'Refurbished', 'Used - Like New', 'Used - Good'];
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Silver', 'Gold', 'Gray'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

    return Array.from({ length: count }, (_, i) => {
        const basePrice = Math.round((Math.random() * 500 + 50) * 100) / 100;
        const costPrice = Math.round(basePrice * 0.6 * 100) / 100;
        const salePrice = Math.random() > 0.7 ? Math.round(basePrice * 0.85 * 100) / 100 : null;
        const stock = Math.floor(Math.random() * 1000);
        const reserved = Math.floor(Math.random() * 50);

        return {
            _id: `prod-${i + 1}`,
            // Images
            mainImage: `https://picsum.photos/seed/main${i}/200/200`,
            thumbnail: `https://picsum.photos/seed/thumb${i}/100/100`,
            galleryImage: `https://picsum.photos/seed/gallery${i}/200/200`,
            // Basic Info
            name: `Product ${i + 1}`,
            sku: `SKU-${String(i + 1).padStart(5, '0')}`,
            barcode: `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
            slug: `product-${i + 1}`,
            description: `High-quality ${categories[i % categories.length]} product with premium features and excellent performance.`,
            // Categorization
            category: categories[i % categories.length],
            subCategory: `Sub ${categories[i % categories.length]} ${(i % 3) + 1}`,
            brand: brands[i % brands.length],
            manufacturer: brands[i % brands.length] + ' Manufacturing Ltd.',
            supplier: suppliers[i % suppliers.length],
            // Pricing
            price: basePrice,
            costPrice: costPrice,
            salePrice: salePrice,
            msrp: Math.round(basePrice * 1.2 * 100) / 100,
            marginPercent: Math.round(((basePrice - costPrice) / basePrice) * 100),
            // Inventory
            stock: stock,
            reservedStock: reserved,
            reorderLevel: Math.floor(Math.random() * 50) + 10,
            warehouse: warehouses[i % warehouses.length],
            condition: conditions[i % conditions.length],
            // Product Details
            weight: (Math.random() * 10 + 0.5).toFixed(2) + ' kg',
            dimensions: `${Math.floor(Math.random() * 50) + 5}x${Math.floor(Math.random() * 50) + 5}x${Math.floor(Math.random() * 50) + 5} cm`,
            color: colors[i % colors.length],
            size: sizes[i % sizes.length],
            // Status & Metadata
            status: statuses[i % statuses.length],
            featured: Math.random() > 0.7,
            trending: Math.random() > 0.8,
        };
    });
};

export default function LargeDataExamplePage() {
    const [data, setData] = useState<Product[]>(() => generateMockData(100));
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [viewTabValue, setViewTabValue] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({});

    // Define all 30 columns
    const columns: Column<Product>[] = useMemo(() => [
        // Images (3 columns)
        { id: 'mainImage', label: 'Main Image', type: 'image', minWidth: 100, sortable: false, filterable: false },
        { id: 'thumbnail', label: 'Thumbnail', type: 'image', minWidth: 80, sortable: false, filterable: false },
        { id: 'galleryImage', label: 'Gallery', type: 'image', minWidth: 100, sortable: false, filterable: false },

        // Basic Info (5 columns)
        { id: 'name', label: 'Product Name', type: 'text', sortable: true, filterable: true, minWidth: 200 },
        { id: 'sku', label: 'SKU', type: 'text', sortable: true, filterable: true, minWidth: 120 },
        { id: 'barcode', label: 'Barcode', type: 'text', sortable: true, filterable: true, minWidth: 150 },
        { id: 'slug', label: 'Slug', type: 'text', sortable: true, filterable: true, minWidth: 150 },
        { id: 'description', label: 'Description', type: 'text', sortable: false, filterable: true, minWidth: 250 },

        // Categorization (5 columns)
        { id: 'category', label: 'Category', type: 'chip', sortable: true, filterable: true, minWidth: 130 },
        { id: 'subCategory', label: 'Sub Category', type: 'chip', sortable: true, filterable: true, minWidth: 150 },
        { id: 'brand', label: 'Brand', type: 'chip', sortable: true, filterable: true, minWidth: 120 },
        { id: 'manufacturer', label: 'Manufacturer', type: 'text', sortable: true, filterable: true, minWidth: 200 },
        { id: 'supplier', label: 'Supplier', type: 'chip', sortable: true, filterable: true, minWidth: 150 },

        // Pricing (5 columns)
        { id: 'price', label: 'Price ($)', type: 'number', sortable: true, filterable: true, minWidth: 100 },
        { id: 'costPrice', label: 'Cost Price ($)', type: 'number', sortable: true, filterable: true, minWidth: 120 },
        { id: 'salePrice', label: 'Sale Price ($)', type: 'number', sortable: true, filterable: true, minWidth: 120 },
        { id: 'msrp', label: 'MSRP ($)', type: 'number', sortable: true, filterable: true, minWidth: 100 },
        { id: 'marginPercent', label: 'Margin %', type: 'number', sortable: true, filterable: true, minWidth: 100 },

        // Inventory (5 columns)
        { id: 'stock', label: 'Stock Qty', type: 'number', sortable: true, filterable: true, minWidth: 100 },
        { id: 'reservedStock', label: 'Reserved', type: 'number', sortable: true, filterable: true, minWidth: 100 },
        { id: 'reorderLevel', label: 'Reorder Level', type: 'number', sortable: true, filterable: true, minWidth: 130 },
        { id: 'warehouse', label: 'Warehouse', type: 'chip', sortable: true, filterable: true, minWidth: 130 },
        { id: 'condition', label: 'Condition', type: 'chip', sortable: true, filterable: true, minWidth: 140 },

        // Product Details (4 columns)
        { id: 'weight', label: 'Weight', type: 'text', sortable: true, filterable: true, minWidth: 100 },
        { id: 'dimensions', label: 'Dimensions', type: 'text', sortable: true, filterable: true, minWidth: 150 },
        { id: 'color', label: 'Color', type: 'chip', sortable: true, filterable: true, minWidth: 100 },
        { id: 'size', label: 'Size', type: 'chip', sortable: true, filterable: true, minWidth: 100 },

        // Status & Metadata (3 columns)
        { id: 'status', label: 'Status', type: 'chip', sortable: true, filterable: true, minWidth: 110 },
        { id: 'featured', label: 'Featured', type: 'boolean', sortable: true, filterable: true, minWidth: 100 },
        { id: 'trending', label: 'Trending', type: 'boolean', sortable: true, filterable: true, minWidth: 100 },
    ], []);

    // Calculate statistics
    const stats = useMemo(() => {
        const activeProducts = data.filter(p => p.status === 'active').length;
        const featuredProducts = data.filter(p => p.featured).length;
        const trendingProducts = data.filter(p => p.trending).length;
        const lowStockProducts = data.filter(p => p.stock < 50).length;
        const totalValue = data.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const avgMargin = data.reduce((sum, p) => sum + p.marginPercent, 0) / data.length;

        return {
            total: data.length,
            active: activeProducts,
            featured: featuredProducts,
            trending: trendingProducts,
            lowStock: lowStockProducts,
            totalValue: totalValue.toFixed(2),
            avgMargin: avgMargin.toFixed(1),
        };
    }, [data]);

    const handleExportSelected = () => {
        console.log('Exporting selected products:', selectedProducts);
        alert(`Exporting ${selectedProducts.length} products...`);
    };

    const handleArchiveSelected = () => {
        console.log('Archiving selected products:', selectedProducts);
        alert(`Archiving ${selectedProducts.length} products...`);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setDialogOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setDialogOpen(true);
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            setData(prevData => prevData.filter(p => p._id !== product._id));
            alert(`Product "${product.name}" deleted successfully!`);
        }
    };

    const handleView = (product: Product) => {
        // Open edit dialog directly for now
        handleEdit(product);
    };

    const handleInlineEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (viewingProduct) {
            setEditFormData(viewingProduct);
        }
    };

    const handleSaveInlineEdit = () => {
        if (viewingProduct && editFormData) {
            setData(prevData => prevData.map(p =>
                p._id === viewingProduct._id ? { ...p, ...editFormData } : p
            ));
            setViewingProduct({ ...viewingProduct, ...editFormData } as Product);
            setIsEditMode(false);
            alert('Product updated successfully!');
        }
    };

    const handleFieldChange = (field: keyof Product, value: any) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (formData: any) => {
        if (editingProduct) {
            // Update existing product
            setData(prevData => prevData.map(p =>
                p._id === editingProduct._id ? { ...p, ...formData } : p
            ));
            alert(`Product "${formData.name}" updated successfully!`);
        } else {
            // Add new product
            const newProduct: Product = {
                _id: `prod-${Date.now()}`,
                mainImage: formData.mainImage || 'https://picsum.photos/seed/new/200/200',
                thumbnail: formData.thumbnail || 'https://picsum.photos/seed/new-thumb/100/100',
                galleryImage: formData.galleryImage || 'https://picsum.photos/seed/new-gallery/200/200',
                ...formData,
            };
            setData(prevData => [newProduct, ...prevData]);
            alert(`Product "${formData.name}" added successfully!`);
        }
        setDialogOpen(false);
        setEditingProduct(null);
    };

    // Form sections - 6 columns per row on desktop (1500px), 4 on tablet, 3 on mobile
    const formSections: FormSection[] = [
        {
            title: '📝 Product Information',
            fields: [
                { name: 'name', label: 'Product Name', type: 'text', required: true, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'sku', label: 'SKU', type: 'text', required: true, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'barcode', label: 'Barcode', type: 'text', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                {
                    name: 'category', label: 'Category', type: 'select', required: true, options: [
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Clothing', value: 'Clothing' },
                        { label: 'Home & Garden', value: 'Home & Garden' },
                        { label: 'Sports', value: 'Sports' },
                        { label: 'Books', value: 'Books' },
                        { label: 'Toys', value: 'Toys' },
                        { label: 'Beauty', value: 'Beauty' },
                        { label: 'Automotive', value: 'Automotive' },
                    ], gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
                { name: 'subCategory', label: 'Sub Category', type: 'text', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'brand', label: 'Brand', type: 'text', required: true, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'slug', label: 'Slug', type: 'text', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'manufacturer', label: 'Manufacturer', type: 'text', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'supplier', label: 'Supplier', type: 'text', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'description', label: 'Description', type: 'textarea', rows: 2, gridSize: { xs: 12, sm: 6, md: 6, lg: 6 } },
            ],
        },
        {
            title: '💰 Pricing & Inventory',
            fields: [
                { name: 'price', label: 'Price ($)', type: 'number', required: true, min: 0, step: 0.01, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'costPrice', label: 'Cost ($)', type: 'number', min: 0, step: 0.01, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'salePrice', label: 'Sale ($)', type: 'number', min: 0, step: 0.01, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'msrp', label: 'MSRP ($)', type: 'number', min: 0, step: 0.01, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'stock', label: 'Stock', type: 'number', required: true, min: 0, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'reservedStock', label: 'Reserved', type: 'number', min: 0, defaultValue: 0, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'reorderLevel', label: 'Reorder', type: 'number', min: 0, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                {
                    name: 'warehouse', label: 'Warehouse', type: 'select', options: [
                        { label: 'Warehouse A', value: 'Warehouse A' },
                        { label: 'Warehouse B', value: 'Warehouse B' },
                        { label: 'Warehouse C', value: 'Warehouse C' },
                        { label: 'Warehouse D', value: 'Warehouse D' },
                        { label: 'Warehouse E', value: 'Warehouse E' },
                    ], gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
            ],
        },
        {
            title: '📏 Details & Status',
            fields: [
                { name: 'weight', label: 'Weight', type: 'text', placeholder: '2.5kg', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: '10x20x30', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                {
                    name: 'color', label: 'Color', type: 'select', options: [
                        { label: 'Red', value: 'Red' },
                        { label: 'Blue', value: 'Blue' },
                        { label: 'Green', value: 'Green' },
                        { label: 'Black', value: 'Black' },
                        { label: 'White', value: 'White' },
                        { label: 'Silver', value: 'Silver' },
                        { label: 'Gold', value: 'Gold' },
                        { label: 'Gray', value: 'Gray' },
                    ], gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
                {
                    name: 'size', label: 'Size', type: 'select', options: [
                        { label: 'XS', value: 'XS' },
                        { label: 'S', value: 'S' },
                        { label: 'M', value: 'M' },
                        { label: 'L', value: 'L' },
                        { label: 'XL', value: 'XL' },
                        { label: 'XXL', value: 'XXL' },
                        { label: 'One Size', value: 'One Size' },
                    ], gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
                {
                    name: 'condition', label: 'Condition', type: 'select', options: [
                        { label: 'New', value: 'New' },
                        { label: 'Refurbished', value: 'Refurbished' },
                        { label: 'Used - Like New', value: 'Used - Like New' },
                        { label: 'Used - Good', value: 'Used - Good' },
                    ], gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
                {
                    name: 'status', label: 'Status', type: 'select', required: true, options: [
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                        { label: 'Draft', value: 'draft' },
                        { label: 'Archived', value: 'archived' },
                    ], defaultValue: 'active', gridSize: { xs: 4, sm: 3, md: 3, lg: 2 }
                },
                { name: 'featured', label: 'Featured', type: 'switch', defaultValue: false, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
                { name: 'trending', label: 'Trending', type: 'switch', defaultValue: false, gridSize: { xs: 4, sm: 3, md: 3, lg: 2 } },
            ],
        },
    ];

    // Render compact view/edit dialog matching the form layout
    const renderViewDialog = () => {
        if (!viewingProduct) return null;

        const currentData = isEditMode ? editFormData : viewingProduct;

        const renderField = (label: string, field: keyof Product, type: 'text' | 'number' | 'select' | 'textarea' = 'text', options?: Array<{ label: string; value: any }>) => {
            const value = currentData[field];

            if (!isEditMode) {
                // View mode - just display
                return (
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            {label}
                        </Typography>
                        <Typography variant="body2">
                            {type === 'select' && options ?
                                options.find(o => o.value === value)?.label || value :
                                value?.toString() || '-'
                            }
                        </Typography>
                    </Box>
                );
            }

            // Edit mode - show inputs
            return (
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        {label}
                    </Typography>
                    {type === 'select' ? (
                        <select
                            value={value as string}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
                        >
                            {options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : type === 'number' ? (
                        <input
                            type="number"
                            value={value as number}
                            onChange={(e) => handleFieldChange(field, parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
                        />
                    ) : type === 'textarea' ? (
                        <textarea
                            value={value as string}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            rows={2}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', fontFamily: 'inherit' }}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value as string}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
                        />
                    )}
                </Box>
            );
        };

        const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'];
        const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D', 'Warehouse E'];
        const conditions = ['New', 'Refurbished', 'Used - Like New', 'Used - Good'];
        const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Silver', 'Gold', 'Gray'];
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
        const statuses = ['active', 'inactive', 'draft', 'archived'];

        return (
            <Dialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setIsEditMode(false);
                }}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={viewingProduct.mainImage} sx={{ width: 50, height: 50 }} />
                        <Box>
                            <Typography variant="h6">
                                {isEditMode ? '✏️ Edit Product' : '👁️ View Product'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {viewingProduct.name} • SKU: {viewingProduct.sku}
                            </Typography>
                        </Box>
                    </Box>
                    <Button onClick={() => setViewDialogOpen(false)} size="small">
                        <CloseIcon />
                    </Button>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    {/* Images Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="primary" mb={2}>
                            🖼️ Product Images
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                    Main Image
                                </Typography>
                                <img src={viewingProduct.mainImage} alt="Main" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }} />
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                    Thumbnail
                                </Typography>
                                <img src={viewingProduct.thumbnail} alt="Thumbnail" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }} />
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                    Gallery
                                </Typography>
                                <img src={viewingProduct.galleryImage} alt="Gallery" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }} />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Product Information Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="primary" mb={2}>
                            📝 Product Information
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Product Name', 'name')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('SKU', 'sku')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Barcode', 'barcode')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Category', 'category', 'select', categories.map(c => ({ label: c, value: c })))}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Sub Category', 'subCategory')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Brand', 'brand')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Slug', 'slug')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Manufacturer', 'manufacturer')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Supplier', 'supplier')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                                {renderField('Description', 'description', 'textarea')}
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Pricing & Inventory Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="primary" mb={2}>
                            💰 Pricing & Inventory
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Price ($)', 'price', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Cost ($)', 'costPrice', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Sale ($)', 'salePrice', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('MSRP ($)', 'msrp', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Stock', 'stock', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Reserved', 'reservedStock', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Reorder', 'reorderLevel', 'number')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Warehouse', 'warehouse', 'select', warehouses.map(w => ({ label: w, value: w })))}
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Details & Status Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="primary" mb={2}>
                            📏 Details & Status
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Weight', 'weight')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Dimensions', 'dimensions')}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Color', 'color', 'select', colors.map(c => ({ label: c, value: c })))}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Size', 'size', 'select', sizes.map(s => ({ label: s, value: s })))}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Condition', 'condition', 'select', conditions.map(c => ({ label: c, value: c })))}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                {renderField('Status', 'status', 'select', statuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })))}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                    Featured
                                </Typography>
                                {isEditMode ? (
                                    <input
                                        type="checkbox"
                                        checked={currentData.featured}
                                        onChange={(e) => handleFieldChange('featured', e.target.checked)}
                                    />
                                ) : (
                                    <Typography variant="body2">{currentData.featured ? '✅ Yes' : '❌ No'}</Typography>
                                )}
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'span 4', sm: 'span 3', md: 'span 3', lg: 'span 2' } }}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                    Trending
                                </Typography>
                                {isEditMode ? (
                                    <input
                                        type="checkbox"
                                        checked={currentData.trending}
                                        onChange={(e) => handleFieldChange('trending', e.target.checked)}
                                    />
                                ) : (
                                    <Typography variant="body2">{currentData.trending ? '✅ Yes' : '❌ No'}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => {
                        setViewDialogOpen(false);
                        setIsEditMode(false);
                    }}>
                        Close
                    </Button>
                    {!isEditMode ? (
                        <Button
                            variant="contained"
                            onClick={handleInlineEdit}
                        >
                            ✏️ Edit Product
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSaveInlineEdit}
                            >
                                💾 Save Changes
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    🚀 Large Dataset Demo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Comprehensive example with 100 products, 30 fields per product, and 3 image columns
                </Typography>
            </Box>

            {/* Statistics Dashboard */}
            <Box sx={{
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
            }}>
                <Chip label={`Total Products: ${stats.total}`} color="primary" />
                <Chip label={`Active: ${stats.active}`} color="success" />
                <Chip label={`Featured: ${stats.featured}`} color="info" />
                <Chip label={`Trending: ${stats.trending}`} color="warning" />
                <Chip label={`Low Stock: ${stats.lowStock}`} color="error" />
                <Chip label={`Total Value: $${stats.totalValue}`} color="secondary" />
                <Chip label={`Avg Margin: ${stats.avgMargin}%`} color="default" />
            </Box>

            {/* Feature Highlights */}
            <Box sx={{
                mb: 3,
                p: 2,
                bgcolor: 'success.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'success.main',
            }}>
                <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600, mb: 1 }}>
                    ✨ Features Demonstrated:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2, color: 'success.dark' }}>
                    <li><strong>30 Fields per Product</strong> - Complete product data structure</li>
                    <li><strong>3 Image Columns</strong> - Main image, thumbnail, and gallery image</li>
                    <li><strong>100 Products</strong> - Large dataset for testing performance</li>
                    <li><strong>Excel-like Filtering</strong> - Filter by any column with operators</li>
                    <li><strong>Column Management</strong> - Show/hide columns dynamically</li>
                    <li><strong>Bulk Selection</strong> - Select multiple products for actions</li>
                </Box>
            </Box>

            {/* Bulk Actions */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportSelected}
                    disabled={selectedProducts.length === 0}
                >
                    Export Selected ({selectedProducts.length})
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<ArchiveIcon />}
                    onClick={handleArchiveSelected}
                    disabled={selectedProducts.length === 0}
                >
                    Archive Selected ({selectedProducts.length})
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add New Product
                </Button>
            </Box>

            {/* Data Table */}
            <EnhancedDataTable
                columns={columns}
                data={data}
                selectable
                onSelectionChange={setSelectedProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                enableColumnFilters
                enableColumnManagement
                rowsPerPage={15}
                searchPlaceholder="Search by name, SKU, brand, category..."
            />

            {/* View Product Dialog */}
            {renderViewDialog()}

            {/* Add/Edit Product Dialog */}
            <EnhancedFormDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleSubmit}
                title={editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                sections={formSections}
                initialData={editingProduct || {}}
                maxWidth="xl"
                submitLabel={editingProduct ? 'Update Product' : 'Create Product'}
            />

            {/* Instructions */}
            <Box sx={{
                mt: 3,
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'info.main',
            }}>
                <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600, mb: 1 }}>
                    💡 Try These Actions:
                </Typography>
                <Box component="ol" sx={{ m: 0, pl: 2, color: 'info.dark' }}>
                    <li><strong>Filter by Price</strong> - Click filter icon on "Price" column, select "&gt;", enter 200</li>
                    <li><strong>Filter by Category</strong> - Click filter on "Category", select a category from dropdown</li>
                    <li><strong>Filter by Stock</strong> - Click filter on "Stock Qty", select "&lt;", enter 100 to find low stock</li>
                    <li><strong>Manage Columns</strong> - Click column icon (☰) in toolbar to show/hide any of the 30 columns</li>
                    <li><strong>Select Products</strong> - Check boxes to select products, then use bulk actions</li>
                    <li><strong>Sort Data</strong> - Click any column header to sort ascending/descending</li>
                    <li><strong>Search</strong> - Use the search box to find products across all text fields</li>
                </Box>
            </Box>
        </Box>
    );
}
