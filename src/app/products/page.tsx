"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, CircularProgress, Chip, Autocomplete, InputAdornment, AppBar, Toolbar, Checkbox, FormControlLabel
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import Image from 'next/image';
import { apiFetch } from '../../utils/apiFetch';
import { EnhancedDataTable } from '@/components';
import type { Column } from '@/components';
import ProductFormDialog from './ProductFormDialog';
import ProductViewDialog from './ProductViewDialog';

interface Product {
  _id?: string;
  name: string;
  slug?: string;
  productdescription?: string;
  img?: string;
  image1?: string;
  image2?: string;
  altimg1?: string;
  altimg2?: string;
  altimg3?: string;
  category: string;
  substructure: string;
  content: string;
  design: string;
  subfinish: string;
  subsuitable: string[];
  vendor: string;
  groupcode: string;
  color: string | string[];
  motif?: string;
  um?: string;
  currency?: string;
  gsm?: number;
  oz?: number;
  cm?: number;
  inch?: number;
  video?: string;
  videoThumbnail?: string;
  altvideo?: string;
  purchasePrice?: number | string;
  salesPrice?: number | string;
  vendorFabricCode?: string;
  productIdentifier?: string;
  leadtime?: string[];
  sku?: string;
  popularproduct?: boolean;
  topratedproduct?: boolean;
  landingPageProduct?: boolean;
  shopyProduct?: boolean;
  rating_value?: string | number;
  rating_count?: string | number;
  productlocationtitle?: string;
  productlocationtagline?: string;
  productlocationdescription1?: string;
  productlocationdescription2?: string;
  ogType?: string;
  twitterCard?: string;
  ogImage_twitterimage?: string;
}

interface Option { _id: string; name: string; }

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getProductPagePermission() {
  if (typeof window === 'undefined') return 'no access';
  const email = localStorage.getItem('admin-email');
  const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
  if (email && superAdmin && email === superAdmin) return 'all access';
  const perms = JSON.parse(localStorage.getItem('admin-permissions') || '{}');
  if (perms && perms.product) {
    return perms.product;
  }
  return 'no access';
}

function getImageUrl(img: string | undefined): string | undefined {
  if (!img) return undefined;

  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  return `${API_URL}/images/${img}`;
}

function hasName(obj: unknown): obj is { name: string } {
  return Boolean(obj && typeof obj === 'object' && 'name' in obj && typeof (obj as { name?: unknown }).name === 'string');
}

// Add a type guard for objects with a name property
function isNameObject(val: unknown): val is { name: string } {
  return typeof val === 'object' && val !== null && 'name' in val && typeof (val as { name?: unknown }).name === 'string';
}

