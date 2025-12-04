"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  DialogContent,
  Box,
  TextField,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Checkbox,
  CircularProgress,
   ListItemText  
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

interface EditableSubsuitableItem {
  gender: string;
  clothType: string;
  number: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  editId: string | null;
  submitting: boolean;
  products: any[];
  dropdowns: any;
  refreshDropdown: (key: string) => Promise<void>;
  handleProductSelect: any;
  image3Preview: string | null;
  setImage3Preview: React.Dispatch<React.SetStateAction<string | null>>;
  image1Preview: string | null;
  setImage1Preview: React.Dispatch<React.SetStateAction<string | null>>;
  image2Preview: string | null;
  setImage2Preview: React.Dispatch<React.SetStateAction<string | null>>;
  videoPreview: string | null;
  setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // image3
  handleImage1Change: (e: React.ChangeEvent<HTMLInputElement>) => void; // image1
  handleImage2Change: (e: React.ChangeEvent<HTMLInputElement>) => void; // image2
  handleDeleteImage: (imageType: "image3" | "image1" | "image2") => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>; // for image3
  image1InputRef: React.RefObject<HTMLInputElement | null>;
  image2InputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  formImgDims: any;
  setFormImgDims: any;
  formVideoDims: any;
  setFormVideoDims: any;
  pageAccess: string;
  umOptions: string[];
  currencyOptions: string[];
  subsuitableInput: { gender: string; clothType: string; number: string };
  setSubsuitableInput: React.Dispatch<
    React.SetStateAction<{ gender: string; clothType: string; number: string }>
  >;
  editableSubsuitableItems: EditableSubsuitableItem[];
  handleAddSubsuitable: () => void;
  handleRemoveSubsuitable: (index: number) => void;
  handleUpdateSubsuitableItem: (
    index: number,
    field: "gender" | "clothType" | "number",
    value: string
  ) => void;
}

export default function ProductFormDialog({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  editId,
  submitting,
  products,
  dropdowns,
  refreshDropdown,
  handleProductSelect,
  image3Preview,
  setImage3Preview,
  image1Preview,
  setImage1Preview,
  image2Preview,
  setImage2Preview,
  videoPreview,
  setVideoPreview,
  handleImageChange,
  handleImage1Change,
  handleImage2Change,
  handleDeleteImage,
  fileInputRef,
  image1InputRef,
  image2InputRef,
  videoInputRef,
  formImgDims,
  setFormImgDims,
  formVideoDims,
  setFormVideoDims,
  pageAccess,
  umOptions,
  currencyOptions,
  subsuitableInput,
  setSubsuitableInput,
  editableSubsuitableItems,
  handleAddSubsuitable,
  handleRemoveSubsuitable,
  handleUpdateSubsuitableItem,
}: ProductFormDialogProps) {
  const dropdownFields = [
    { key: "category", label: "Category" },
    { key: "substructure", label: "Substructure" },
    { key: "content", label: "Content" },
    { key: "design", label: "Design" },
    { key: "subfinish", label: "Subfinish" },
    // subsuitable is now handled separately as a custom component
    { key: "vendor", label: "Vendor" },
    { key: "groupcode", label: "Groupcode" },
  ];
  const GENDER_OPTIONS = ["Men", "Women", "Kids", "Unisex"];

// Build dynamic cloth-type list from all existing products + current editable items
const clothTypeOptions = useMemo(() => {
  const set = new Set<string>();

  // from all saved products
  (Array.isArray(products) ? products : []).forEach((p: any) => {
    if (!p || !Array.isArray(p.subsuitable)) return;

    p.subsuitable.forEach((item: any) => {
      // support both old string format ("Men-Shirt-42") and new object format
      let ct = "";
      if (typeof item === "string") {
        const parts = item.split("-").map((s) => s.trim());
        ct = parts[1] || ""; // 2nd part = cloth type
      } else if (item && typeof item === "object") {
        ct = String(item.clothType || "").trim();
      }
      if (ct) set.add(ct);
    });
  });

  // from current editable items (in this form)
  editableSubsuitableItems.forEach((item) => {
    if (item.clothType) set.add(item.clothType.trim());
  });

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}, [products, editableSubsuitableItems]);

const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  // allow empty (so user can clear the field)
  if (value === "") {
    setForm((prev: any) => ({ ...prev, rating_value: "" }));
    return;
  }

  // allow only numbers with max 2 decimals: e.g. 0, 4, 4.3, 4.34
  const regex = /^([0-9])(\.[0-9]{0,2})?$/;
  if (!regex.test(value)) {
    // ignore invalid typing (like 4.345 or letters)
    return;
  }

  const num = parseFloat(value);
  // block negatives, more than 5, or NaN
  if (Number.isNaN(num) || num < 0 || num > 5) {
    return;
  }

  setForm((prev: any) => ({ ...prev, rating_value: value }));
};
const LEADTIME_BASE_OPTIONS = [
  "Never-Out-of-Stock",
  "Made-to-Order (Program)",
  "Limited",
  "Pre Order",
];

