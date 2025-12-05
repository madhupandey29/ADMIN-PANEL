"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface StaticSeoViewDialogProps {
  open: boolean;
  onClose: () => void;
  seo: any;
  onSave: (updatedSeo: any) => Promise<void>;
  pageAccess: string;
  availableProductTags: string[];
}

export default function StaticSeoViewDialog({
  open,
  onClose,
  seo,
  onSave,
  pageAccess,
  availableProductTags,
}: StaticSeoViewDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (seo) {
      setEditData(seo);
    }
  }, [seo]);

  if (!seo) return null;

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
    setEditData(seo);
    setIsEditMode(false);
  };

  const currentData = isEditMode ? editData : seo;

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = { ...editData };
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);

      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][index]) current[arrayName][index] = {};
        current = current[arrayName][index];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }

    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);

    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][index] = value;
    } else {
      current[lastKey] = value;
    }

    setEditData(newData);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => {
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        return current?.[arrayName]?.[index];
      }
      return current?.[key];
    }, obj);
  };

  const isViewOnly = pageAccess === "only view";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#f8f9fa",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: isEditMode
            ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {isEditMode
            ? "✏️ Editing Topic Page SEO"
            : "👁️ Viewing Topic Page SEO"}
          : {seo.name || "Topic Page"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Basic Information */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="primary"
          >
            📝 Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 2",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Topic Page Name *"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Topic Page Name
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.name}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 1",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Slug"
                  value={editData.slug || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, slug: e.target.value })
                  }
                  fullWidth
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
                  <Typography
                    variant="body2"
                    mt={0.5}
                    fontFamily="monospace"
                  >
                    {currentData.slug || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 1",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editData.status || "draft"}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={currentData.status || "draft"}
                      size="small"
                      color={
                        currentData.status === "published"
                          ? "success"
                          : currentData.status === "archived"
                          ? "default"
                          : "warning"
                      }
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Meta Title"
                  value={editData.meta_title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, meta_title: e.target.value })
                  }
                  fullWidth
                  helperText={`${(editData.meta_title || "").length} chars`}
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Meta Title
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.meta_title || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Content Language"
                  value={editData.contentLanguage || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contentLanguage: e.target.value,
                    })
                  }
                  fullWidth
                  placeholder="e.g., en"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Content Language
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.contentLanguage || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 6",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Meta Description"
                  value={editData.meta_description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      meta_description: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  helperText={`${(editData.meta_description || "").length} chars`}
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Meta Description
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.meta_description || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 2",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Keywords"
                  value={editData.keywords || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, keywords: e.target.value })
                  }
                  fullWidth
                  helperText="Comma-separated"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Keywords
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.keywords || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 1",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Canonical URL"
                  value={editData.canonical_url || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      canonical_url: e.target.value,
                    })
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Canonical URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {currentData.canonical_url || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 6",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Excerpt"
                  value={editData.excerpt || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, excerpt: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Summary"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Excerpt
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.excerpt || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Product Tags */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="success.main"
          >
            🏷️ Product Tags
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {isEditMode ? (
            <Autocomplete
              multiple
              size="small"
              options={availableProductTags}
              value={
                Array.isArray(editData.producttag)
                  ? editData.producttag
                  : editData.producttag
                  ? [editData.producttag]
                  : []
              }
              onChange={(_, newValue) =>
                setEditData({ ...editData, producttag: newValue })
              }
              renderInput={(params) => (
                <TextField {...params} label="Product Tags" />
              )}
              renderTags={(value: unknown[], getTagProps) =>
                value.map((option: unknown, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={String(option)}
                    label={String(option)}
                    size="small"
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
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                {Array.isArray(currentData.producttag) ? (
                  currentData.producttag.map((tag: string, i: number) => (
                    <Chip key={i} label={tag} size="small" />
                  ))
                ) : currentData.producttag ? (
                  <Chip label={currentData.producttag} size="small" />
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Description HTML (render with dangerouslySetInnerHTML) */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="info.main"
          >
            📄 Description HTML
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {isEditMode ? (
            <TextField
              size="small"
              label="Description HTML"
              value={editData.description_html || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description_html: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={4}
            />
          ) : currentData.description_html ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  "& p": { mb: 1 },
                  "& ul": { pl: 3 },
                  "& li": { mb: 0.5 },
                }}
                // render stored HTML
                dangerouslySetInnerHTML={{
                  __html: currentData.description_html,
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2">N/A</Typography>
          )}
        </Box>

        {/* OpenGraph & Twitter */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="warning.main"
          >
            🌐 OpenGraph & Twitter
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="OG Locale"
                  value={editData.ogLocale || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, ogLocale: e.target.value })
                  }
                  fullWidth
                  placeholder="e.g., en_US"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG Locale
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.ogLocale || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="OG Type"
                  value={editData.ogType || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, ogType: e.target.value })
                  }
                  fullWidth
                  placeholder="e.g., website"
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
                  <Typography variant="body2" mt={0.5}>
                    {currentData.ogType || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 1",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Twitter Card"
                  value={editData.twitterCard || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      twitterCard: e.target.value,
                    })
                  }
                  fullWidth
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
                  <Typography variant="body2" mt={0.5}>
                    {currentData.twitterCard || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="OG Image URL"
                  value={getNestedValue(editData, "openGraph.images[0]") || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph.images[0]", e.target.value)
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG Image URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {getNestedValue(currentData, "openGraph.images[0]") ||
                      "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="OG/Twitter Title"
                  value={editData.og_twitter_Title || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      og_twitter_Title: e.target.value,
                    })
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG/Twitter Title
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.og_twitter_Title || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 3",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="OG/Twitter Description"
                  value={editData.og_twitter_Description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      og_twitter_Description: e.target.value,
                    })
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OG/Twitter Description
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {currentData.og_twitter_Description || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* OpenGraph Video */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="secondary"
          >
            🎥 OpenGraph Video
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 2",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Video URL"
                  value={getNestedValue(editData, "openGraph.video.url") || ""}
                  onChange={(e) =>
                    updateNestedField("openGraph.video.url", e.target.value)
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Video URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {getNestedValue(currentData, "openGraph.video.url") ||
                      "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 2",
                  lg: "span 2",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Video Secure URL"
                  value={
                    getNestedValue(editData, "openGraph.video.secure_url") || ""
                  }
                  onChange={(e) =>
                    updateNestedField(
                      "openGraph.video.secure_url",
                      e.target.value
                    )
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Video Secure URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {getNestedValue(
                      currentData,
                      "openGraph.video.secure_url"
                    ) || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Video Type"
                  value={
                    getNestedValue(editData, "openGraph.video.type") || ""
                  }
                  onChange={(e) =>
                    updateNestedField("openGraph.video.type", e.target.value)
                  }
                  fullWidth
                  placeholder="e.g., video/mp4"
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Video Type
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {getNestedValue(currentData, "openGraph.video.type") ||
                      "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Video Width"
                  type="number"
                  value={
                    getNestedValue(editData, "openGraph.video.width") || ""
                  }
                  onChange={(e) =>
                    updateNestedField(
                      "openGraph.video.width",
                      Number(e.target.value)
                    )
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Video Width
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {getNestedValue(currentData, "openGraph.video.width") ||
                      "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Twitter Details */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            color="error"
          >
            🐦 Twitter Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 2",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Twitter Image URL"
                  value={getNestedValue(editData, "twitter.image") || ""}
                  onChange={(e) =>
                    updateNestedField("twitter.image", e.target.value)
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Twitter Image URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {getNestedValue(currentData, "twitter.image") || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                gridColumn: {
                  xs: "1",
                  sm: "span 2",
                  md: "span 1",
                  lg: "span 3",
                },
              }}
            >
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Twitter Player URL"
                  value={getNestedValue(editData, "twitter.player") || ""}
                  onChange={(e) =>
                    updateNestedField("twitter.player", e.target.value)
                  }
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Twitter Player URL
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.5}
                    sx={{ wordBreak: "break-all" }}
                  >
                    {getNestedValue(currentData, "twitter.player") || "N/A"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Structured Data */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={2}
            sx={{ color: "#9c27b0" }}
          >
            📊 Structured Data (JSON-LD)
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {isEditMode ? (
            <TextField
              size="small"
              label="Video JSON-LD"
              value={editData.VideoJsonLd || ""}
              onChange={(e) =>
                setEditData({ ...editData, VideoJsonLd: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
            />
          ) : currentData.VideoJsonLd ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.875rem",
                overflowX: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {currentData.VideoJsonLd}
              </pre>
            </Box>
          ) : (
            <Typography variant="body2">N/A</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {!isEditMode ? (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
              disabled={isViewOnly}
            >
              Edit Topic Page SEO
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Topic Page SEO"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