export default function ProductPage() {
  const [pageAccess, setPageAccess] = useState<'all access' | 'only view' | 'no access'>('no access');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [dropdowns, setDropdowns] = useState<{ [key: string]: Option[] }>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  interface FormState {
    name: string;
    slug?: string;
    productdescription?: string;
    category: string;
    substructure: string;
    content: string;
    design: string;
    subfinish: string;
    subsuitable: string[];
    vendor: string;
    groupcode: string;
    colors: string[];
    motif?: string;
    um?: string;
    currency?: string;
    gsm?: number | string;
    oz?: number | string;
    cm?: number | string;
    inch?: number | string;
    img?: File | string;
    image1?: File | string;
    image2?: File | string;
    altimg1?: string;
    altimg2?: string;
    altimg3?: string;
    video?: File | string;
    videoThumbnail?: string;
    altvideo?: string;
    purchasePrice?: number | string;
    salesPrice?: number | string;
    vendorFabricCode?: string;
    productIdentifier?: string;
    leadtime?: string[];
    sku?: string;
    popularproduct?: boolean;
    topratedproduct?: boolean;
    landingPageProduct?: boolean;
    shopyProduct?: boolean;
    rating_value?: number | string;
    rating_count?: number | string;
    productlocationtitle?: string;
    productlocationtagline?: string;
    productlocationdescription1?: string;
    productlocationdescription2?: string;
    ogType?: string;
    twitterCard?: string;
    ogImage_twitterimage?: string;
    [key: string]: string | number | boolean | File | string[] | null | undefined;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    productdescription: "",
    category: "",
    substructure: "",
    content: "",
    design: "",
    subfinish: "",
    subsuitable: [],
    vendor: "",
    groupcode: "",
    colors: [],
    motif: "",
    um: "",
    currency: "",
    gsm: "",
    oz: "",
    cm: "",
    inch: "",
    img: undefined,
    image1: undefined,
    image2: undefined,
    altimg1: "",
    altimg2: "",
    altimg3: "",
    video: undefined,
    altvideo: "",
    purchasePrice: "",
    salesPrice: "",
    vendorFabricCode: "",
    productIdentifier: "",
    leadtime: [],
    sku: "",
    popularproduct: false,
    topratedproduct: false,
    landingPageProduct: false,
    shopyProduct: false,
    rating_value: "",
    rating_count: "",
    productlocationtitle: "",
    productlocationtagline: "",
    productlocationdescription1: "",
    productlocationdescription2: "",
    ogType: "",
    twitterCard: "summary_large_image",
    ogImage_twitterimage: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formImgDims, setFormImgDims] = useState<{ img?: [number, number], image1?: [number, number], image2?: [number, number] }>({});
  const [formVideoDims, setFormVideoDims] = useState<[number, number] | undefined>(undefined);

  // State for subsuitable builder
  const [subsuitableInput, setSubsuitableInput] = useState({
    gender: '',
    clothType: '',
    number: ''
  });

  // State for tracking editable subsuitable items
  interface EditableSubsuitableItem {
    gender: string;
    clothType: string;
    number: string;
  }
  const [editableSubsuitableItems, setEditableSubsuitableItems] = useState<EditableSubsuitableItem[]>([]);

  // Helper function to safely get image URL
  const getSafeImageUrl = (img: string | undefined | null): string | null => {
    if (!img) return null;
    const url = getImageUrl(img);
    return url || null;
  };
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const image1InputRef = React.useRef<HTMLInputElement>(null);
  const image2InputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const dropdownFields = React.useMemo(() => [
    { key: "category", label: "Category" },
    { key: "substructure", label: "Substructure" },
    { key: "content", label: "Content" },
    { key: "design", label: "Design" },
    { key: "subfinish", label: "Subfinish" },
    { key: "subsuitable", label: "Subsuitable" },
    { key: "vendor", label: "Vendor" },
    { key: "groupcode", label: "Groupcode" },
    { key: "color", label: "Color" },
    { key: "motif", label: "Motif" },
  ], []);

  // Add state for image dimensions
  const [imgDims, setImgDims] = useState<{ img?: [number, number], image1?: [number, number], image2?: [number, number] }>({});
  // Add state for video dimensions
  const [videoDims, setVideoDims] = useState<[number, number] | undefined>(undefined);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const umOptions: string[] = ["KG", "Yard", "Meter"];
  const currencyOptions: string[] = ["INR", "USD", "EUR", "GBP", "JPY", "CNY", "CAD", "AUD", "SGD", "CHF", "ZAR", "RUB", "BRL", "HKD", "NZD", "KRW", "THB", "MYR", "IDR", "PHP", "VND", "TRY", "SAR", "AED", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "ILS", "MXN", "TWD", "ARS", "CLP", "COP", "PEN", "EGP", "PKR", "BDT", "LKR", "NPR", "KES", "NGN", "GHS", "UAH", "QAR", "OMR", "KWD", "BHD", "JOD", "MAD", "DZD", "TND", "LBP", "IQD", "IRR", "AFN", "MNT", "UZS", "KZT", "AZN", "GEL", "BYN", "MDL", "ALL", "MKD", "BAM", "HRK", "RSD", "BGN", "RON", "ISK"];

  // Define columns for EnhancedDataTable
  const columns: Column<Product>[] = useMemo(() => [
    {
      id: 'img',
      label: 'Image',
      type: 'image',
      minWidth: 80,
      format: (value, product: Product) => product.img ? getImageUrl(product.img) : undefined,
    },
    {
      id: 'name',
      label: 'Product Name',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => product.name || '-',
    },
    {
      id: 'slug',
      label: 'Slug',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => product.slug || '-',
    },
    {
      id: 'category',
      label: 'Category',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => {
        const cat: any = product.category;
        if (!cat) return '-';
        if (typeof cat === 'string') return cat;
        return cat.name || '-';
      },
    },
    {
      id: 'substructure',
      label: 'Substructure',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => {
        const sub: any = product.substructure;
        if (!sub) return '-';
        if (typeof sub === 'string') return sub;
        return sub.name || '-';
      },
    },
    {
      id: 'vendor',
      label: 'Vendor',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => {
        const ven: any = product.vendor;
        if (!ven) return '-';
        if (typeof ven === 'string') return ven;
        return ven.name || '-';
      },
    },
    {
      id: 'color',
      label: 'Colors',
      format: (value, product: Product) => {
        const colors = product.color;
        if (!colors) return '-';
        const colorArray = Array.isArray(colors) ? colors : [colors];
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {colorArray.map((color, index) => {
              let colorLabel = 'N/A';
              if (typeof color === 'string') {
                colorLabel = color;
              } else if (color && typeof color === 'object' && 'name' in color) {
                colorLabel = (color as { name?: string }).name || 'N/A';
              }
              return (
                <Chip key={index} label={colorLabel} size="small" sx={{ fontSize: '11px' }} />
              );
            })}
          </Box>
        );
      },
    },
    {
      id: 'salesPrice',
      label: 'Sales Price',
      sortable: true,
      filterable: true,
      type: 'number',
      format: (value, product: Product) => {
        if (!product.salesPrice) return '-';
        const currency = typeof product.currency === 'string' ? product.currency : '₹';
        return `${currency} ${product.salesPrice}`;
      },
    },
    {
      id: 'sku',
      label: 'SKU',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => product.sku || '-',
    },
    {
      id: 'vendorFabricCode',
      label: 'Vendor Fabric Code',
      sortable: true,
      filterable: true,
      format: (value, product: Product) => product.vendorFabricCode || '-',
    },
    {
      id: 'popularproduct',
      label: 'Popular',
      type: 'boolean',
    },
    {
      id: 'topratedproduct',
      label: 'Top Rated',
      type: 'boolean',
    },
  ], []);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const popular = products.filter(p => p.popularproduct).length;
    const topRated = products.filter(p => p.topratedproduct).length;
    const landingPage = products.filter(p => p.landingPageProduct).length;
    const withPrice = products.filter(p => p.salesPrice).length;

    return {
      total,
      popular,
      topRated,
      landingPage,
      withPrice,
    };
  }, [products]);

  const fetchDropdowns = useCallback(async () => {
    try {
      const results = await Promise.all(
        dropdownFields.map(f => apiFetch(`${API_URL}/${f.key}`))
      );
      const datas = await Promise.all(results.map(r => r.json()));
      const newDropdowns: { [key: string]: Option[] } = {};
      dropdownFields.forEach((f, i) => {
        const options = datas[i].data || [];
        // Sort dropdown options alphabetically by name
        options.sort((a: Option, b: Option) => a.name.localeCompare(b.name));
        newDropdowns[f.key] = options;
      });
      setDropdowns(newDropdowns);
    } finally {
      // setDropdownLoading(false); // Removed as per edit hint
    }
  }, [dropdownFields]);

  const refreshDropdown = useCallback(async (key: string) => {
    try {
      const res = await apiFetch(`${API_URL}/${key}`);
      const data = await res.json();
      const items: Option[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      // Sort dropdown options alphabetically by name
      items.sort((a: Option, b: Option) => a.name.localeCompare(b.name));
      setDropdowns(prev => ({ ...prev, [key]: items }));
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const url = `${API_URL}/product`;
      const res = await apiFetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data.data) ? (data.data as Product[]) : []);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      // Permission logic can be handled by setPageAccess only
    };
    checkPermission();
  }, [fetchProducts, fetchDropdowns]);

  useEffect(() => {
    fetchProducts();
    fetchDropdowns();
  }, [fetchProducts, fetchDropdowns]);

  useEffect(() => {
    setPageAccess(getProductPagePermission());
  }, []);

  useEffect(() => {
    if (form.gsm && !isNaN(Number(form.gsm))) {
      const gsmValue = Number(form.gsm);
      // GSM to OZ conversion: 1 GSM = 0.0295735 OZ
      const ozValue = (gsmValue * 0.0295735).toFixed(4);
      setForm(prev => ({ ...prev, oz: ozValue }));
    } else if (!form.gsm) {
      setForm(prev => ({ ...prev, oz: "" }));
    }
  }, [form.gsm]);

  useEffect(() => {
    if (form.cm && !isNaN(Number(form.cm))) {
      const cmValue = Number(form.cm);
      // CM to INCH conversion: 1 CM = 0.393701 INCH
      const inchValue = (cmValue * 0.393701).toFixed(4);
      setForm(prev => ({ ...prev, inch: inchValue }));
    } else if (!form.cm) {
      setForm(prev => ({ ...prev, inch: "" }));
    }
  }, [form.cm]);

  const getId = useCallback((field: unknown): string => {
    if (field && typeof field === 'object' && '_id' in field && typeof (field as { _id?: unknown })._id === 'string') {
      return (field as { _id: string })._id;
    }
    if (typeof field === 'string') return field;
    return '';
  }, []);

  // Define the shape of a color object for type safety
  interface ColorObject {
    _id: string;
    name?: string;
  }

  // Handlers for EnhancedDataTable
  const handleDeleteProduct = useCallback(async (product: Product) => {
    if (!product._id) return;

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        const res = await apiFetch(`${API_URL}/product/${product._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchProducts();
          alert(`Product "${product.name}" deleted successfully!`);
        } else {
          const error = await res.json();
          console.error("Error:", error);
          alert(error.message || "An error occurred");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting the product");
      }
    }
  }, [fetchProducts]);

  const handleExportSelected = useCallback(() => {
    if (selectedProducts.length === 0) return;

    const dataStr = JSON.stringify(selectedProducts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Exported ${selectedProducts.length} products successfully!`);
  }, [selectedProducts]);

  const handleOpen = useCallback((product?: Product) => {
    if (product) {
      console.log('Editing product:', product); // Debug log

      // Helper function to safely get ID from either string or object
      const getFieldValue = (field: string | { _id?: string } | null | undefined): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (field && typeof field === 'object' && '_id' in field) {
          return field._id || '';
        }
        return '';
      };

      // Handle colors - ensure we always have an array of color IDs
      let colors: string[] = [];
      if (product.color) {
        if (Array.isArray(product.color)) {
          colors = product.color
            .map(c => {
              if (!c) return '';
              if (typeof c === 'string') return c;
              return (c as ColorObject)._id || '';
            })
            .filter(Boolean) as string[];
        } else if (typeof product.color === 'string') {
          colors = [product.color];
        } else if ('_id' in product.color) {
          colors = [(product.color as ColorObject)._id];
        }
      }

      // Handle subsuitable - ensure we always have an array
      let subsuitable: string[] = [];
      if (product.subsuitable) {
        if (Array.isArray(product.subsuitable)) {
          // If array elements contain commas, split them
          subsuitable = product.subsuitable
            .flatMap(item => {
              if (typeof item === 'string' && item.includes(',')) {
                // Split by comma to get individual items
                return item.split(',').map(s => s.trim()).filter(Boolean);
              }
              return item;
            })
            .filter(Boolean) as string[];
        }
      }

      // Parse subsuitable items into editable format for display
      const parsedItems: EditableSubsuitableItem[] = subsuitable.map(item => {
        const parts = item.split('-');
        if (parts.length >= 3) {
          return {
            gender: parts[0],
            clothType: parts[1],
            number: parts[2]
          };
        }
        // Fallback for invalid format
        return { gender: '', clothType: '', number: item };
      });
      setEditableSubsuitableItems(parsedItems);

      // Handle leadtime - ensure we always have an array
      let leadtime: string[] = [];
      if (product.leadtime) {
        if (Array.isArray(product.leadtime)) {
          leadtime = product.leadtime.filter(Boolean) as string[];
        }
      }

      // Generate slug from name if not exists
      const slug = product.slug || generateSlug(product.name);

      const formData = {
        name: product.name,
        slug: slug,
        productdescription: product.productdescription || '',
        category: getFieldValue(product.category),
        substructure: getFieldValue(product.substructure),
        content: getFieldValue(product.content),
        design: getFieldValue(product.design),
        subfinish: getFieldValue(product.subfinish),
        subsuitable: subsuitable,
        vendor: getFieldValue(product.vendor),
        groupcode: getFieldValue(product.groupcode),
        colors: colors,
        motif: getFieldValue(product.motif),
        um: getFieldValue(product.um),
        currency: getFieldValue(product.currency),
        gsm: product.gsm !== undefined && product.gsm !== null ? String(product.gsm) : "",
        oz: product.oz !== undefined && product.oz !== null ? String(product.oz) : "",
        cm: product.cm !== undefined && product.cm !== null ? String(product.cm) : "",
        inch: product.inch !== undefined && product.inch !== null ? String(product.inch) : "",
        img: product.img,
        image1: product.image1,
        image2: product.image2,
        altimg1: product.altimg1 || "",
        altimg2: product.altimg2 || "",
        altimg3: product.altimg3 || "",
        video: product.video,
        altvideo: product.altvideo || "",
        purchasePrice: product.purchasePrice !== undefined ? String(product.purchasePrice) : "",
        salesPrice: product.salesPrice !== undefined ? String(product.salesPrice) : "",
        vendorFabricCode: product.vendorFabricCode || "",
        productIdentifier: product.productIdentifier || "",
        leadtime: leadtime,
        sku: product.sku || "",
        popularproduct: product.popularproduct || false,
        topratedproduct: product.topratedproduct || false,
        landingPageProduct: product.landingPageProduct || false,
        shopyProduct: product.shopyProduct || false,
        rating_value: product.rating_value || "",
        rating_count: product.rating_count || "",
        productlocationtitle: product.productlocationtitle || "",
        productlocationtagline: product.productlocationtagline || "",
        productlocationdescription1: product.productlocationdescription1 || "",
        productlocationdescription2: product.productlocationdescription2 || "",
        ogType: product.ogType || "",
        twitterCard: product.twitterCard || "summary_large_image",
        ogImage_twitterimage: product.ogImage_twitterimage || ""
      };

      console.log('Form data to be set:', formData); // Debug log
      setForm(formData);
      setEditId(product._id || null);
      setImagePreview(getSafeImageUrl(product.img));
      setImage1Preview(getSafeImageUrl(product.image1));
      setImage2Preview(getSafeImageUrl(product.image2));
      setVideoPreview(getSafeImageUrl(product.video));
    } else {
      setForm({
        name: "",
        category: "",
        substructure: "",
        content: "",
        design: "",
        subfinish: "",
        subsuitable: [],
        vendor: "",
        groupcode: "",
        colors: [],
        motif: "",
        um: "",
        currency: "",
        gsm: "",
        oz: "",
        cm: "",
        inch: "",
        img: undefined,
        image1: undefined,
        image2: undefined,
        video: undefined,
      });
      setEditId(null);
      setImagePreview(null);
      setImage1Preview(null);
      setImage2Preview(null);
      setVideoPreview(null);
      setEditableSubsuitableItems([]);
    }
    setOpen(true);
  }, [setForm, setEditId, setImagePreview, setImage1Preview, setImage2Preview, setVideoPreview, setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditId(null);
    setImagePreview(null);
    setImage1Preview(null);
    setImage2Preview(null);
    setVideoPreview(null);
    setSubsuitableInput({ gender: '', clothType: '', number: '' });
    setEditableSubsuitableItems([]);
    setForm({
      name: "",
      category: "",
      substructure: "",
      content: "",
      design: "",
      subfinish: "",
      subsuitable: [],
      vendor: "",
      groupcode: "",
      colors: [],
      motif: "",
      um: "",
      currency: "",
      gsm: "",
      oz: "",
      cm: "",
      inch: "",
      img: undefined,
      image1: undefined,
      image2: undefined,
      altimg1: "",
      altimg2: "",
      altimg3: "",
      video: undefined,
      altvideo: "",
    });
  }, []);

  const handleAdd = useCallback(() => {
    setEditingProduct(null);
    handleOpen(); // Use the existing handleOpen function
  }, [handleOpen]);

  const handleEdit = useCallback((product: Product) => {
    handleOpen(product); // Use the existing handleOpen function with product
  }, [handleOpen]);

  const handleView = useCallback(async (product: Product) => {
    try {
      // Fetch the full product details to ensure we have all related data
      const res = await apiFetch(`${API_URL}/product/${product._id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedProduct(data.data);
      } else {
        // Fallback to the original product data if the fetch fails
        setSelectedProduct(product);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setSelectedProduct(product);
    }
    setViewOpen(true);
  }, []);

  const handleSaveFromView = useCallback(async (updatedProduct: Product) => {
    try {
      const formData = new FormData();

      // Append all fields
      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (key === 'color' && Array.isArray(value)) {
          value.forEach(v => formData.append('color[]', v));
        } else if (key === 'subsuitable' && Array.isArray(value)) {
          // Handle subsuitable array - split comma-separated string and send each item
          if (value.length > 0) {
            // If it's a single element with comma-separated values, split it
            const items = value[0] && typeof value[0] === 'string' && value[0].includes(',')
              ? value[0].split(',').map(s => s.trim())
              : value;
            items.forEach(v => formData.append('subsuitable[]', v));
          }
        } else if (key === 'leadtime' && Array.isArray(value)) {
          // Handle leadtime array - send each item separately
          value.forEach(v => formData.append('leadtime[]', v));
        } else if (key === 'productTag' && Array.isArray(value)) {
          // Handle productTag array - send each item separately
          value.forEach(v => formData.append('productTag[]', v));
        } else if (Array.isArray(value)) {
          // Handle any other arrays by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await apiFetch(`${API_URL}/product/${updatedProduct._id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        fetchProducts();
        setSelectedProduct(updatedProduct);
        alert('Product updated successfully!');
      } else {
        const error = await res.json();
        console.error("Error:", error);
        alert(error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the product");
    }
  }, [fetchProducts]);

  const handleViewClose = useCallback(() => {
    setViewOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleDeleteImage = useCallback(async (imageType: 'img' | 'image1' | 'image2') => {
    try {
      // If this is an existing image (not a new upload), delete it from the server
      if (form[imageType] && typeof form[imageType] === 'string' && editId) {
        const imageUrl = form[imageType] as string;
        // Extract the image filename from the URL
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await apiFetch(`${API_URL}/product/image/${editId}/${imagePath}`, {
            method: 'DELETE'
          });
        }
      }

      // Update the form state
      setForm(prev => ({
        ...prev,
        [imageType]: undefined
      }));

      // Clear the preview and dimensions
      if (imageType === 'img') {
        setImagePreview(null);
        setFormImgDims(dims => ({ ...dims, img: undefined }));
      }
      if (imageType === 'image1') {
        setImage1Preview(null);
        setFormImgDims(dims => ({ ...dims, image1: undefined }));
      }
      if (imageType === 'image2') {
        setImage2Preview(null);
        setFormImgDims(dims => ({ ...dims, image2: undefined }));
      }

      // Reset the file input
      if (imageType === 'img' && fileInputRef.current) fileInputRef.current.value = '';
      if (imageType === 'image1' && image1InputRef.current) image1InputRef.current.value = '';
      if (imageType === 'image2' && image2InputRef.current) image2InputRef.current.value = '';

    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  }, [form, editId]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, img: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImage1Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image1: file }));
      setImage1Preview(URL.createObjectURL(file));
    }
  }, []);

  const handleImage2Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image2: file }));
      setImage2Preview(URL.createObjectURL(file));
    }
  }, []);

  // Handler for adding subsuitable item
  const handleAddSubsuitable = useCallback(() => {
    const { gender, clothType, number } = subsuitableInput;

    // Validate inputs
    if (!gender || !clothType || !number) {
      alert('Please fill in all fields: Gender, Type of Cloth, and Number');
      return;
    }

    // Add to editableSubsuitableItems array
    setEditableSubsuitableItems(prev => [
      ...prev,
      { gender, clothType, number }
    ]);

    // Clear inputs
    setSubsuitableInput({ gender: '', clothType: '', number: '' });
  }, [subsuitableInput]);

  // Handler for removing subsuitable item
  const handleRemoveSubsuitable = useCallback((index: number) => {
    setEditableSubsuitableItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handler for updating a specific subsuitable item field
  const handleUpdateSubsuitableItem = useCallback((index: number, field: 'gender' | 'clothType' | 'number', value: string) => {
    setEditableSubsuitableItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Sync editableSubsuitableItems to form.subsuitable whenever editableSubsuitableItems changes
  useEffect(() => {
    if (editableSubsuitableItems.length === 0) {
      setForm(prev => ({
        ...prev,
        subsuitable: []
      }));
      return;
    }

    // Concatenate all items with hyphen, then join all with comma into a single string
    const concatenatedString = editableSubsuitableItems
      .map(item => `${item.gender}-${item.clothType}-${item.number}`)
      .join(',');

    setForm(prev => ({
      ...prev,
      subsuitable: [concatenatedString] // Store as single element array with comma-separated string
    }));
  }, [editableSubsuitableItems]);

  // Function to generate a URL-friendly slug from a string
  const generateSlug = (str: string): string => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
      .replace(/^\-+/, '')      // Trim - from start of text
      .replace(/\-+$/, '');     // Trim - from end of text
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const formData = new FormData();

      // Process form data
      const processedForm = { ...form };

      // Auto-generate slug from name if slug is empty
      if (!processedForm.slug && processedForm.name) {
        processedForm.slug = generateSlug(processedForm.name);
      }

      // Track which images were explicitly removed
      const deletedImages = {
        img: processedForm.img === undefined && form.img !== undefined,
        image1: processedForm.image1 === undefined && form.image1 !== undefined,
        image2: processedForm.image2 === undefined && form.image2 !== undefined
      };

      // Append all form fields that have values
      Object.entries(processedForm).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          // If this is an image field that was explicitly set to undefined, mark it for deletion
          if ((key === 'img' || key === 'image1' || key === 'image2') && deletedImages[key as keyof typeof deletedImages]) {
            formData.append(`delete_${key}`, 'true');
          }
          return;
        }

        // Handle File uploads first
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key === 'colors' && Array.isArray(value)) {
          // Handle colors array
          value.forEach(v => formData.append('color[]', v));
        } else if (key === 'subsuitable' && Array.isArray(value)) {
          // Handle subsuitable array - split comma-separated string and send each item
          if (value.length > 0) {
            // If it's a single element with comma-separated values, split it
            const items = value[0] && typeof value[0] === 'string' && value[0].includes(',')
              ? value[0].split(',').map(s => s.trim())
              : value;
            items.forEach(v => formData.append('subsuitable[]', v));
          }
        } else if (key === 'leadtime' && Array.isArray(value)) {
          // Handle leadtime array - send each item separately
          value.forEach(v => formData.append('leadtime[]', v));
        } else if (key === 'productTag' && Array.isArray(value)) {
          // Handle productTag array - send each item separately
          value.forEach(v => formData.append('productTag[]', v));
        } else if (Array.isArray(value)) {
          // Handle any other arrays by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key === 'img' || key === 'image1' || key === 'image2' || key === 'video') {
          // Only append image fields if they're string URLs
          if (typeof value === 'string' && value.startsWith('blob:')) {
            // Skip blob URLs (they're just for preview)
            return;
          } else if (typeof value === 'string' && value) {
            // If it's a non-empty string URL, include it as a string
            formData.append(key, value);
          }
        } else {
          // Handle all other fields
          // Convert values to string before appending
          let stringValue = String(value);

          // Ensure slug is properly formatted
          if (key === 'slug' && stringValue) {
            stringValue = generateSlug(stringValue);
          }

          formData.append(key, stringValue);
        }
      });

      const url = editId ? `${API_URL}/product/${editId}` : `${API_URL}/product`;
      const method = editId ? "PUT" : "POST";
      const res = await apiFetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        fetchProducts();
        handleClose();
      } else {
        const error = await res.json();
        console.error("Error:", error);
        alert(error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the product");
    } finally {
      setSubmitting(false);
    }
  }, [form, editId, fetchProducts, handleClose]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      const res = await apiFetch(`${API_URL}/product/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
        setDeleteId(null);
      } else {
        const error = await res.json();
        console.error("Error:", error);
        alert(error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the product");
    }
  }, [deleteId, fetchProducts]);



  // Define the shape of a color object
  interface ColorObject {
    _id: string;
    name?: string;
    // Add other color properties if they exist
  }

  const handleProductSelect = useCallback((
    _: React.SyntheticEvent,
    value: { label?: string; value?: string } | null
  ) => {
    if (!value) return;
    const selected = products.find(p => p._id === value.value);
    if (selected) {
      // Handle colors - ensure we always have an array of color IDs
      let colors: string[] = [];
      if (selected.color) {
        if (Array.isArray(selected.color)) {
          colors = selected.color.map(c =>
            typeof c === 'string' ? c : (c && '_id' in c ? (c as ColorObject)._id : '')
          ).filter(Boolean) as string[];
        } else if (typeof selected.color === 'string') {
          colors = [selected.color];
        } else if (selected.color && '_id' in selected.color) {
          colors = [(selected.color as ColorObject)._id];
        }
      }

      // Handle subsuitable
      let subsuitable: string[] = [];
      if (selected.subsuitable) {
        if (Array.isArray(selected.subsuitable)) {
          subsuitable = selected.subsuitable.filter(Boolean) as string[];
        }
      }

      // Handle leadtime
      let leadtime: string[] = [];
      if (selected.leadtime) {
        if (Array.isArray(selected.leadtime)) {
          leadtime = selected.leadtime.filter(Boolean) as string[];
        }
      }

      setForm({
        name: selected.name,
        slug: selected.slug || '',
        productdescription: selected.productdescription || '',
        category: getId(selected.category),
        substructure: getId(selected.substructure),
        content: getId(selected.content),
        design: getId(selected.design),
        subfinish: getId(selected.subfinish),
        subsuitable: subsuitable,
        vendor: getId(selected.vendor),
        groupcode: getId(selected.groupcode),
        colors: colors,
        motif: getId(selected.motif),
        um: getId(selected.um),
        currency: getId(selected.currency),
        gsm: selected.gsm !== undefined && selected.gsm !== null ? String(selected.gsm) : "",
        oz: selected.oz !== undefined && selected.oz !== null ? String(selected.oz) : "",
        cm: selected.cm !== undefined && selected.cm !== null ? String(selected.cm) : "",
        inch: selected.inch !== undefined && selected.inch !== null ? String(selected.inch) : "",
        img: selected.img,
        image1: selected.image1,
        image2: selected.image2,
        altimg1: selected.altimg1 || "",
        altimg2: selected.altimg2 || "",
        altimg3: selected.altimg3 || "",
        video: selected.video,
        altvideo: selected.altvideo || "",
        purchasePrice: selected.purchasePrice !== undefined ? String(selected.purchasePrice) : "",
        salesPrice: selected.salesPrice !== undefined ? String(selected.salesPrice) : "",
        vendorFabricCode: selected.vendorFabricCode || "",
        productIdentifier: selected.productIdentifier || "",
        leadtime: leadtime,
        sku: selected.sku || "",
        popularproduct: selected.popularproduct || false,
        topratedproduct: selected.topratedproduct || false,
        landingPageProduct: selected.landingPageProduct || false,
        shopyProduct: selected.shopyProduct || false,
        rating_value: selected.rating_value || "",
        rating_count: selected.rating_count || "",
        productlocationtitle: selected.productlocationtitle || "",
        productlocationtagline: selected.productlocationtagline || "",
        productlocationdescription1: selected.productlocationdescription1 || "",
        productlocationdescription2: selected.productlocationdescription2 || "",
        ogType: selected.ogType || "",
        twitterCard: selected.twitterCard || "summary_large_image",
        ogImage_twitterimage: selected.ogImage_twitterimage || ""
      });
      setImagePreview(selected.img ? getImageUrl(selected.img) || null : null);
      setImage1Preview(selected.image1 ? getImageUrl(selected.image1) || null : null);
      setImage2Preview(selected.image2 ? getImageUrl(selected.image2) || null : null);
      setVideoPreview(selected.video ? getImageUrl(selected.video) || null : null);
    } else {
      setForm(prev => ({ ...prev, name: value.label || "" }));
    }
  }, [products, getId, setForm, setImagePreview, setImage1Preview, setImage2Preview, setVideoPreview]);

  // Add effect to auto-calculate oz and inch
  // Only auto-calculate oz if oz is empty (not set from backend or user input)
  useEffect(() => {
    if (form.gsm && !isNaN(Number(form.gsm)) && (!form.oz || form.oz === "")) {
      const oz = (Number(form.gsm) / 33.906).toFixed(2);
      setForm(prev => ({ ...prev, oz }));
    }
  }, [form.gsm, form.oz]);

  // Only auto-calculate inch if inch is empty (not set from backend or user input)
  useEffect(() => {
    if (form.cm && !isNaN(Number(form.cm)) && (!form.inch || form.inch === "")) {
      const inch = (Number(form.cm) / 2.54).toFixed(2);
      setForm(prev => ({ ...prev, inch }));
    }
  }, [form.cm, form.inch]);

  if (pageAccess === 'no access') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#e74c3c', mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
          You don&apos;t have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {pageAccess === 'only view' && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 2 }}>
            <Typography color="#ad6800" fontWeight={600}>
              You have view-only access. To make changes, contact your admin.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          🛍️ Product Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product catalog with advanced filtering and sorting
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
        <Chip label={`Popular: ${stats.popular}`} color="success" />
        <Chip label={`Top Rated: ${stats.topRated}`} color="info" />
        <Chip label={`Landing Page: ${stats.landingPage}`} color="warning" />
        <Chip label={`With Price: ${stats.withPrice}`} color="secondary" />
      </Box>

      {/* Bulk Actions */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportSelected}
          disabled={selectedProducts.length === 0 || pageAccess === 'only view'}
        >
          Export Selected ({selectedProducts.length})
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={pageAccess === 'only view'}
        >
          Add New Product
        </Button>
      </Box>

      {/* Data Table */}
      {productsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={products}
          selectable
          onSelectionChange={setSelectedProducts}
          onEdit={pageAccess === 'only view' ? undefined : handleEdit}
          onDelete={pageAccess === 'only view' ? undefined : handleDeleteProduct}
          onView={handleView}
          enableColumnFilters
          enableColumnManagement
          rowsPerPage={15}
          searchPlaceholder="Search by name, slug, SKU, category..."
          storageKey="products-table"
        />
      )}

      {/* Add/Edit Product Dialog */}
      <ProductFormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editId={editId}
        submitting={submitting}
        products={products}
        dropdowns={dropdowns}
        refreshDropdown={refreshDropdown}
        handleProductSelect={handleProductSelect}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        image1Preview={image1Preview}
        setImage1Preview={setImage1Preview}
        image2Preview={image2Preview}
        setImage2Preview={setImage2Preview}
        videoPreview={videoPreview}
        setVideoPreview={setVideoPreview}
        handleImageChange={handleImageChange}
        handleImage1Change={handleImage1Change}
        handleImage2Change={handleImage2Change}
        handleDeleteImage={handleDeleteImage}
        fileInputRef={fileInputRef}
        image1InputRef={image1InputRef}
        image2InputRef={image2InputRef}
        videoInputRef={videoInputRef}
        formImgDims={formImgDims}
        setFormImgDims={setFormImgDims}
        formVideoDims={formVideoDims}
        setFormVideoDims={setFormVideoDims}
        pageAccess={pageAccess}
        umOptions={umOptions}
        currencyOptions={currencyOptions}
        subsuitableInput={subsuitableInput}
        setSubsuitableInput={setSubsuitableInput}
        editableSubsuitableItems={editableSubsuitableItems}
        handleAddSubsuitable={handleAddSubsuitable}
        handleRemoveSubsuitable={handleRemoveSubsuitable}
        handleUpdateSubsuitableItem={handleUpdateSubsuitableItem}
      />

      {/* View Product Dialog with Inline Editing */}
      <ProductViewDialog
        open={viewOpen}
        onClose={handleViewClose}
        product={selectedProduct}
        onSave={handleSaveFromView}
        getImageUrl={getImageUrl}
        pageAccess={pageAccess}
        dropdowns={dropdowns}
      />

      {/* Old dialog removed - using new ProductFormDialog and ProductViewDialog components above */}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => { setDeleteId(null); setDeleteError(null); }}>
        <DialogTitle sx={{ fontWeight: 600, color: '#2c3e50' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Typography sx={{ color: 'error.main', mt: 2 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteId(null); setDeleteError(null); }} sx={{ color: '#7f8c8d' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              bgcolor: '#e74c3c',
              '&:hover': { bgcolor: '#c0392b' },
              borderRadius: '8px'
            }}
            disabled={pageAccess === 'only view'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
