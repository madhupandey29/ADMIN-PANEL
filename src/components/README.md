# 🎨 Reusable Components Library

This folder contains production-ready, reusable React components built with Material-UI and TypeScript, following the DattaAble design system.

## 📦 Components

### 1. EnhancedDataTable
A powerful data table component with built-in features:
- ✅ Sorting (ascending/descending)
- ✅ Searching/Filtering
- ✅ Pagination
- ✅ Row selection (single/multiple)
- ✅ Custom actions (edit, delete, view, custom)
- ✅ Loading states with skeletons
- ✅ Empty states
- ✅ Responsive design
- ✅ Image preview support
- ✅ Custom cell formatting
- ✅ Sticky headers
- ✅ Dense/comfortable modes

### 2. EnhancedFormDialog
A flexible form dialog with comprehensive field types:
- ✅ 15+ field types (text, number, select, multiselect, autocomplete, etc.)
- ✅ Image/file upload with preview
- ✅ Form sections for organization
- ✅ Built-in validation
- ✅ Conditional fields
- ✅ Custom field rendering
- ✅ Grid layout support
- ✅ Loading states
- ✅ Error handling

## 🚀 Quick Start

```tsx
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';

// Use in your page
<EnhancedDataTable columns={columns} data={data} />
<EnhancedFormDialog open={open} fields={fields} onSubmit={handleSubmit} />
```

## 📚 Documentation

See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for comprehensive examples and API documentation.

## 🎯 Features

### Type Safety
- Full TypeScript support
- Exported types for all props
- Generic type support for data structures

### Performance
- Memoized components
- Optimized re-renders
- Efficient pagination
- Debounced search

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### Customization
- MUI theme integration
- Custom styling via `sx` prop
- Flexible layouts
- Custom renderers

## 📁 Structure

```
components/
├── DataTable/
│   ├── EnhancedDataTable.tsx    # Main component
│   └── index.ts                  # Exports
├── FormDialog/
│   ├── EnhancedFormDialog.tsx   # Main component
│   └── index.ts                  # Exports
├── index.ts                      # Main exports
├── types.ts                      # Shared types
├── README.md                     # This file
└── USAGE_EXAMPLES.md            # Usage guide
```

## 🔧 Integration with Your Project

These components are designed to work seamlessly with your existing:
- ✅ Next.js 15 App Router
- ✅ Material-UI v7
- ✅ TypeScript
- ✅ DattaAble theme
- ✅ API fetch utility

## 💡 Best Practices

1. **Memoize your columns and fields** to prevent unnecessary re-renders
2. **Use TypeScript types** for better IDE support and type safety
3. **Implement proper error handling** in your submit functions
4. **Use loading states** for better UX
5. **Keep forms organized** with sections for complex forms

## 🎨 Theming

Components automatically inherit your MUI theme settings:
- Primary color: `#7367f0`
- Border radius: `8px`
- Shadows and elevations
- Typography scale

## 🐛 Common Issues

### Issue: Images not loading
**Solution**: Ensure image URLs are absolute or properly configured in `next.config.ts`

### Issue: Form validation not working
**Solution**: Check that `required` fields are properly set and validation functions return `null` for valid values

### Issue: Table not sorting
**Solution**: Ensure `sortable` is not explicitly set to `false` on columns

## 🔄 Updates & Maintenance

These components are production-ready but can be extended:
- Add new field types to FormDialog
- Add new column types to DataTable
- Customize styling to match your needs
- Add new features as required

## 📝 Contributing

When adding new features:
1. Maintain TypeScript types
2. Follow existing code patterns
3. Update USAGE_EXAMPLES.md
4. Test with your existing pages
5. Ensure accessibility compliance

## 🎯 Usage in Your Pages

Replace repetitive table/form code in your pages:

**Before:**
```tsx
// 200+ lines of table code in every page
```

**After:**
```tsx
<EnhancedDataTable columns={columns} data={data} onEdit={handleEdit} />
// Just 1 line!
```

## 🚀 Next Steps

1. Review [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
2. Try the complete example at the bottom
3. Refactor existing pages to use these components
4. Customize as needed for your use cases

---

**Built with ❤️ for your Admin Panel**
