import React from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import BrushIcon from '@mui/icons-material/Brush';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CodeIcon from '@mui/icons-material/Code';
import StyleIcon from '@mui/icons-material/Style';
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PeopleIcon from '@mui/icons-material/People';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { FilterConfig } from '@/components/GenericFilterPage/types';
import { Avatar, Chip, Box } from '@mui/material';

// Helper function to get image URL
const getImageUrl = (img: string | undefined): string | undefined => {
  if (!img) return undefined;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${process.env.NEXT_PUBLIC_API_URL}/images/${img}`;
};

// 1. Category Configuration
export const categoryConfig: FilterConfig = {
  name: 'Category',
  namePlural: 'Categories',
  apiEndpoint: '/category',
  icon: <Avatar sx={{ bgcolor: '#7367f0', width: 40, height: 40 }}><CategoryIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'image', label: 'Category Image', type: 'image', helperText: 'Recommended: 800x800px, PNG/JPG' },
    { name: 'altimg', label: 'Alt Text (For SEO)', type: 'text', helperText: 'Describe the image for search engines' },
  ],
  
  columns: [
    { id: 'image', label: 'Image', type: 'image', minWidth: 80, format: (value, row) => row.image ? getImageUrl(row.image) : undefined },
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'altimg', label: 'Alt Text', sortable: true, filterable: true, format: (value) => value || '-' },
  ],
  
  features: { hasImage: true, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 2. Color Configuration
export const colorConfig: FilterConfig = {
  name: 'Color',
  namePlural: 'Colors',
  apiEndpoint: '/color',
  icon: <Avatar sx={{ bgcolor: '#ff6b6b', width: 40, height: 40 }}><PaletteIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Color Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Color Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 3. Content Configuration
export const contentConfig: FilterConfig = {
  name: 'Content',
  namePlural: 'Contents',
  apiEndpoint: '/content',
  icon: <Avatar sx={{ bgcolor: '#4ecdc4', width: 40, height: 40 }}><ArticleIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Content Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Content Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 4. Design Configuration
export const designConfig: FilterConfig = {
  name: 'Design',
  namePlural: 'Designs',
  apiEndpoint: '/design',
  icon: <Avatar sx={{ bgcolor: '#45b7d1', width: 40, height: 40 }}><BrushIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Design Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Design Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 5. Finish Configuration
export const finishConfig: FilterConfig = {
  name: 'Finish',
  namePlural: 'Finishes',
  apiEndpoint: '/finish',
  icon: <Avatar sx={{ bgcolor: '#96ceb4', width: 40, height: 40 }}><StyleIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Finish Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Finish Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 6. Subfinish Configuration
export const subfinishConfig: FilterConfig = {
  name: 'Subfinish',
  namePlural: 'Subfinishes',
  apiEndpoint: '/subfinish',
  icon: <Avatar sx={{ bgcolor: '#5f27cd', width: 40, height: 40 }}><StyleIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Subfinish Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Subfinish Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 7. Structure Configuration
export const structureConfig: FilterConfig = {
  name: 'Structure',
  namePlural: 'Structures',
  apiEndpoint: '/structure',
  icon: <Avatar sx={{ bgcolor: '#ff9ff3', width: 40, height: 40 }}><AccountTreeIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Structure Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Structure Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 8. Substructure Configuration
export const substructureConfig: FilterConfig = {
  name: 'Substructure',
  namePlural: 'Substructures',
  apiEndpoint: '/substructure',
  icon: <Avatar sx={{ bgcolor: '#1dd1a1', width: 40, height: 40 }}><AccountTreeIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Substructure Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Substructure Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 9. Suitablefor Configuration
export const suitableforConfig: FilterConfig = {
  name: 'Suitable For',
  namePlural: 'Suitable For',
  apiEndpoint: '/suitablefor',
  icon: <Avatar sx={{ bgcolor: '#2e86de', width: 40, height: 40 }}><CheckBoxIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Suitable For Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Suitable For Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 10. Subsuitable Configuration
export const subsuitableConfig: FilterConfig = {
  name: 'Subsuitable',
  namePlural: 'Subsuitables',
  apiEndpoint: '/subsuitable',
  icon: <Avatar sx={{ bgcolor: '#ff9f43', width: 40, height: 40 }}><CheckBoxIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Subsuitable Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Subsuitable Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 11. Vendor Configuration
export const vendorConfig: FilterConfig = {
  name: 'Vendor',
  namePlural: 'Vendors',
  apiEndpoint: '/vendor',
  icon: <Avatar sx={{ bgcolor: '#ea5455', width: 40, height: 40 }}><BusinessIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Vendor Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Vendor Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 12. Groupcode Configuration
export const groupcodeConfig: FilterConfig = {
  name: 'Group Code',
  namePlural: 'Group Codes',
  apiEndpoint: '/groupcode',
  icon: <Avatar sx={{ bgcolor: '#feca57', width: 40, height: 40 }}><CodeIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Group Code Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Group Code Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 13. Motif Configuration
export const motifConfig: FilterConfig = {
  name: 'Motif',
  namePlural: 'Motifs',
  apiEndpoint: '/motif',
  icon: <Avatar sx={{ bgcolor: '#6c5ce7', width: 40, height: 40 }}><BrushIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Motif Name', type: 'text', required: true },
  ],
  
  columns: [
    { id: 'name', label: 'Motif Name', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 14. Country Configuration
export const countryConfig: FilterConfig = {
  name: 'Country',
  namePlural: 'Countries',
  apiEndpoint: '/countries',
  icon: <Avatar sx={{ bgcolor: '#28c76f', width: 40, height: 40 }}><PublicIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Country Name', type: 'text', required: true },
    { name: 'code', label: 'Country Code', type: 'text', required: false, placeholder: 'e.g., US, IN, AU' },
    { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: 'URL-friendly name' },
    { name: 'longitude', label: 'Longitude', type: 'number', required: false, placeholder: 'e.g., -106.346800' },
    { name: 'latitude', label: 'Latitude', type: 'number', required: false, placeholder: 'e.g., 56.130400' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'code', label: 'Code', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'longitude', label: 'Longitude', sortable: true, filterable: true },
    { id: 'latitude', label: 'Latitude', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  
  // Transform nested data structure
  transformData: (items) => {
    // API returns { countries: [...] }, extract the array
    return items.countries || items || [];
  },
};

// 15. State Configuration
export const stateConfig: FilterConfig = {
  name: 'State',
  namePlural: 'States',
  apiEndpoint: '/states',
  icon: <Avatar sx={{ bgcolor: '#ff9f43', width: 40, height: 40 }}><MapIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'State Name', type: 'text', required: true },
    { name: 'code', label: 'State Code', type: 'text', required: false, placeholder: 'e.g., CA, TX, NY' },
    { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: 'URL-friendly name' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'code', label: 'Code', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  
  // Transform nested data structure
  transformData: (items) => {
    // API returns { states: [...] }, extract the array
    return items.states || items || [];
  },
};

// 16. City Configuration
export const cityConfig: FilterConfig = {
  name: 'City',
  namePlural: 'Cities',
  apiEndpoint: '/cities',
  icon: <Avatar sx={{ bgcolor: '#9c8cfc', width: 40, height: 40 }}><LocationCityIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'City Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: 'URL-friendly name' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  
  // Transform nested data structure
  transformData: (items) => {
    // API returns { cities: [...] }, extract the array
    return items.cities || items || [];
  },
};

// 17. Location Configuration
export const locationConfig: FilterConfig = {
  name: 'Location',
  namePlural: 'Locations',
  apiEndpoint: '/locations',
  icon: <Avatar sx={{ bgcolor: '#00cfe8', width: 40, height: 40 }}><LocationOnIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Location Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly name' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g., en' },
    { name: 'longitude', label: 'Longitude', type: 'number' },
    { name: 'latitude', label: 'Latitude', type: 'number' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'pincode', label: 'Pincode', sortable: true, filterable: true },
    { id: 'language', label: 'Language', sortable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  
  transformData: (items) => {
    return items.locations || items || [];
  },
};

// 18. Location Details Configuration
export const locationDetailsConfig: FilterConfig = {
  name: 'Location Detail',
  namePlural: 'Location Details',
  apiEndpoint: '/location-details',
  icon: <Avatar sx={{ bgcolor: '#00cfe8', width: 40, height: 40 }}><PlaceIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'URL-friendly name' },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'longitude', label: 'Longitude', type: 'number', placeholder: 'e.g., -106.346800' },
    { name: 'latitude', label: 'Latitude', type: 'number', placeholder: 'e.g., 56.130400' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'pincode', label: 'Pincode', sortable: true, filterable: true },
    { id: 'longitude', label: 'Longitude', sortable: true },
    { id: 'latitude', label: 'Latitude', sortable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 19. Office Information Configuration
export const officeInformationConfig: FilterConfig = {
  name: 'Office Information',
  namePlural: 'Office Information',
  apiEndpoint: '/officeinformation',
  icon: <Avatar sx={{ bgcolor: '#6c5ce7', width: 40, height: 40 }}><InfoIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Office Name', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'textarea', rows: 3 },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ],
  
  columns: [
    { id: 'name', label: 'Office Name', sortable: true, filterable: true },
    { id: 'phone', label: 'Phone', sortable: true, filterable: true },
    { id: 'email', label: 'Email', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 20. About Us Configuration
export const aboutUsConfig: FilterConfig = {
  name: 'About Us',
  namePlural: 'About Us',
  apiEndpoint: '/aboutus',
  icon: <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}><InfoIcon /></Avatar>,
  
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', rows: 6 },
  ],
  
  columns: [
    { id: 'title', label: 'Title', sortable: true, filterable: true },
    { id: 'content', label: 'Content', sortable: true, filterable: true, format: (value) => value ? value.substring(0, 100) + '...' : '-' },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 21. Blog Configuration
export const blogConfig: FilterConfig = {
  name: 'Blog',
  namePlural: 'Blogs',
  apiEndpoint: '/blogs',
  icon: <Avatar sx={{ bgcolor: '#6c5ce7', width: 40, height: 40 }}><RssFeedIcon /></Avatar>,
  
  fields: [
    { name: 'title', label: 'Blog Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', rows: 6 },
    { name: 'author', label: 'Author', type: 'text' },
  ],
  
  columns: [
    { id: 'title', label: 'Title', sortable: true, filterable: true },
    { id: 'author', label: 'Author', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 22. Shofy Users Configuration
export const shofyUsersConfig: FilterConfig = {
  name: 'Shofy User',
  namePlural: 'Shofy Users',
  apiEndpoint: '/users',
  icon: <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}><PeopleIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'User Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'email', label: 'Email', sortable: true, filterable: true },
    { id: 'phone', label: 'Phone', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};

// 23. Contact Configuration
export const contactConfig: FilterConfig = {
  name: 'Contact',
  namePlural: 'Contacts',
  apiEndpoint: '/contacts',
  icon: <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}><ContactMailIcon /></Avatar>,
  
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea', rows: 4 },
  ],
  
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'email', label: 'Email', sortable: true, filterable: true },
    { id: 'phone', label: 'Phone', sortable: true, filterable: true },
  ],
  
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
};