// build dynamic list = base + all existing leadtimes in products
const leadtimeOptions = useMemo(() => {
  const fromProducts: string[] = (Array.isArray(products) ? products : [])
    .flatMap((p: any) => {
      if (!p) return [];
      if (Array.isArray(p.leadtime)) return p.leadtime;
      if (p.leadtime) return [p.leadtime];
      return [];
    })
    .filter(Boolean)
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);

  // merge + dedupe
  return Array.from(new Set([...LEADTIME_BASE_OPTIONS, ...fromProducts]));
}, [products]);



  /* ---------------- debug: form + images ---------------- */
  useEffect(() => {
    if (!open) return;

    
    // lightweight log – helps verify what’s inside when dialog opens / images change
    // eslint-disable-next-line no-console
    console.group("ProductFormDialog debug");
    console.log("editId:", editId);
    console.log("form image fields:", {
      image1: form?.image1,
      image2: form?.image2,
      image3: form?.image3,
      video: form?.video,
    });
    console.log("image previews:", {
      image1Preview,
      image2Preview,
      image3Preview,
      videoPreview,
    });
    console.groupEnd();
  }, [
    open,
    editId,
    form?.image1,
    form?.image2,
    form?.image3,
    form?.video,
    image1Preview,
    image2Preview,
    image3Preview,
    videoPreview,
  ]);

  /* ---------------- Quick Copy options (safe) ---------------- */
  const quickCopyOptions = useMemo(() => {
    try {
      const raw = Array.isArray(products) ? products : [];
      const cleaned = raw.filter((p) => !!p);

      const sorted = cleaned.sort((a: any, b: any) =>
        String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
      );

      const mapped = sorted
        .filter((p) => p && p._id && p.name) // just in case
        .map((p) => ({
          label: String(p.name),
          value: String(p._id),
        }));

      // eslint-disable-next-line no-console
      console.log("QuickCopy options:", mapped);
      return mapped;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error building QuickCopy options", err, products);
      return [];
    }
  }, [products]);

  // Make sure these are always arrays where MUI expects arrays
  const leadtimeValue: string[] = Array.isArray(form.leadtime)
    ? form.leadtime
    : form.leadtime
    ? [String(form.leadtime)]
    : [];

  const productTagValue: string[] = Array.isArray(form.productTag)
    ? form.productTag
    : form.productTag
    ? [String(form.productTag)]
    : [];

  const colorsValue =
    Array.isArray(form.colors) && Array.isArray(dropdowns.color)
      ? form.colors
          .map((colorId: string) =>
            dropdowns.color.find((c: any) => c._id === colorId)
          )
          .filter(Boolean)
      : [];

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative", bgcolor: "#2c3e50" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <ClearIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ ml: 2, flex: 1, fontWeight: 600, color: "white" }}
          >
            {editId ? "✏️ Edit Product" : "➕ Add New Product"}
          </Typography>
          <Button
            variant="contained"
            onClick={onSubmit as any}
            disabled={submitting || pageAccess === "only view"}
            startIcon={
              submitting ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              bgcolor: "white",
              color: "#2c3e50",
              fontWeight: 600,
              "&:hover": { bgcolor: "#f0f0f0" },
              "&:disabled": {
                bgcolor: "rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            {submitting ? "Saving..." : "💾 Save Product"}
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, bgcolor: "#f5f5f5" }}>
        {/* Quick Copy */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "white", borderRadius: 2 }}>
          <Autocomplete
            options={quickCopyOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            onChange={handleProductSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="🔄 Copy From Existing Product"
                placeholder="Type to search..."
              />
            )}
            disabled={pageAccess === "only view"}
          />
        </Box>

        {/* Images Section */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            🖼️ Product Images
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 3,
            }}
          >
            {/* Image 1 (schema: image1) */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Image 1 *
              </Typography>
              <input
                type="file"
                ref={image1InputRef}
                onChange={handleImage1Change}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => image1InputRef.current?.click()}
                startIcon={<ImageIcon />}
                disabled={pageAccess === "only view"}
              >
                {image1Preview ? "Change" : "Upload"}
              </Button>
              {image1Preview && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={image1Preview || ""}
                    alt="Image 1"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    onLoad={(e) =>
                      setFormImgDims((dims: any) => ({
                        ...dims,
                        image1: [
                          (e.target as HTMLImageElement).naturalWidth,
                          (e.target as HTMLImageElement).naturalHeight,
                        ],
                      }))
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage("image1")}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.image1 && (
                    <Typography variant="caption" display="block">
                      {formImgDims.image1[0]}×{formImgDims.image1[1]}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Image 2 (schema: image2) */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Image 2
              </Typography>
              <input
                type="file"
                ref={image2InputRef}
                onChange={handleImage2Change}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => image2InputRef.current?.click()}
                startIcon={<ImageIcon />}
                disabled={pageAccess === "only view"}
              >
                {image2Preview ? "Change" : "Upload"}
              </Button>
              {image2Preview && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={image2Preview || ""}
                    alt="Image 2"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    onLoad={(e) =>
                      setFormImgDims((dims: any) => ({
                        ...dims,
                        image2: [
                          (e.target as HTMLImageElement).naturalWidth,
                          (e.target as HTMLImageElement).naturalHeight,
                        ],
                      }))
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage("image2")}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.image2 && (
                    <Typography variant="caption" display="block">
                      {formImgDims.image2[0]}×{formImgDims.image2[1]}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Image 3 (schema: image3) */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Image 3
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<ImageIcon />}
                disabled={pageAccess === "only view"}
              >
                {image3Preview ? "Change" : "Upload"}
              </Button>
              {image3Preview && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={image3Preview || ""}
                    alt="Image 3"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    onLoad={(e) =>
                      setFormImgDims((dims: any) => ({
                        ...dims,
                        image3: [
                          (e.target as HTMLImageElement).naturalWidth,
                          (e.target as HTMLImageElement).naturalHeight,
                        ],
                      }))
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage("image3")}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.image3 && (
                    <Typography variant="caption" display="block">
                      {formImgDims.image3[0]}×{formImgDims.image3[1]}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Video */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Video
              </Typography>
              <input
                type="file"
                ref={videoInputRef}
                accept="video/mp4"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm((prev: any) => ({ ...prev, video: file }));
                    setVideoPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => videoInputRef.current?.click()}
                startIcon={<ImageIcon />}
                disabled={pageAccess === "only view"}
              >
                {videoPreview ? "Change" : "Upload"}
              </Button>
              {videoPreview && (
                <Box sx={{ mt: 1 }}>
                  <video
                    src={videoPreview || ""}
                    controls
                    style={{ width: "100%", borderRadius: 8 }}
                    onLoadedMetadata={(e) =>
                      setFormVideoDims([
                        (e.target as HTMLVideoElement).videoWidth,
                        (e.target as HTMLVideoElement).videoHeight,
                      ])
                    }
                  />
                  {formVideoDims && Array.isArray(formVideoDims) && (
                    <Typography variant="caption" display="block">
                      {formVideoDims[0]}×{formVideoDims[1]}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Alternative Media Details */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mt: 3, mb: 2, color: "#2c3e50" }}
          >
            Alternative Media Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
            }}
          >
            <TextField
              label="Alternative Image 1 Text"
              value={form.altimg1 || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  altimg1: e.target.value,
                }))
              }
              size="small"
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Alternative Image 2 Text"
              value={form.altimg2 || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  altimg2: e.target.value,
                }))
              }
              size="small"
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Alternative Image 3 Text"
              value={form.altimg3 || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  altimg3: e.target.value,
                }))
              }
              size="small"
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Video Alt Text"
              value={form.altvideo || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  altvideo: e.target.value,
                }))
              }
              size="small"
              disabled={pageAccess === "only view"}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="YT Video URL"
              value={form.videourl || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  videourl: e.target.value,
                }))
              }
              size="small"
              placeholder="https://youtu.be/..."
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="YT Video Alt Text"
              value={form.videoalt || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  videoalt: e.target.value,
                }))
              }
              size="small"
              disabled={pageAccess === "only view"}
            />
          </Box>
        </Box>

        {/* Basic Info - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            📝 Basic Information
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            <Box sx={{ gridColumn: "span 3" }}>
              <TextField
                label="Product Name *"
                value={form.name}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 3" }}>
              <TextField
                label="Slug"
                value={form.slug || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, slug: e.target.value }))
                }
                fullWidth
                helperText="Auto-generated if empty"
                disabled={pageAccess === "only view"}
              />
            </Box>
          </Box>
        </Box>

        {/* Categorization - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            🏷️ Categorization
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            {dropdownFields.map((field) => (
              <FormControl key={field.key} fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  label={field.label}
                  onOpen={() => refreshDropdown(field.key)}
                  disabled={pageAccess === "only view"}
                  endAdornment={
                    form[field.key] && (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((prev: any) => ({
                              ...prev,
                              [field.key]: "",
                            }));
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  {dropdowns[field.key]?.map((option: any) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            <FormControl fullWidth>
              <InputLabel>Motif</InputLabel>
              <Select
                value={form.motif || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, motif: e.target.value }))
                }
                label="Motif"
                onOpen={() => refreshDropdown("motif")}
                disabled={pageAccess === "only view"}
              >
                {dropdowns.motif?.map((option: any) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ gridColumn: "span 3" }}>
  <Autocomplete
    multiple
    options={dropdowns.color || []}
    getOptionLabel={(option: any) => option.name || option._id || ""}

    value={colorsValue}
    onChange={(_, newValue) =>
      setForm((prev: any) => ({
        ...prev,
        colors: newValue.map((item: any) => item._id),
      }))
    }
     onOpen={() => {
      refreshDropdown("color");
    }}

                renderInput={(params) => (
                  <TextField {...params} label="Colors" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option: any, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option._id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
                disabled={pageAccess === "only view"}
              />
            </Box>
          </Box>
        </Box>

        {/* Subsuitable Builder - 6 columns */}
       {/* Subsuitable Builder - 6 columns */}
<Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
  <Typography
    variant="h6"
    sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
  >
    👔 Suitable For (Gender – Cloth Type – Number)
  </Typography>

  {/* ➕ Add new row */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 2,
      mb: 2,
    }}
  >
    {/* Gender select */}
    <Box sx={{ gridColumn: "span 2" }}>
      <FormControl fullWidth size="small">
        <InputLabel>Gender</InputLabel>
        <Select
          label="Gender"
          value={subsuitableInput.gender}
          onChange={(e) =>
            setSubsuitableInput((prev) => ({
              ...prev,
              gender: e.target.value as string,
            }))
          }
          disabled={pageAccess === "only view"}
        >
          {GENDER_OPTIONS.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    {/* Cloth Type select (dynamic from old products) */}
    <Box sx={{ gridColumn: "span 2" }}>
      <FormControl fullWidth size="small">
        <InputLabel>Cloth Type</InputLabel>
        <Select
          label="Cloth Type"
          value={subsuitableInput.clothType}
          onChange={(e) =>
            setSubsuitableInput((prev) => ({
              ...prev,
              clothType: e.target.value as string,
            }))
          }
          disabled={pageAccess === "only view"}
        >
          {clothTypeOptions.length === 0 ? (
            <MenuItem value="" disabled>
              No cloth types found yet
            </MenuItem>
          ) : (
            clothTypeOptions.map((ct) => (
              <MenuItem key={ct} value={ct}>
                {ct}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>

    {/* Number input 1–100 (no dropdown) */}
    <TextField
      fullWidth
      size="small"
      label="Number"
      type="number"
      value={subsuitableInput.number}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          // allow clearing
          setSubsuitableInput((prev) => ({ ...prev, number: "" }));
          return;
        }
        let num = Number(raw);
        if (Number.isNaN(num)) return;
        if (num < 1) num = 1;
        if (num > 100) num = 100;
        setSubsuitableInput((prev) => ({
          ...prev,
          number: String(num),
        }));
      }}
      inputProps={{ min: 1, max: 100 }}
      placeholder="1–100"
      disabled={pageAccess === "only view"}
    />

    <Button
      variant="contained"
      onClick={handleAddSubsuitable}
      disabled={pageAccess === "only view"}
      sx={{ height: 40, alignSelf: "center" }}
    >
      ADD
    </Button>
  </Box>

  {/* 📝 Existing items (edit mode) */}
  {editableSubsuitableItems.length > 0 && (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Added Items
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {editableSubsuitableItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 2,
              p: 1,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            {/* Gender select */}
            <Box sx={{ gridColumn: "span 2" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  value={item.gender}
                  onChange={(e) =>
                    handleUpdateSubsuitableItem(
                      index,
                      "gender",
                      e.target.value as string
                    )
                  }
                  disabled={pageAccess === "only view"}
                >
                  {GENDER_OPTIONS.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Cloth Type select */}
            <Box sx={{ gridColumn: "span 2" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Cloth Type</InputLabel>
                <Select
                  label="Cloth Type"
                  value={item.clothType}
                  onChange={(e) =>
                    handleUpdateSubsuitableItem(
                      index,
                      "clothType",
                      e.target.value as string
                    )
                  }
                  disabled={pageAccess === "only view"}
                >
                  {clothTypeOptions.map((ct) => (
                    <MenuItem key={ct} value={ct}>
                      {ct}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Number input 1–100 */}
            <TextField
              fullWidth
              size="small"
              label="Number"
              type="number"
              value={item.number}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  handleUpdateSubsuitableItem(index, "number", "");
                  return;
                }
                let num = Number(raw);
                if (Number.isNaN(num)) return;
                if (num < 1) num = 1;
                if (num > 100) num = 100;
                handleUpdateSubsuitableItem(index, "number", String(num));
              }}
              inputProps={{ min: 1, max: 100 }}
              disabled={pageAccess === "only view"}
            />

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleRemoveSubsuitable(index)}
              disabled={pageAccess === "only view"}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )}
</Box>


      {/* Lead Time - 6 columns */}
  <Typography
    variant="h6"
    sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
  >
    ⏱️ Lead Time / Program Type
  </Typography>

<FormControl fullWidth>
  <InputLabel id="leadtime-label">Lead Time / Program Type</InputLabel>
  <Select
    labelId="leadtime-label"
    multiple
    label="Lead Time / Program Type"
    value={leadtimeValue}
    onChange={(e) => {
      const value = e.target.value;
      const arr =
        typeof value === "string" ? value.split(",") : (value as string[]);
      setForm((prev: any) => ({
        ...prev,
        leadtime: arr,
      }));
    }}
    renderValue={(selected) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {(selected as string[]).map((val) => (
          <Chip key={val} label={val} size="small" />
        ))}
      </Box>
    )}
    disabled={pageAccess === "only view"}
  >
    {leadtimeOptions.map((option) => (
      <MenuItem key={option} value={option}>
        <Checkbox checked={leadtimeValue.includes(option)} size="small" />
        <ListItemText primary={option} />
      </MenuItem>
    ))}
  </Select>
</FormControl>



        {/* Specifications - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            📏 Specifications
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={form.um || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, um: e.target.value }))
                }
                label="Unit"
                disabled={pageAccess === "only view"}
              >
                {umOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              freeSolo
              options={currencyOptions}
              value={form.currency || ""}
              onInputChange={(_, value) =>
                setForm((prev: any) => ({ ...prev, currency: value }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Currency" />
              )}
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="GSM"
              type="number"
              value={form.gsm || ""}
              onChange={(e) =>
                setForm((prev: any) => ({ ...prev, gsm: e.target.value }))
              }
              disabled={pageAccess === "only view"}
            />
            <TextField label="OZ (Auto)" type="number" value={form.oz || ""} disabled />
            <TextField
              label="CM"
              type="number"
              value={form.cm || ""}
              onChange={(e) =>
                setForm((prev: any) => ({ ...prev, cm: e.target.value }))
              }
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="INCH (Auto)"
              type="number"
              value={form.inch || ""}
              disabled
            />
          </Box>
        </Box>

        {/* Pricing & Inventory - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            💰 Pricing & Inventory
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            <TextField
              label="Purchase Price"
              type="number"
              value={form.purchasePrice || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  purchasePrice: e.target.value,
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.currency || "₹"}
                  </InputAdornment>
                ),
              }}
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Sales Price"
              type="number"
              value={form.salesPrice || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  salesPrice: e.target.value,
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.currency || "₹"}
                  </InputAdornment>
                ),
              }}
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Vendor Fabric Code"
              value={form.vendorFabricCode || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  vendorFabricCode: e.target.value,
                }))
              }
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="SKU"
              value={form.sku || ""}
              onChange={(e) =>
                setForm((prev: any) => ({ ...prev, sku: e.target.value }))
              }
              disabled={pageAccess === "only view"}
            />
            <TextField
              label="Product ID"
              value={form.productIdentifier || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  productIdentifier: e.target.value,
                }))
              }
              disabled={pageAccess === "only view"}
            />
          </Box>
        </Box>

        {/* Product Tags & Ratings */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            🏷️ Product Tags & Ratings
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 2,
              alignItems: "start",
            }}
          >
            <Box sx={{ gridColumn: "span 4" }}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={productTagValue}
                onChange={(_, newValue) => {
                  setForm((prev: any) => ({
                    ...prev,
                    productTag: newValue as string[],
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Tags"
                    placeholder="Add product tags..."
                    helperText="Press Enter to add multiple tags"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))
                }
                disabled={pageAccess === "only view"}
              />
            </Box>
            <TextField
  label="Rating (0-5)"
  type="number"
  value={form.rating_value ?? ""}
  onChange={handleRatingChange}
  inputProps={{ min: 0, max: 5, step: 0.01 }}
  disabled={pageAccess === "only view"}
/>

            <TextField
              label="Rating Count"
              type="number"
              value={form.rating_count || ""}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  rating_count: e.target.value,
                }))
              }
              inputProps={{ min: 0 }}
              disabled={pageAccess === "only view"}
            />
          </Box>
        </Box>

        {/* SEO Fields - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            🔍 SEO Settings
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            <Box sx={{ gridColumn: "span 2" }}>
              <TextField
                label="OG Type"
                value={form.ogType || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    ogType: e.target.value,
                  }))
                }
                fullWidth
                placeholder="e.g., product, website"
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              <TextField
                label="Twitter Card"
                value={form.twitterCard || "summary_large_image"}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    twitterCard: e.target.value,
                  }))
                }
                fullWidth
                placeholder="e.g., summary_large_image"
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              <TextField
                label="OG/Twitter Image URL"
                value={form.ogImage_twitterimage || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    ogImage_twitterimage: e.target.value,
                  }))
                }
                fullWidth
                placeholder="https://..."
                disabled={pageAccess === "only view"}
              />
            </Box>
          </Box>
        </Box>

        {/* Catalog Info - 6 columns */}
        <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            📚 Catalog Information
          </Typography>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}
          >
            <Box sx={{ gridColumn: "span 3" }}>
              <TextField
                label="Product Title"
                value={form.productTitle || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    productTitle: e.target.value,
                  }))
                }
                fullWidth
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 3" }}>
              <TextField
                label="Product Tagline"
                value={form.productTagline || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    productTagline: e.target.value,
                  }))
                }
                fullWidth
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 6" }}>
              <TextField
                label="Short Product Description"
                value={form.shortProductDescription || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    shortProductDescription: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={2}
                disabled={pageAccess === "only view"}
              />
            </Box>
            <Box sx={{ gridColumn: "span 6" }}>
              <TextField
                label="Full Product Description"
                value={form.fullProductDescription || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    fullProductDescription: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={2}
                disabled={pageAccess === "only view"}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}