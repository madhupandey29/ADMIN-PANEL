"use client";
import React, { useState, useEffect, useRef,useMemo } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  DialogContent,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
   Checkbox,       // ⬅️ add
  ListItemText,   // ⬅️ add
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import Image from "next/image";

interface ProductViewDialogProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onSave: (updatedProduct: any) => Promise<void>;
  getImageUrl: (img: string | undefined) => string | undefined;
  pageAccess: string;
  dropdowns: any;
}

type ImageField = "image1" | "image2" | "image3";

export default function ProductViewDialog({
  open,
  onClose,
  product,
  onSave,
  getImageUrl,
  pageAccess,
  dropdowns,
}: ProductViewDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  // local previews for existing or newly selected files
  const [mediaPreview, setMediaPreview] = useState<{
    image1?: string;
    image2?: string;
    image3?: string;
    video?: string;
  }>({});

 const LEADTIME_BASE_OPTIONS = [
  "Never-Out-of-Stock",
  "Made-to-Order (Program)",
  "Limited",
  "Pre Order",
];

const leadtimeOptions = useMemo(() => {
  const fromProducts: string[] = product
    ? (Array.isArray(product.leadtime) ? product.leadtime : product.leadtime ? [product.leadtime] : [])
        .filter(Boolean)
        .map((v: any) => String(v).trim())
        .filter((v) => v.length > 0)
    : [];

  return Array.from(new Set([...LEADTIME_BASE_OPTIONS, ...fromProducts]));
}, [product]);


  // refs for hidden file inputs
  const image1InputRef = useRef<HTMLInputElement | null>(null);
  const image2InputRef = useRef<HTMLInputElement | null>(null);
  const image3InputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (product) {
      const getId = (field: any): string => {
        if (!field) return "";
        if (typeof field === "string") return field;
        if (field && typeof field === "object" && "_id" in field) return field._id;
        return "";
      };

      const processedData = {
        ...product,
        category: getId(product.category),
        substructure: getId(product.substructure),
        content: getId(product.content),
        design: getId(product.design),
        subfinish: getId(product.subfinish),
        vendor: getId(product.vendor),
        groupcode: getId(product.groupcode),
        motif: getId(product.motif),
        um: getId(product.um),
        currency: getId(product.currency),
        color: Array.isArray(product.color)
          ? product.color.map((c: any) => getId(c))
          : [getId(product.color)],
        subsuitable: Array.isArray(product.subsuitable)
          ? product.subsuitable
          : [],
        leadtime: Array.isArray(product.leadtime) ? product.leadtime : [],
      };

      setEditData(processedData);

      // set initial previews from backend paths
      setMediaPreview({
        image1: product.image1 ? getImageUrl(product.image1) || "" : "",
        image2: product.image2 ? getImageUrl(product.image2) || "" : "",
        image3: product.image3 ? getImageUrl(product.image3) || "" : "",
        video: product.video ? getImageUrl(product.video) || "" : "",
      });
    }
  }, [product, getImageUrl]);

  if (!product) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editData);
      setIsEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(product);
    setIsEditMode(false);
    setMediaPreview({
      image1: product.image1 ? getImageUrl(product.image1) || "" : "",
      image2: product.image2 ? getImageUrl(product.image2) || "" : "",
      image3: product.image3 ? getImageUrl(product.image3) || "" : "",
      video: product.video ? getImageUrl(product.video) || "" : "",
    });
  };

  const currentData = isEditMode ? editData : product;

  /* ---------------- image/video handlers ---------------- */

  const handleImageFileChange =
    (field: ImageField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setEditData((prev: any) => ({
        ...prev,
        [field]: file, // parent onSave should send this as File in FormData
      }));

      const url = URL.createObjectURL(file);
      setMediaPreview((prev) => ({
        ...prev,
        [field]: url,
      }));
    };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditData((prev: any) => ({
      ...prev,
      video: file,
    }));

    const url = URL.createObjectURL(file);
    setMediaPreview((prev) => ({
      ...prev,
      video: url,
    }));
  };

  const handleRemoveImage = (field: ImageField) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: null, // treat null = delete on backend
    }));
    setMediaPreview((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleRemoveVideo = () => {
    setEditData((prev: any) => ({
      ...prev,
      video: null,
    }));
    setMediaPreview((prev) => ({
      ...prev,
      video: "",
    }));
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative", bgcolor: "#2c3e50" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <ClearIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2, flex: 1 }}>
            {mediaPreview.image1 && (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  position: "relative",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "2px solid white",
                }}
              >
                <Image
                  src={mediaPreview.image1}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            )}
            <Box>
              <Typography variant="h6" fontWeight={600} color="white">
                {isEditMode ? "✏️ Editing" : "👁️ Viewing"}: {product.name}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                SKU: {product.sku || "N/A"} • ID: {product._id}
              </Typography>
            </Box>
          </Box>
          {!isEditMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
              disabled={pageAccess === "only view"}
              sx={{
                bgcolor: "white",
                color: "#2c3e50",
                fontWeight: 600,
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Edit Product
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#45a049" },
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, bgcolor: "#f5f5f5" }}>
        {/* ---------------- Product Images ---------------- */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}>
            🖼️ Product Images
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {/* Image 1 */}
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" mb={1}>
                Image 1
              </Typography>

              {isEditMode && (
                <>
                  <input
                    type="file"
                    ref={image1InputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange("image1")}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => image1InputRef.current?.click()}
                  >
                    {mediaPreview.image1 ? "Change" : "Upload"}
                  </Button>
                </>
              )}

              {mediaPreview.image1 && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={mediaPreview.image1}
                    alt="Image 1"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                  {isEditMode && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage("image1")}
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
                  )}
                </Box>
              )}
            </Box>

            {/* Image 2 */}
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" mb={1}>
                Image 2
              </Typography>

              {isEditMode && (
                <>
                  <input
                    type="file"
                    ref={image2InputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange("image2")}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => image2InputRef.current?.click()}
                  >
                    {mediaPreview.image2 ? "Change" : "Upload"}
                  </Button>
                </>
              )}

              {mediaPreview.image2 && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={mediaPreview.image2}
                    alt="Image 2"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                  {isEditMode && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage("image2")}
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
                  )}
                </Box>
              )}
            </Box>

            {/* Image 3 */}
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" mb={1}>
                Image 3
              </Typography>

              {isEditMode && (
                <>
                  <input
                    type="file"
                    ref={image3InputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange("image3")}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => image3InputRef.current?.click()}
                  >
                    {mediaPreview.image3 ? "Change" : "Upload"}
                  </Button>
                </>
              )}

              {mediaPreview.image3 && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <Image
                    src={mediaPreview.image3}
                    alt="Image 3"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                  {isEditMode && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage("image3")}
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
                  )}
                </Box>
              )}
            </Box>

            {/* Video */}
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" mb={1}>
                Video
              </Typography>

              {isEditMode && (
                <>
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/mp4,video/*"
                    style={{ display: "none" }}
                    onChange={handleVideoFileChange}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    {mediaPreview.video ? "Change" : "Upload"}
                  </Button>
                </>
              )}

              {mediaPreview.video && (
                <Box sx={{ position: "relative", mt: 1 }}>
                  <video
                    src={mediaPreview.video}
                    controls
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  {isEditMode && (
                    <IconButton
                      size="small"
                      onClick={handleRemoveVideo}
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
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Alternative Media Details */}
        {(product.altimg1 ||
            product.altimg2 ||
            product.altimg3 ||
            product.altvideo ||
            product.videourl ||
            product.videoalt) && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2, color: "#2c3e50" }}
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
                {product.altimg1 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Alternative Image 1 Text
                    </Typography>
                    <Typography variant="body2">{product.altimg1}</Typography>
                  </Box>
                )}
                {product.altimg2 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Alternative Image 2 Text
                    </Typography>
                    <Typography variant="body2">{product.altimg2}</Typography>
                  </Box>
                )}
                {product.altimg3 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Alternative Image 3 Text
                    </Typography>
                    <Typography variant="body2">{product.altimg3}</Typography>
                  </Box>
                )}
                {product.altvideo && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Video Alt Text
                    </Typography>
                    <Typography variant="body2">{product.altvideo}</Typography>
                  </Box>
                )}
              </Box>
              {(product.videourl || product.videoalt) && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {product.videourl && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        YT Video URL
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {product.videourl}
                      </Typography>
                    </Box>
                  )}
                  {product.videoalt && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        YT Video Alt Text
                      </Typography>
                      <Typography variant="body2">
                        {product.videoalt}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Basic Information - 6 columns */}
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
              {isEditMode ? (
                <TextField
                  label="Product Name"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Product Name
                  </Typography>
                  <Typography variant="body2">{currentData.name}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 3" }}>
              {isEditMode ? (
                <TextField
                  label="Slug"
                  value={editData.slug || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, slug: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Slug
                  </Typography>
                  <Typography variant="body2">
                    {currentData.slug || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              {isEditMode ? (
                <TextField
                  label="SKU"
                  value={editData.sku || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, sku: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    SKU
                  </Typography>
                  <Typography variant="body2">
                    {currentData.sku || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              {isEditMode ? (
                <TextField
                  label="Product ID"
                  value={editData.productIdentifier || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      productIdentifier: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Product ID
                  </Typography>
                  <Typography variant="body2">
                    {currentData.productIdentifier || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              {isEditMode ? (
                <TextField
                  label="Vendor Fabric Code"
                  value={editData.vendorFabricCode || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      vendorFabricCode: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Vendor Fabric Code
                  </Typography>
                  <Typography variant="body2">
                    {currentData.vendorFabricCode || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
          <Box sx={{ gridColumn: "span 4" }}>
  <Typography
    variant="caption"
    color="text.secondary"
    fontWeight={600}
    display="block"
    mb={0.5}
  >
    Lead Time / Program Type
  </Typography>

  {isEditMode ? (
  <FormControl fullWidth size="small">
    <Select
      multiple
      value={Array.isArray(editData.leadtime) ? editData.leadtime : []}
      onChange={(e) => {
        const value = e.target.value;
        const arr =
          typeof value === "string" ? value.split(",") : (value as string[]);
        setEditData((prev: any) => ({
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
    >
      {leadtimeOptions.map((option) => (
        <MenuItem key={option} value={option}>
          <Checkbox
            checked={
              Array.isArray(editData.leadtime) &&
              editData.leadtime.includes(option)
            }
            size="small"
          />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
) : (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {Array.isArray(currentData.leadtime) &&
      currentData.leadtime.length > 0 ? (
        currentData.leadtime.map((time: string, i: number) => (
          <Chip key={i} label={time} size="small" />
        ))
      ) : (
        <Typography variant="body2">-</Typography>
      )}
    </Box>
  )}
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
            {[
              "category",
              "substructure",
              "content",
              "design",
              "subfinish",
              "vendor",
              "groupcode",
              "motif",
            ].map((field) => (
              <Box key={field}>
                {isEditMode ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </InputLabel>
                    <Select
                      value={editData[field] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [field]: e.target.value })
                      }
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                    >
                      {dropdowns[field]?.map((opt: any) => (
                        <MenuItem key={opt._id} value={opt._id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      {(currentData[field] as any)?.name ||
                        currentData[field] ||
                        "-"}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
            <Box sx={{ gridColumn: "span 3" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                display="block"
                mb={1}
              >
                Colors
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Array.isArray(currentData.color) ? (
                  currentData.color.map((c: any, i: number) => (
                    <Chip
                      key={i}
                      label={typeof c === "string" ? c : c.name}
                      size="small"
                    />
                  ))
                ) : (
                  <Chip
                    label={
                      typeof currentData.color === "string"
                        ? currentData.color
                        : (currentData.color as any)?.name || "-"
                    }
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Suitable For - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            👔 Suitable For
          </Typography>
          {isEditMode ? (
            <Box>
              <TextField
                fullWidth
                size="small"
                label="Add Suitable For Item"
                placeholder="e.g., Male-Shirt-42 (press Enter to add)"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      const currentItems = Array.isArray(editData.subsuitable)
                        ? editData.subsuitable
                        : [];
                      const flatItems = currentItems.flatMap((item: string) =>
                        item.includes(",")
                          ? item.split(",").map((s) => s.trim())
                          : [item]
                      );
                      flatItems.push(value);
                      setEditData({
                        ...editData,
                        subsuitable: [flatItems.join(",")],
                      });
                      input.value = "";
                    }
                  }
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {Array.isArray(editData.subsuitable) &&
                editData.subsuitable.length > 0 ? (
                  editData.subsuitable
                    .flatMap((item: string) =>
                      item.includes(",")
                        ? item.split(",").map((s) => s.trim())
                        : [item]
                    )
                    .map((item: string, i: number) => (
                      <Chip
                        key={i}
                        label={item}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onDelete={() => {
                          const currentItems =
                            editData.subsuitable.flatMap((it: string) =>
                              it.includes(",")
                                ? it.split(",").map((s) => s.trim())
                                : [it]
                            );
                          currentItems.splice(i, 1);
                          setEditData({
                            ...editData,
                            subsuitable:
                              currentItems.length > 0
                                ? [currentItems.join(",")]
                                : [],
                          });
                        }}
                      />
                    ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No items added
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Array.isArray(currentData.subsuitable) &&
              currentData.subsuitable.length > 0 ? (
                currentData.subsuitable
                  .flatMap((item: string) =>
                    item.includes(",")
                      ? item.split(",").map((s) => s.trim())
                      : [item]
                  )
                  .map((item: string, i: number) => (
                    <Chip
                      key={i}
                      label={item}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No suitable for data
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Lead Time - 6 columns (edit mode only) */}
        <Box sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
          >
            ⏱️ Lead Time
          </Typography>
          {isEditMode ? (
            <Box>
              <TextField
                fullWidth
                size="small"
                label="Add Lead Time (days)"
                placeholder="e.g., 7 (press Enter to add)"
                type="number"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      const currentItems = Array.isArray(editData.leadtime)
                        ? editData.leadtime
                        : [];
                      setEditData({
                        ...editData,
                        leadtime: [...currentItems, value],
                      });
                      input.value = "";
                    }
                  }
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {Array.isArray(editData.leadtime) &&
                editData.leadtime.length > 0 ? (
                  editData.leadtime.map((time: string, i: number) => (
                    <Chip
                      key={i}
                      label={`${time} days`}
                      size="small"
                      onDelete={() => {
                        const newLeadtime = [...editData.leadtime];
                        newLeadtime.splice(i, 1);
                        setEditData({ ...editData, leadtime: newLeadtime });
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No lead time added
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Array.isArray(currentData.leadtime) &&
              currentData.leadtime.length > 0 ? (
                currentData.leadtime.map((time: string, i: number) => (
                  <Chip key={i} label={`${time} days`} size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No lead time specified
                </Typography>
              )}
            </Box>
          )}
        </Box>

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
            {[
              { field: "um", label: "Unit (UM)", editable: true },
              { field: "currency", label: "Currency", editable: true },
              { field: "gsm", label: "GSM", editable: true, type: "number" },
              { field: "oz", label: "OZ", editable: false, type: "number" },
              { field: "cm", label: "CM", editable: true, type: "number" },
              { field: "inch", label: "INCH", editable: false, type: "number" },
            ].map(({ field, label, editable, type }) => (
              <Box key={field}>
                {isEditMode && editable ? (
                  <TextField
                    label={label}
                    type={type || "text"}
                    value={editData[field] || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [field]: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2">
                      {currentData[field] || "-"}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
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
            {[
              { field: "purchasePrice", label: "Purchase Price" },
              { field: "salesPrice", label: "Sales Price" },
              { field: "quantity", label: "MOQ" },
            ].map(({ field, label }) => (
              <Box key={field}>
                {isEditMode ? (
                  <TextField
                    label={label}
                    type="number"
                    value={editData[field] || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [field]: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2">
                      {currentData[field] || "-"}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Flags & Ratings - 6 columns */}
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
              {isEditMode ? (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={editData.productTag || []}
                  onChange={(_, newValue) =>
                    setEditData({
                      ...editData,
                      productTag: newValue as string[],
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Tags"
                      placeholder="Add product tags..."
                      size="small"
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
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Product Tags
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
                  >
                    {currentData.productTag &&
                    Array.isArray(currentData.productTag) &&
                    currentData.productTag.length > 0 ? (
                      currentData.productTag.map(
                        (tag: string, index: number) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "#f3e5f5",
                              color: "#7b1fa2",
                              fontWeight: 500,
                            }}
                          />
                        )
                      )
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
            {[
              { field: "rating_value", label: "Rating Value" },
              { field: "rating_count", label: "Rating Count" },
            ].map(({ field, label }) => (
              <Box key={field}>
                {isEditMode ? (
                  <TextField
                    label={label}
                    type="number"
                    value={editData[field] || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [field]: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2">
                      {currentData[field] || "-"}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* SEO Settings - 6 columns */}
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
              {isEditMode ? (
                <TextField
                  label="OG Type"
                  value={editData.ogType || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, ogType: e.target.value })
                  }
                  fullWidth
                  size="small"
                  placeholder="e.g., product"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG Type
                  </Typography>
                  <Typography variant="body2">
                    {currentData.ogType || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              {isEditMode ? (
                <TextField
                  label="Twitter Card"
                  value={editData.twitterCard || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, twitterCard: e.target.value })
                  }
                  fullWidth
                  size="small"
                  placeholder="e.g., summary_large_image"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Twitter Card
                  </Typography>
                  <Typography variant="body2">
                    {currentData.twitterCard || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 2" }}>
              {isEditMode ? (
                <TextField
                  label="OG/Twitter Image"
                  value={editData.ogImage_twitterimage || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      ogImage_twitterimage: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                  placeholder="https://..."
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG/Twitter Image
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {currentData.ogImage_twitterimage || "-"}
                  </Typography>
                </Box>
              )}
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
              {isEditMode ? (
                <TextField
                  label="Product Title"
                  value={editData.productTitle || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      productTitle: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Product Title
                  </Typography>
                  <Typography variant="body2">
                    {currentData.productTitle || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 3" }}>
              {isEditMode ? (
                <TextField
                  label="Product Tagline"
                  value={editData.productTagline || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      productTagline: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Product Tagline
                  </Typography>
                  <Typography variant="body2">
                    {currentData.productTagline || "-"}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 6" }}>
              {isEditMode ? (
                <TextField
                  label="Short Product Description"
                  value={editData.shortProductDescription || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      shortProductDescription: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Short Product Description
                  </Typography>
                  <Box
                    sx={{ fontSize: "0.875rem", lineHeight: 1.43 }}
                    dangerouslySetInnerHTML={{
                      __html: currentData.shortProductDescription || "-",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: "span 6" }}>
              {isEditMode ? (
                <TextField
                  label="Full Product Description"
                  value={editData.fullProductDescription || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      fullProductDescription: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Full Product Description
                  </Typography>
                  <Box
                    sx={{ fontSize: "0.875rem", lineHeight: 1.43 }}
                    dangerouslySetInnerHTML={{
                      __html: currentData.fullProductDescription || "-",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
