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
import { FilterConfig } from '@/components/GenericFilterPage/types';
import { Avatar } from '@mui/material';

const getImageUrl = (img: string | undefined): string | undefined => {
  if (!img) return undefined;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${process.env.NEXT_PUBLIC_API_URL}/images/${img}`;
};

// 1. Category - name, image, altimg
export const categoryConfig: FilterConfig = {
  name: 'Category',
  namePlural: 'Categories',
  apiEndpoint: '/category',
  icon: <Avatar sx={{ bgcolor: '#7367f0', width: 40, height: 40 }}><CategoryIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'image', label: 'Category Image', type: 'image', helperText: 'Recommended: 800x800px' },
    { name: 'altimg', label: 'Alt Text', type: 'text', helperText: 'Image description for SEO' },
  ],
  columns: [
    { id: 'image', label: 'Image', type: 'image', minWidth: 60 },
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'altimg', label: 'Alt Text', sortable: true, filterable: true, format: (value) => value || '-' },
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: true, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.categories || items || [],
};

// 2. Color - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.colors || items || [],
};

// 3. Content - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.contents || items || [],
};

// 4. Design - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.designs || items || [],
};

// 5. Finish - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.finishes || items || [],
};

// 6. Subfinish - name, finish (ref)
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.subfinishes || items || [],
};

// 7. Structure - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.structures || items || [],
};

// 8. Substructure - name, structure (ref)
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.substructures || items || [],
};

// 9. Suitablefor - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.suitablefors || items || [],
};

// 10. Subsuitable - name, suitablefor (ref array)
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
    { id: 'suitablefor', label: 'Suitable For', sortable: true, format: (value) => Array.isArray(value) ? value.map((v: any) => v.name || v).join(', ') : '-' },
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.subsuitables || items || [],
};

// 11. Vendor - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.vendors || items || [],
};

// 12. Groupcode - name, img, altimg, video, altvideo
export const groupcodeConfig: FilterConfig = {
  name: 'Group Code',
  namePlural: 'Group Codes',
  apiEndpoint: '/groupcode',
  icon: <Avatar sx={{ bgcolor: '#feca57', width: 40, height: 40 }}><CodeIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'Group Code Name', type: 'text', required: true },
    { name: 'img', label: 'Image', type: 'image', helperText: 'Group code image' },
    { name: 'altimg', label: 'Alt Text for Image', type: 'text' },
    { name: 'video', label: 'Video URL', type: 'text', helperText: 'Video file path or URL' },
    { name: 'altvideo', label: 'Alt Text for Video', type: 'text' },
  ],
  columns: [
    { id: 'img', label: 'Image', type: 'image', minWidth: 60 },
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'video', label: 'Has Video', format: (value) => value ? '✅' : '-' },
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: true, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.groupcodes || items || [],
};

// 13. Motif - name only
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
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.motifs || items || [],
};

// 14. Country - name, slug, code, longitude, latitude
export const countryConfig: FilterConfig = {
  name: 'Country',
  namePlural: 'Countries',
  apiEndpoint: '/countries',
  icon: <Avatar sx={{ bgcolor: '#28c76f', width: 40, height: 40 }}><PublicIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'Country Name', type: 'text', required: true },
    { name: 'code', label: 'Country Code', type: 'text', placeholder: 'e.g., US, IN, AU' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly name' },
    { name: 'longitude', label: 'Longitude', type: 'number', placeholder: 'e.g., -106.346800' },
    { name: 'latitude', label: 'Latitude', type: 'number', placeholder: 'e.g., 56.130400' },
  ],
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'code', label: 'Code', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'longitude', label: 'Longitude', sortable: true },
    { id: 'latitude', label: 'Latitude', sortable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.countries || items || [],
};

// 15. State - name, slug, code, country, longitude, latitude
export const stateConfig: FilterConfig = {
  name: 'State',
  namePlural: 'States',
  apiEndpoint: '/states',
  icon: <Avatar sx={{ bgcolor: '#ff9f43', width: 40, height: 40 }}><MapIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'State Name', type: 'text', required: true },
    { name: 'code', label: 'State Code', type: 'text', placeholder: 'e.g., CA, TX, NY' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly name' },
    { name: 'longitude', label: 'Longitude', type: 'number' },
    { name: 'latitude', label: 'Latitude', type: 'number' },
  ],
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'code', label: 'Code', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'country', label: 'Country', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'longitude', label: 'Longitude', sortable: true },
    { id: 'latitude', label: 'Latitude', sortable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.states || items || [],
};

// 16. City - name, slug, country, state, longitude, latitude
export const cityConfig: FilterConfig = {
  name: 'City',
  namePlural: 'Cities',
  apiEndpoint: '/cities',
  icon: <Avatar sx={{ bgcolor: '#9c8cfc', width: 40, height: 40 }}><LocationCityIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'City Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly name' },
    { name: 'longitude', label: 'Longitude', type: 'number' },
    { name: 'latitude', label: 'Latitude', type: 'number' },
  ],
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'state', label: 'State', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'country', label: 'Country', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'longitude', label: 'Longitude', sortable: true },
    { id: 'latitude', label: 'Latitude', sortable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.cities || items || [],
};

// 17. Location - name, slug, pincode, country, state, city, language, longitude, latitude
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
    { id: 'city', label: 'City', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'state', label: 'State', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'country', label: 'Country', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'language', label: 'Language', sortable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.locations || items || [],
};

// 18. LocationDetail - name, slug, country, state, city, pincode, longitude, latitude
export const locationDetailsConfig: FilterConfig = {
  name: 'Location Detail',
  namePlural: 'Location Details',
  apiEndpoint: '/location-details',
  icon: <Avatar sx={{ bgcolor: '#00cfe8', width: 40, height: 40 }}><PlaceIcon /></Avatar>,
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'URL-friendly name' },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'longitude', label: 'Longitude', type: 'number' },
    { name: 'latitude', label: 'Latitude', type: 'number' },
  ],
  columns: [
    { id: 'name', label: 'Name', sortable: true, filterable: true },
    { id: 'slug', label: 'Slug', sortable: true, filterable: true },
    { id: 'pincode', label: 'Pincode', sortable: true, filterable: true },
    { id: 'city', label: 'City', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'state', label: 'State', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'country', label: 'Country', sortable: true, filterable: true, format: (value) => value?.name || '-' },
    { id: 'longitude', label: 'Longitude', sortable: true },
    { id: 'latitude', label: 'Latitude', sortable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.locationDetails || items || [],
};

// 19. OfficeInformation - ALL fields from schema
export const officeInformationConfig: FilterConfig = {
  name: 'Office Information',
  namePlural: 'Office Information',
  apiEndpoint: '/officeinformation',
  icon: <Avatar sx={{ bgcolor: '#6c5ce7', width: 40, height: 40 }}><InfoIcon /></Avatar>,
  fields: [
    { name: 'companyName', label: 'Company Name', type: 'text', required: true },
    { name: 'companyPhone1', label: 'Phone 1', type: 'text', required: true },
    { name: 'companyPhone2', label: 'Phone 2', type: 'text', required: true },
    { name: 'companyEmail', label: 'Email', type: 'email', required: true },
    { name: 'companyAddress', label: 'Address', type: 'textarea', rows: 3, required: true },
    { name: 'companyLanguages', label: 'Languages', type: 'textarea', rows: 2, required: true, helperText: 'Comma-separated values (e.g., English, Spanish)' },
    { name: 'companyFoundingDate', label: 'Founding Date', type: 'text', required: true },
    { name: 'companyEmployeeRange', label: 'Employee Range', type: 'text', required: true },
    { name: 'companyAwards', label: 'Awards', type: 'textarea', rows: 2, required: true },
    { name: 'whatsappNumber', label: 'WhatsApp Number', type: 'text', required: true },
    { name: 'n8nApiKey', label: 'N8N API Key', type: 'text', required: true },
    { name: 'n8nAuthHeader', label: 'N8N Auth Header', type: 'text', required: true },
    { name: 'n8nAuthScheme', label: 'N8N Auth Scheme', type: 'text', required: true, helperText: 'Bearer or Basic' },
    { name: 'facebook', label: 'Facebook URL', type: 'url' },
    { name: 'instagram', label: 'Instagram URL', type: 'url' },
    { name: 'youtube', label: 'YouTube URL', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { name: 'twitter', label: 'Twitter URL', type: 'url' },
  ],
  columns: [
    { id: 'companyName', label: 'Company Name', sortable: true, filterable: true },
    { id: 'companyPhone1', label: 'Phone 1', sortable: true, filterable: true },
    { id: 'companyPhone2', label: 'Phone 2', sortable: true, filterable: true },
    { id: 'companyEmail', label: 'Email', sortable: true, filterable: true },
    { id: 'companyLanguages', label: 'Languages', sortable: true, format: (value) => Array.isArray(value) ? value.join(', ') : value || '-' },
    { id: 'whatsappNumber', label: 'WhatsApp', sortable: true, filterable: true },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.officeInformation || items || [],
};

// 20. AboutUs - descriptionsmall, descriptionmedium, descriptionlarger
export const aboutUsConfig: FilterConfig = {
  name: 'About Us',
  namePlural: 'About Us',
  apiEndpoint: '/aboutus',
  icon: <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}><InfoIcon /></Avatar>,
  fields: [
    { name: 'descriptionsmall', label: 'Small Description', type: 'textarea', rows: 3, required: true },
    { name: 'descriptionmedium', label: 'Medium Description', type: 'textarea', rows: 5, required: true },
    { name: 'descriptionlarger', label: 'Large Description', type: 'textarea', rows: 8, required: true },
  ],
  columns: [
    { id: 'descriptionsmall', label: 'Small Description', sortable: true, filterable: true, format: (value) => value ? value.substring(0, 50) + '...' : '-' },
    { id: 'descriptionmedium', label: 'Medium Description', sortable: true, filterable: true, format: (value) => value ? value.substring(0, 50) + '...' : '-' },
    { id: 'descriptionlarger', label: 'Large Description', sortable: true, filterable: true, format: (value) => value ? value.substring(0, 50) + '...' : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => {
    // Handle the specific API response format: { data: { aboutUs: [...] } }
    if (items?.aboutUs && Array.isArray(items.aboutUs)) {
      return items.aboutUs;
    }
    // Handle if it's already an array
    if (Array.isArray(items)) {
      return items;
    }
    // Handle other nested formats
    if (items?.data?.aboutUs && Array.isArray(items.data.aboutUs)) {
      return items.data.aboutUs;
    }
    if (items?.data && Array.isArray(items.data)) {
      return items.data;
    }
    // If it's a single object, wrap it in an array
    if (items && typeof items === 'object') {
      return [items];
    }
    return [];
  },
};

// 21. Blog - title, author, heading, paragraph1-3, blogimage1-2, altimage1-2
export const blogConfig: FilterConfig = {
  name: 'Blog',
  namePlural: 'Blogs',
  apiEndpoint: '/blogs',
  icon: <Avatar sx={{ bgcolor: '#6c5ce7', width: 40, height: 40 }}><RssFeedIcon /></Avatar>,
  fields: [
    { name: 'title', label: 'Blog Title', type: 'text' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'heading', label: 'Heading', type: 'text' },
    { name: 'paragraph1', label: 'Paragraph 1', type: 'textarea', rows: 4 },
    { name: 'paragraph2', label: 'Paragraph 2', type: 'textarea', rows: 4 },
    { name: 'paragraph3', label: 'Paragraph 3', type: 'textarea', rows: 4 },
    { name: 'blogimage1', label: 'Blog Image 1', type: 'image' },
    { name: 'altimage1', label: 'Alt Text for Image 1', type: 'text' },
    { name: 'blogimage2', label: 'Blog Image 2', type: 'image' },
    { name: 'altimage2', label: 'Alt Text for Image 2', type: 'text' },
  ],
  columns: [
    { id: 'blogimage1', label: 'Image 1', type: 'image', minWidth: 60 },
    { id: 'title', label: 'Title', sortable: true, filterable: true },
    { id: 'author', label: 'Author', sortable: true, filterable: true },
    { id: 'heading', label: 'Heading', sortable: true, filterable: true },
    { id: 'createdAt', label: 'Created', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: true, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.blogs || items || [],
};

// 22. User (Shofy Users) - ALL fields from User model
export const shofyUsersConfig: FilterConfig = {
  name: 'Shofy User',
  namePlural: 'Shofy Users',
  apiEndpoint: '/users',
  icon: <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}><PeopleIcon /></Avatar>,
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password', helperText: 'Min 6 characters (leave empty to keep current)' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'organisation', label: 'Organisation', type: 'text' },
    { name: 'companytaxid', label: 'Company Tax ID', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea', rows: 2 },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'userImage', label: 'User Image', type: 'image', helperText: 'Profile picture' },
    { name: 'invalidUser', label: 'Invalid User', type: 'text', helperText: 'yes or no' },
  ],
  columns: [
    { id: 'userImage', label: 'Image', type: 'image', minWidth: 50 },
    { id: 'firstName', label: 'First Name', sortable: true, filterable: true },
    { id: 'lastName', label: 'Last Name', sortable: true, filterable: true },
    { id: 'email', label: 'Email', sortable: true, filterable: true },
    { id: 'phone', label: 'Phone', sortable: true, filterable: true },
    { id: 'organisation', label: 'Organisation', sortable: true, filterable: true },
    { id: 'invalidUser', label: 'Status', sortable: true, filterable: true, format: (value) => value === 'yes' ? '❌ Invalid' : '✅ Valid' },
    { id: 'createdAt', label: 'Registered', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: true, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.users || items || [],
};

// 23. Contact - ALL fields from schema
export const contactConfig: FilterConfig = {
  name: 'Contact',
  namePlural: 'Contacts',
  apiEndpoint: '/contacts',
  icon: <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}><ContactMailIcon /></Avatar>,
  fields: [
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { name: 'businessType', label: 'Business Type', type: 'text' },
    { name: 'annualFabricVolume', label: 'Annual Fabric Volume', type: 'text' },
    { name: 'primaryMarkets', label: 'Primary Markets', type: 'text' },
    { name: 'fabricTypesOfInterest', label: 'Fabric Types of Interest', type: 'textarea', rows: 2, helperText: 'Comma-separated values' },
    { name: 'specificationsRequirements', label: 'Specifications/Requirements', type: 'textarea', rows: 3 },
    { name: 'timeline', label: 'Timeline', type: 'text' },
    { name: 'additionalMessage', label: 'Additional Message', type: 'textarea', rows: 4 },
  ],
  columns: [
    { id: 'companyName', label: 'Company', sortable: true, filterable: true },
    { id: 'contactPerson', label: 'Contact Person', sortable: true, filterable: true },
    { id: 'email', label: 'Email', sortable: true, filterable: true },
    { id: 'phoneNumber', label: 'Phone', sortable: true, filterable: true },
    { id: 'businessType', label: 'Business Type', sortable: true, filterable: true },
    { id: 'createdAt', label: 'Submitted', sortable: true, format: (value) => value ? new Date(value).toLocaleDateString() : '-' },
  ],
  features: { hasImage: false, hasAdd: true, hasEdit: true, hasDelete: true, hasExport: true, hasSearch: true },
  transformData: (items) => items.contacts || items || [],
};
