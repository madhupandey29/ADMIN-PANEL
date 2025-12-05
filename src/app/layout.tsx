"use client";
import React, { useMemo, useCallback, useState, useEffect, createContext, useContext } from "react";
import NextLink from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItemText,
  Collapse,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PublicIcon from '@mui/icons-material/Public';
import InputBase from '@mui/material/InputBase';
import { usePathname } from "next/navigation";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';

// Sidebar context for managing collapse state
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const value = useMemo(() => ({
    isCollapsed,
    toggleSidebar,
  }), [isCollapsed, toggleSidebar]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// DattaAble styled components
const drawerWidth = 260;
const collapsedDrawerWidth = 60;

const filterModels = [


  { name: "Country", path: "/country" },
  { name: "State", path: "/state" },
  { name: "City", path: "/city" },
  { name: "Location", path: "/location" },
  { name: "Location Details", path: "/location-details" },

  { name: "Office Information", path: "/office-information" },
  { name: "About Us", path: "/aboutus" },
  { name: "Blog", path: "/blog" },
  { name: "Shofy Users", path: "/shofy-users" },

  { name: "Category", path: "/category" },
  { name: "Color", path: "/color" },
  { name: "Contact", path: "/contact" },
  { name: "Content", path: "/content" },
  { name: "Design", path: "/design" },
  { name: "Groupcode", path: "/groupcode" },
  { name: "Motif", path: "/motif" },
  { name: "Finish", path: "/finish" },


  { name: "Subfinish", path: "/subfinish" },
  { name: "Structure", path: "/structure" },
  { name: "Substructure", path: "/substructure" },

  { name: "Suitablefor", path: "/suitablefor" },
  { name: "Subsuitable", path: "/subsuitable" },
  { name: "Vendor", path: "/vendor" },
];

// Create DattaAble theme
const createDattaAbleTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#7367f0',
    },
    secondary: {
      main: '#82868b',
    },
    background: {
      default: mode === 'light' ? '#f8f8f8' : '#161d31',
      paper: mode === 'light' ? '#ffffff' : '#283046',
    },
    text: {
      primary: mode === 'light' ? '#6e6b7b' : '#d0d2d6',
      secondary: mode === 'light' ? '#b9b9c3' : '#676d7d',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#283046',
          borderRight: `1px solid ${mode === 'light' ? '#ebe9f1' : '#3b4253'}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#283046',
          color: mode === 'light' ? '#6e6b7b' : '#d0d2d6',
          boxShadow: mode === 'light' ? '0 4px 24px 0 rgba(34, 41, 47, 0.24)' : '0 4px 24px 0 rgba(0, 0, 0, 0.24)',
        },
      },
    },
  },
});

const Sidebar = React.memo(() => {
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('admin-email');
      const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
      setIsSuperAdmin(Boolean(email && superAdmin && email === superAdmin));
      setUserEmail(email || '');
    }
  }, []);
  
  const handleClick = useCallback(() => setOpen(prev => !prev), []);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = useCallback(() => {
    document.cookie = "admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("admin-auth");
    window.location.href = "/login";
  }, []);

  // Simple clean menu item styling
  const getMenuItemSx = (path: string) => ({
    borderRadius: '8px',
    mb: 0.5,
    py: 1,
    px: isCollapsed ? 0 : 1.5,
    mx: isCollapsed ? 0.5 : 1,
    transition: 'all 0.2s ease',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    minHeight: 40,
    ...(pathname === path && {
      backgroundColor: '#f3f4f6',
      color: '#7367f0',
      '&:hover': {
        backgroundColor: '#e5e7eb',
      }
    }),
    '&:hover': {
      backgroundColor: pathname === path ? '#e5e7eb' : '#f9fafb',
    },
  });

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { 
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': { 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb:hover': { 
            backgroundColor: 'rgba(0,0,0,0.2)' 
          },
        }
      }}
    >
      {/* Simple Clean Header */}
      <Box sx={{
        p: isCollapsed ? 1.5 : 2,
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 70,
        backgroundColor: '#ffffff',
      }}>
        {/* Left: Hamburger + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : 1.5 }}>
          <IconButton
            size="small"
            onClick={toggleSidebar}
            sx={{
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            }}
          >
            <MenuOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7367f0 0%, #9c8cfc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DashboardIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: '16px',
                }}>
                  AGE Admin
                </Typography>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontSize: '11px',
                  fontWeight: 500
                }}>
                  Management Panel
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: Profile Icon */}
        <IconButton
          size="small"
          onClick={handleAvatarClick}
          sx={{
            color: '#6b7280',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            },
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', py: 1 }}>
        <List sx={{ px: isCollapsed ? 0.5 : 1.5 }}>
          {/* Dashboard */}
          <ListItemButton
            component={NextLink}
            href="/dashboard"
            sx={{
              borderRadius: '12px',
              mb: 0.5,
              py: 1.2,
              px: isCollapsed ? 0 : 1.5,
              mx: isCollapsed ? 0.5 : 1,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 44,
              position: 'relative',
              overflow: 'hidden',
              ...(pathname === '/dashboard' && {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'white',
                  borderRadius: '0 4px 4px 0'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                }
              }),
              '&:hover': {
                backgroundColor: pathname === '/dashboard' ? 'transparent' : 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                }
              },
            }}
          >
            <ListItemIcon sx={{
              color: pathname === '/dashboard' ? '#7367f0' : '#6b7280',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.5,
              justifyContent: 'center',
              display: 'flex',
            }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Dashboard"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: pathname === '/dashboard' ? 600 : 500,
                    color: pathname === '/dashboard' ? '#7367f0' : '#374151',
                  }
                }}
              />
            )}
          </ListItemButton>

          {/* Products */}
          <ListItemButton
            component={NextLink}
            href="/products"
            sx={getMenuItemSx('/products')}
          >
            <ListItemIcon sx={{
              color: pathname === '/products' ? '#7367f0' : '#6b7280',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.5,
              justifyContent: 'center',
              display: 'flex',
            }}>
              <InventoryIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Products"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: pathname === '/products' ? 600 : 500,
                    color: pathname === '/products' ? '#7367f0' : '#374151',
                  }
                }}
              />
            )}
          </ListItemButton>

          {/* Product * Location */}
          <ListItemButton
            component={NextLink}
            href="/product-location-seo"
            sx={{
              borderRadius: '10px',
              mb: 0.75,
              py: 1.1,
              px: isCollapsed ? 0 : 1.5,
              transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 42,
              borderLeft: '3px solid transparent',
              ...(pathname === '/seo' && {
                backgroundColor: 'primary.main',
                color: 'white',
                borderLeftColor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }),
              '&:hover': {
                backgroundColor: pathname === '/seo' ? 'primary.dark' : 'action.hover',
                transform: 'translateX(2px)',
                boxShadow: pathname === '/seo' ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                borderLeftColor: 'primary.main',
              },
              '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
          >
            <ListItemIcon sx={{
              color: pathname === '/seo' ? 'white' : 'text.secondary',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.25,
              justifyContent: 'center',
              display: 'flex'
            }}>
              <SearchIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Product * Location"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '13.5px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          </ListItemButton>

          {/* Static SEO */}
          <ListItemButton
            component={NextLink}
            href="/topicpage-seo"
            sx={{
              borderRadius: '10px',
              mb: 0.75,
              py: 1.1,
              px: isCollapsed ? 0 : 1.5,
              transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 42,
              borderLeft: '3px solid transparent',
              ...(pathname === '/static-seo' && {
                backgroundColor: 'primary.main',
                color: 'white',
                borderLeftColor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }),
              '&:hover': {
                backgroundColor: pathname === '/static-seo' ? 'primary.dark' : 'action.hover',
                transform: 'translateX(2px)',
                boxShadow: pathname === '/static-seo' ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                borderLeftColor: 'primary.main',
              },
              '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
          >
            <ListItemIcon sx={{
              color: pathname === '/static-seo' ? 'white' : 'text.secondary',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.25,
              justifyContent: 'center',
              display: 'flex'
            }}>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Topic Page SEO"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '13.5px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          </ListItemButton>

          {/* public SEO */}
          <ListItemButton
            component={NextLink}
            href="/public-seo"
            sx={{
              borderRadius: '10px',
              mb: 0.75,
              py: 1.1,
              px: isCollapsed ? 0 : 1.5,
              transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 42,
              borderLeft: '3px solid transparent',
              ...(pathname === '/public-seo' && {
                backgroundColor: 'primary.main',
                color: 'white',
                borderLeftColor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }),
              '&:hover': {
                backgroundColor: pathname === '/public-seo' ? 'primary.dark' : 'action.hover',
                transform: 'translateX(2px)',
                boxShadow: pathname === '/public-seo' ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                borderLeftColor: 'primary.main',
              },
              '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
          >
            <ListItemIcon sx={{
              color: pathname === '/public-seo' ? 'white' : 'text.secondary',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.25,
              justifyContent: 'center',
              display: 'flex'
            }}>
              <PublicIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Public-SEO"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '13.5px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          </ListItemButton>
          {/* Products */}
          <ListItemButton
            component={NextLink}
            href="/orders"
            sx={{
              borderRadius: '10px',
              mb: 0.75,
              py: 1.1,
              px: isCollapsed ? 0 : 1.5,
              transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: 42,
              borderLeft: '3px solid transparent',
              ...(pathname === '/orders' && {
                backgroundColor: 'primary.main',
                color: 'white',
                borderLeftColor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }),
              '&:hover': {
                backgroundColor: pathname === '/orders' ? 'primary.dark' : 'action.hover',
                transform: 'translateX(2px)',
                boxShadow: pathname === '/orders' ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                borderLeftColor: 'primary.main',
              },
              '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
          >
            <ListItemIcon sx={{
              color: pathname === '/orders' ? 'white' : 'text.secondary',
              minWidth: 0,
              mr: isCollapsed ? 0 : 1.25,
              justifyContent: 'center',
              display: 'flex'
            }}>
              <ShoppingCartIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Orders"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '13.5px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          </ListItemButton>


          {/* Admin Restriction */}
          {isSuperAdmin && (
            <ListItemButton
              component={NextLink}
              href="/admin-restriction"
              sx={{
                borderRadius: '10px',
                mb: 0.75,
                py: 1.1,
                px: isCollapsed ? 0 : 1.5,
                transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                minHeight: 42,
                borderLeft: '3px solid transparent',
                ...(pathname === '/admin-restriction' && {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderLeftColor: 'primary.dark',
                  boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }),
                '&:hover': {
                  backgroundColor: pathname === '/admin-restriction' ? 'primary.dark' : 'action.hover',
                  transform: 'translateX(2px)',
                  boxShadow: pathname === '/admin-restriction' ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                  borderLeftColor: 'primary.main',
                },
                '&:active': { transform: 'translateX(1px) scale(0.99)' },
              }}
            >
              <ListItemIcon sx={{
                color: pathname === '/admin-restriction' ? 'white' : 'text.secondary',
                minWidth: 0,
                mr: isCollapsed ? 0 : 1.25,
                justifyContent: 'center',
                display: 'flex'
              }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Admin Restriction"
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '13.5px',
                      fontWeight: 500
                    }
                  }}
                />
              )}
            </ListItemButton>
          )}

          {/* Filters Dropdown */}
          <ListItemButton
            onClick={handleClick}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              py: 1.1,
              px: 1.5,
              transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
              borderLeft: '3px solid transparent',
              ...(pathname.startsWith('/category') || pathname.startsWith('/color') || pathname.startsWith('/content') || pathname.startsWith('/design') || pathname.startsWith('/finish') || pathname.startsWith('/groupcode') || pathname.startsWith('/structure') || pathname.startsWith('/subfinish') || pathname.startsWith('/substructure') || pathname.startsWith('/subsuitable') || pathname.startsWith('/suitablefor') || pathname.startsWith('/vendor') || pathname.startsWith('/motif') ? {
                backgroundColor: 'primary.main',
                color: 'white',
                borderLeftColor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(115,103,240,0.22)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              } : {}),
              '&:hover': {
                backgroundColor: (pathname.startsWith('/category') || pathname.startsWith('/color') || pathname.startsWith('/content') || pathname.startsWith('/design') || pathname.startsWith('/finish') || pathname.startsWith('/groupcode') || pathname.startsWith('/structure') || pathname.startsWith('/subfinish') || pathname.startsWith('/substructure') || pathname.startsWith('/subsuitable') || pathname.startsWith('/suitablefor') || pathname.startsWith('/vendor') || pathname.startsWith('/motif')) ? 'primary.dark' : 'action.hover',
                transform: 'translateX(2px)',
                boxShadow: (pathname.startsWith('/category') || pathname.startsWith('/color') || pathname.startsWith('/content') || pathname.startsWith('/design') || pathname.startsWith('/finish') || pathname.startsWith('/groupcode') || pathname.startsWith('/structure') || pathname.startsWith('/subfinish') || pathname.startsWith('/substructure') || pathname.startsWith('/subsuitable') || pathname.startsWith('/suitablefor') || pathname.startsWith('/vendor') || pathname.startsWith('/motif')) ? '0 8px 18px rgba(115,103,240,0.28)' : '0 4px 10px rgba(0,0,0,0.06)',
                borderLeftColor: 'primary.main',
              },
              '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
          >
            <ListItemIcon sx={{
              color: (pathname.startsWith('/category') || pathname.startsWith('/color') || pathname.startsWith('/content') || pathname.startsWith('/design') || pathname.startsWith('/finish') || pathname.startsWith('/groupcode') || pathname.startsWith('/structure') || pathname.startsWith('/subfinish') || pathname.startsWith('/substructure') || pathname.startsWith('/subsuitable') || pathname.startsWith('/suitablefor') || pathname.startsWith('/vendor') || pathname.startsWith('/motif')) ? 'white' : 'text.secondary',
              minWidth: 0,
              mr: 1.25
            }}>
              <FilterListIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Filters"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '13.5px',
                    fontWeight: 500
                  }
                }}
              />
            )}
            {!isCollapsed && (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* Filter Submenu */}
          <Collapse in={open && !isCollapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.75 }}>
              {filterModels.map((model) => (
                <ListItemButton
                  component={NextLink}
                  href={model.path}
                  key={model.name}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.25,
                    py: 0.85,
                    px: 1.5,
                    transition: 'all 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
                    borderLeft: '3px solid transparent',
                    ...(pathname === model.path && {
                      backgroundColor: 'primary.dark',
                      color: 'white',
                      borderLeftColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(115,103,240,0.18)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }),
                    '&:hover': {
                      backgroundColor: pathname === model.path ? 'primary.main' : 'action.hover',
                      transform: 'translateX(2px)',
                      boxShadow: pathname === model.path ? '0 6px 14px rgba(115,103,240,0.22)' : '0 3px 8px rgba(0,0,0,0.05)',
                      borderLeftColor: 'primary.main',
                    },
                    '&:active': { transform: 'translateX(1px) scale(0.99)' },
                  }}
                >
                  <ListItemText
                    primary={model.name}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '13px',
                        fontWeight: 400
                      }
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Logout */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '6px',
              mb: 0.5,
              py: 1.1,
              px: 1.5,
              transition: 'all 0.3s ease',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{
              color: 'inherit',
              minWidth: 0,
              mr: 1.25
            }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: 500
                  }
                }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            Admin User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mt: 0.5 }}>
            {userEmail}
          </Typography>
        </Box>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#7367f0' }} />
          </ListItemIcon>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: '#ea5455',
            '&:hover': {
              backgroundColor: '#ffebee'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ea5455' }} />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Drawer>
  );
});

Sidebar.displayName = 'Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => createDattaAbleTheme('light'), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <html lang="en">
      <head>
        {/* 🔥 Preconnect & DNS prefetch to speed up first API call */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL!} crossOrigin="" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL!} />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SidebarProvider>
            <Box sx={{ display: 'flex' }}>
              {mounted && <Sidebar />}
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    minHeight: '100vh',
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}