import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  Badge,
  Divider,
  Stack,
  Tooltip,
  CircularProgress,
  CardHeader,
  CardMedia,
  CardActions,
  Collapse,
  Rating,
  Fade,
  Zoom,
  Menu,
  ListItemButton,
  ListItemAvatar,
  AvatarGroup,
  ImageListItemBar,
  FormGroup,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Skeleton,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteImageIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Warning as WarningIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  PhotoCamera as PhotoCameraIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Close,
  AddPhotoAlternate,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { productAPI, orderAPI } from '../../services/api';
import { socketService } from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

// Add these constants at the top with other constants
const STOCK_UNITS = [
  { value: 'piece', label: 'Piece' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'l', label: 'Litre' },
  { value: 'ml', label: 'Millilitre' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' }
];

// Add these reusable components at the top after imports
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      case 'shipped': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status?.toUpperCase() || 'N/A'}
      color={getStatusColor(status)}
      size="small"
      sx={{
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1
        }
      }}
    />
  );
};

const ResponsiveTable = ({ children, minWidth = 600 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      '&::-webkit-scrollbar': {
        height: '6px'
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '3px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '3px',
        '&:hover': {
          background: '#555'
        }
      }
    }}>
      <Box sx={{ minWidth }}>
        {children}
      </Box>
    </Box>
  );
};

// Add animation variants before component definitions
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const StatCard = ({ title, value, icon, change, color, image }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card sx={{ 
      height: { xs: 160, sm: 180, md: 200 },
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
      }
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 0.15
          }
        }}
      />
      <CardContent sx={{ 
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 2, sm: 2.5 }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500
            }}
          >
            {title}
          </Typography>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: `${color}25`
            }
          }}>
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: { xs: 24, sm: 28, md: 32 },
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }
            })}
          </Box>
        </Box>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            {value}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            opacity: 0.8
          }}>
            {change.startsWith('+') ? (
              <TrendingUpIcon color="success" fontSize="small" />
            ) : (
              <TrendingDownIcon color="error" fontSize="small" />
            )}
            <Typography 
              variant="body2" 
              color={change.startsWith('+') ? 'success.main' : 'error.main'}
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500
              }}
            >
              {change} from last month
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

// Add mobile navigation components
const MobileBottomNav = ({ selectedTab, handleNavigation }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
      elevation={3}
    >
      <BottomNavigation
        value={selectedTab}
        onChange={(event, newValue) => handleNavigation(newValue)}
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="dashboard"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Orders"
          value="orders"
          icon={<CartIcon />}
        />
        <BottomNavigationAction
          label="Products"
          value="products"
          icon={<InventoryIcon />}
        />
        <BottomNavigationAction
          label="More"
          value="more"
          icon={<MoreVertIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

// Add MobileMenu component definition
const MobileMenu = ({ open, onClose, menuItems, selectedTab, handleNavigation }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 280,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '16px 0 0 16px'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Menu
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={selectedTab === item.id}
              onClick={() => {
                handleNavigation(item.id);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: selectedTab === item.id ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontWeight: selectedTab === item.id ? 'bold' : 'normal',
                  color: 'text.primary'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleNavigation('profile');
              onClose();
            }}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24,
                  bgcolor: theme.palette.primary.main
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Profile" 
              primaryTypographyProps={{
                color: 'text.primary'
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'error.lighter',
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'error.main'
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                color: 'error.main',
                fontWeight: 'medium'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

function VendorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    stockUnit: 'piece', // Add this line
    image: null,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    shippedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
    lowStockItems: 0,
    topSellingProducts: [],
    recentOrders: [],
  });
  
  // Consolidated drawer state
  const [drawerState, setDrawerState] = useState({
    open: false,
    variant: 'temporary',
    width: 280,
    collapsed: false
  });

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newOrders: true,
      lowStock: true,
      priceUpdates: true,
      deliveryUpdates: true
    },
    delivery: {
      autoAssign: false,
      preferredCarriers: [],
      deliveryRadius: 10
    },
    store: {
      name: '',
      description: '',
      operatingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' }
      }
    }
  });
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImageUrl: '',
  });
  const [analyticsData, setAnalyticsData] = useState({
    salesData: [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
    ],
    categoryData: [
      { name: 'Groceries', value: 400 },
      { name: 'Produce', value: 300 },
      { name: 'Dairy', value: 300 },
      { name: 'Meat', value: 200 },
    ],
    dailyOrders: [
      { name: 'Mon', orders: 4 },
      { name: 'Tue', orders: 3 },
      { name: 'Wed', orders: 5 },
      { name: 'Thu', orders: 2 },
      { name: 'Fri', orders: 6 },
      { name: 'Sat', orders: 8 },
      { name: 'Sun', orders: 7 },
    ]
  });
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Update useEffect for responsive drawer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setDrawerState(prev => ({
          ...prev,
          variant: 'temporary',
          open: false
        }));
      } else {
        setDrawerState(prev => ({
          ...prev,
          variant: 'persistent',
          open: false // Keep drawer closed initially on desktop too
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setDrawerState(prev => ({
      ...prev,
      open: !prev.open
    }));
  };

  // Update the initial data loading
  useEffect(() => {
    // Redirect to dashboard if on root vendor path
    if (location.pathname === '/vendor') {
      navigate('/vendor/dashboard');
      return;
    }

    const initializeDashboard = async () => {
      try {
        setIsInitialLoading(true);
        await Promise.all([
          loadProducts(),
          fetchOrders(),
          fetchDashboardStats(),
          fetchCustomers()
        ]);
        setupSocketListeners();
        
        // Set active tab based on current route
        const path = location.pathname.split('/').pop();
        setSelectedTab(path || 'dashboard');
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        showSnackbar('Error loading dashboard data', 'error');
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeDashboard();
    return () => {
      socketService.disconnect();
    };
  }, [location, navigate]);

  const setupSocketListeners = () => {
    socketService.connect();
    
    socketService.subscribe('newOrder', (order) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'order',
        message: `New order #${order._id} received`,
        time: 'Just now',
        read: false
      }, ...prev]);
      fetchOrders();
      fetchDashboardStats();
    });

    socketService.subscribe('orderStatusChanged', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'delivery',
        message: `Order #${data.orderId} status updated to ${data.status}`,
        time: 'Just now',
        read: false
      }, ...prev]);
      fetchOrders();
      fetchDashboardStats();
    });

    socketService.subscribe('priceUpdate', (data) => {
      // Handle price updates
    });

    socketService.subscribe('stockUpdate', (data) => {
      // Handle stock updates
    });

    socketService.subscribe('newPromotion', (data) => {
      // Handle new promotions
    });
  };

  const loadProducts = async () => {
    try {
      setIsDataLoading(true);
      const response = await productAPI.getVendorProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      showSnackbar('Error loading products', 'error');
      setProducts([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Error fetching orders', 'error');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Calculate stats from orders and products
      const totalOrders = orders.length;
      const shippedOrders = orders.filter(order => order.status === 'shipped').length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const lowStockItems = products.filter(product => product.stock < 10).length;

      setDashboardStats({
        totalOrders,
        shippedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        monthlyRevenue: totalRevenue * 0.3, // Example calculation
        revenueChange: 12, // Example value
        lowStockItems,
        topSellingProducts: products.slice(0, 5),
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      // Extract unique customers from orders
      const uniqueCustomers = Array.from(new Set(response.data.map(order => order.customer?._id)))
        .map(customerId => {
          const order = response.data.find(order => order.customer?._id === customerId);
          return order.customer;
        })
        .filter(customer => customer); // Remove any null/undefined customers
      
      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Error fetching customers', 'error');
    }
  };

  const handleNavigation = (path) => {
    const fullPath = path === 'dashboard' ? '/vendor/dashboard' : `/vendor/dashboard/${path}`;
    navigate(fullPath);
    setSelectedTab(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setDrawerState(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        stockUnit: product.stockUnit,
        image: product.image,
        images: product.images || [],
      });
      setPreviewUrls(product.images || []);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        stockUnit: 'piece',
        image: null,
        images: [],
      });
      setPreviewUrls([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      stockUnit: 'piece',
      image: null,
      images: [],
    });
    setPreviewUrls([]);
    setImageFiles([]);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create preview URLs for the new images
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Update formData with the new image URLs
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newPreviewUrls]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      // Validate price and stock are positive numbers
      if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
        showSnackbar('Price must be greater than 0 and stock must be non-negative', 'error');
        return;
      }

      // Validate at least one image is uploaded
      if (imageFiles.length === 0) {
        showSnackbar('Please upload at least one product image', 'error');
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: parseInt(formData.stock),
        stockUnit: formData.stockUnit,
        images: imageFiles, // Pass the image files directly
        isAvailable: true,
        preparationTime: 15 // Default preparation time
      };

      console.log('Submitting product data:', productData);

      let response;
      if (selectedProduct) {
        response = await productAPI.updateProduct(selectedProduct._id, productData);
        showSnackbar('Product updated successfully', 'success');
      } else {
        response = await productAPI.createProduct(productData);
        showSnackbar('Product added successfully', 'success');
      }

      console.log('Server response:', response);

      // Clear form and close dialog
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        stockUnit: 'piece',
        images: []
      });
      setImageFiles([]);
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving product';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        showSnackbar('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon color="primary" />,
      path: '/vendor/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: <InventoryIcon color="primary" />,
      path: '/vendor/products'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <CartIcon color="primary" />,
      path: '/vendor/orders'
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <ShippingIcon color="primary" />,
      path: '/vendor/delivery'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PeopleIcon color="primary" />,
      path: '/vendor/customers'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUpIcon color="primary" />,
      path: '/vendor/analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon color="primary" />,
      path: '/vendor/settings'
    }
  ];

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      // Call your API to update profile
      showSnackbar('Profile updated successfully', 'success');
      setProfileDialog(false);
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAnalytics = () => (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      pb: 3
    }}>
      <Grid container spacing={3}>
        {/* Sales Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Trend</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Category Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Orders */}
        <Grid item xs={12}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Daily Orders</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={analyticsData.dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFooter = () => (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Your trusted partner in online retail management. We help vendors grow their business with our comprehensive platform.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              Quick Links
            </Typography>
            <List dense sx={{ color: 'white' }}>
              <ListItem>
                <ListItemText 
                  primary="Help Center" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Terms of Service" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Privacy Policy" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Email: support@example.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Phone: +1 234 567 890
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );

  const renderContent = () => {
    if (isInitialLoading) {
      return <LoadingSkeleton />;
    }

    switch (selectedTab) {
      case 'dashboard':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Hero Section */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: '200px', sm: '250px', md: '300px' },
                mb: { xs: 3, sm: 4 },
                borderRadius: { xs: 0, sm: 2 },
                overflow: 'hidden',
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                boxShadow: { xs: 'none', sm: '0 4px 20px rgba(0,0,0,0.1)' }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("/images/store-bg.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.2
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: { xs: 2, sm: 4 }
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Welcome back, {user?.name || 'Vendor'}!
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      opacity: 0.9,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    Here's what's happening with your store today
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Stats Grid */}
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ 
                mb: { xs: 3, sm: 4 },
                px: { xs: 1, sm: 2 }
              }}
            >
              {[
                {
                  title: 'Total Orders',
                  value: dashboardStats.totalOrders,
                  icon: <CartIcon />,
                  change: '+12%',
                  color: '#1b5e20',
                  image: '/images/orders-bg.jpg'
                },
                {
                  title: 'Shipped Orders',
                  value: dashboardStats.shippedOrders,
                  icon: <ShippingIcon />,
                  change: '+8%',
                  color: '#1976d2',
                  image: '/images/shipping-bg.jpg'
                },
                {
                  title: 'Pending Orders',
                  value: dashboardStats.pendingOrders,
                  icon: <WarningIcon />,
                  change: '-3%',
                  color: '#f57c00',
                  image: '/images/pending-bg.jpg'
                },
                {
                  title: 'Total Revenue',
                  value: formatCurrency(dashboardStats.totalRevenue),
                  icon: <MoneyIcon />,
                  change: '+15%',
                  color: '#9c27b0',
                  image: '/images/revenue-bg.jpg'
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Recent Orders and Top Products */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={8}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card sx={{ 
                    borderRadius: { xs: 0, sm: 2 },
                    boxShadow: { xs: 'none', sm: '0 4px 20px rgba(0,0,0,0.1)' }
                  }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                          }}
                        >
                          Recent Orders
                        </Typography>
                        <Button 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleNavigation('orders')}
                          size={isMobile ? "small" : "medium"}
                          sx={{ 
                            display: { xs: 'none', sm: 'flex' },
                            fontWeight: 500
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                      <ResponsiveTable>
                        <TableContainer>
                          <Table size={isMobile ? "small" : "medium"}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Delivery Address</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboardStats.recentOrders.map((order) => (
                                <motion.tr
                                  key={order._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <TableCell>#{order._id}</TableCell>
                                  <TableCell>
                                    <Box>
                                      <Typography variant="body2">{order.customer?.name || 'N/A'}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {order.customer?.phone || 'N/A'}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box>
                                      <Typography variant="body2">
                                        {order.deliveryAddress?.street || 'N/A'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={order.paymentMethod?.toUpperCase() || 'N/A'}
                                      color={order.paymentMethod === 'card' ? 'primary' : 'default'}
                                      size="small"
                                    />
                                  </TableCell>
                                 
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </ResponsiveTable>
                      {isMobile && (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleNavigation('orders')}
                          sx={{ mt: 2 }}
                        >
                          View All Orders
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Top Selling Products
                      </Typography>
                      <List>
                        {dashboardStats.topSellingProducts.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ListItem sx={{ 
                              px: 0,
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1
                              }
                            }}>
                              <ListItemIcon>
                                <Avatar
                                  src={product.image}
                                  variant="rounded"
                                  sx={{ 
                                    width: 50, 
                                    height: 50,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <ImageIcon />
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={product.name}
                                secondary={`${product.stock} units in stock`}
                              />
                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(product.price)}
                              </Typography>
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 'products':
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Products</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Product
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <Avatar
                            src={product.image}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          >
                            <ImageIcon />
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${product.stock} ${product.stockUnit}`}
                            color={product.stock < 10 ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(product._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 'delivery':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delivery Management</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Delivery Settings</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.delivery.autoAssign}
                              onChange={(e) => setSettings({
                                ...settings,
                                delivery: {
                                  ...settings.delivery,
                                  autoAssign: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Auto-assign deliveries"
                        />
                      </FormGroup>
                      <TextField
                        fullWidth
                        label="Delivery Radius (km)"
                        type="number"
                        value={settings.delivery.deliveryRadius}
                        onChange={(e) => setSettings({
                          ...settings,
                          delivery: {
                            ...settings.delivery,
                            deliveryRadius: e.target.value
                          }
                        })}
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Active Deliveries</Typography>
                      <List>
                        {orders.filter(order => order.status === 'shipping').map((order) => (
                          <ListItem key={order._id}>
                            <ListItemText
                              primary={`Order #${order._id}`}
                              secondary={`Delivery to: ${order.shippingAddress}`}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Store Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Store Information</Typography>
                      <TextField
                        fullWidth
                        label="Store Name"
                        value={settings.store.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: {
                            ...settings.store,
                            name: e.target.value
                          }
                        })}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Store Description"
                        multiline
                        rows={3}
                        value={settings.store.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: {
                            ...settings.store,
                            description: e.target.value
                          }
                        })}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Notification Settings</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.newOrders}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  newOrders: e.target.checked
                                }
                              })}
                            />
                          }
                          label="New Orders"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.lowStock}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  lowStock: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Low Stock Alerts"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.priceUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  priceUpdates: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Price Updates"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.deliveryUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  deliveryUpdates: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Delivery Updates"
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return renderAnalytics();

      case 'orders':
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Orders</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => {/* Handle filter */}}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={() => {/* Handle sort */}}
                  >
                    Sort
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>#{order._id}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{order.customer?.name || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.customer?.phone || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell>₹{order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <StatusChip status={order.status} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.paymentStatus?.toUpperCase() || 'N/A'}
                            color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleViewOrder(order)}
                            sx={{
                              bgcolor: '#FF6B6B',
                              '&:hover': { bgcolor: '#FF5252' }
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 'customers':
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Customers</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => {/* Handle filter */}}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={() => {/* Handle sort */}}
                  >
                    Sort
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Total Orders</TableCell>
                      <TableCell>Total Spent</TableCell>
                      <TableCell>Last Order</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => {
                      const customerOrders = orders.filter(order => order.customer?._id === customer._id);
                      const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                      const lastOrder = customerOrders[0]?.createdAt ? new Date(customerOrders[0].createdAt).toLocaleDateString() : 'N/A';

                      return (
                        <TableRow key={customer._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{ bgcolor: '#FF6B6B' }}
                              >
                                {customer.name?.charAt(0).toUpperCase() || 'C'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{customer.name || 'N/A'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Customer ID: {customer._id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{customer.email || 'N/A'}</TableCell>
                          <TableCell>{customer.phone || 'N/A'}</TableCell>
                          <TableCell>{customerOrders.length}</TableCell>
                          <TableCell>₹{totalSpent.toFixed(2)}</TableCell>
                          <TableCell>{lastOrder}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleViewCustomerDetails(customer)}
                              sx={{
                                bgcolor: '#FF6B6B',
                                '&:hover': { bgcolor: '#FF5252' }
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderProductDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#FF0000', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                />
                <FormControl sx={{ minWidth: 120, mb: 2 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.stockUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockUnit: e.target.value }))}
                    label="Unit"
                  >
                    {STOCK_UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                required
              >
                <MenuItem value="groceries">Groceries</MenuItem>
                <MenuItem value="produce">Produce</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                  <MenuItem value="bakery">Bakery</MenuItem>
                
                <MenuItem value="stallfood">Stallfood</MenuItem>
                  <MenuItem value="frozen">Frozen Foods</MenuItem>
                  <MenuItem value="snacks">Snacks</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Images
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload at least one image (JPG, PNG, or WebP format, max 5MB each)
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <AddPhotoAlternate sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Click to upload images
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      or drag and drop
                    </Typography>
              </Box>
                </Box>
              </Box>
              {formData.images.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  {formData.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                          <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                            onClick={() => handleRemoveImage(index)}
                          >
                        <Close fontSize="small" />
                          </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              sx={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#FF0000',
                '&:hover': { bgcolor: '#CC0000' },
                borderRadius: '8px',
              }}
            >
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailsOpen(true);
  };

  const renderOrderDetails = () => (
    <Dialog
      open={orderDetailsOpen}
      onClose={() => setOrderDetailsOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#FF0000', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Order Details #{selectedOrder?._id}
          </Typography>
          <IconButton onClick={() => setOrderDetailsOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedOrder && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedOrder.customer?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedOrder.customer?.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Delivery Address
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      {selectedOrder.deliveryAddress?.street || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}
                    </Typography>
                    <Typography variant="body2">
                      PIN: {selectedOrder.deliveryAddress?.zipCode || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Status:</strong>
                      <Chip
                        label={selectedOrder.paymentStatus?.toUpperCase() || 'N/A'}
                        color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      <strong>Order Status:</strong>
                      <StatusChip status={selectedOrder.status} />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Items
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product?.name || 'N/A'}</TableCell>
                            <TableCell align="right">₹{item.price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell align="center">{item.quantity || 0}</TableCell>
                            <TableCell align="right">
                              ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Total Amount:
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#FF0000', fontWeight: 600 }}>
                      ₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setOrderDetailsOpen(false)}
          sx={{ mr: 1 }}
        >
          Close
        </Button>
        {selectedOrder?.status === 'pending' && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'processing')}
              sx={{ mr: 1 }}
            >
              Mark as Processing
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'cancelled')}
              sx={{ mr: 1 }}
            >
              Cancel Order
            </Button>
          </>
        )}
        {selectedOrder?.status === 'processing' && (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'shipped')}
          >
            Mark as Shipped
          </Button>
        )}
        {selectedOrder?.status === 'shipped' && (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'delivered')}
          >
            Mark as Delivered
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderCustomerDetails = () => (
    <Dialog
      open={customerDetailsOpen}
      onClose={() => setCustomerDetailsOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#FF0000', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Customer Details
          </Typography>
          <IconButton onClick={() => setCustomerDetailsOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedCustomer && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedCustomer.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedCustomer.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Customer ID:</strong> {selectedCustomer._id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Total Orders:</strong> {orders.filter(order => order.customer?._id === selectedCustomer._id).length}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Spent:</strong> ₹{orders
                        .filter(order => order.customer?._id === selectedCustomer._id)
                        .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                        .toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>First Order:</strong> {orders
                        .filter(order => order.customer?._id === selectedCustomer._id)
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]?.createdAt
                        ? new Date(orders
                            .filter(order => order.customer?._id === selectedCustomer._id)
                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0].createdAt)
                            .toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Order:</strong> {orders
                        .filter(order => order.customer?._id === selectedCustomer._id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt
                        ? new Date(orders
                            .filter(order => order.customer?._id === selectedCustomer._id)
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt)
                            .toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Recent Orders
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders
                          .filter(order => order.customer?._id === selectedCustomer._id)
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .slice(0, 5)
                          .map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>#{order._id}</TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>₹{order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                              <TableCell>
                                <StatusChip status={order.status} />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setCustomerDetailsOpen(false);
                                    setSelectedOrder(order);
                                    setOrderDetailsOpen(true);
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setCustomerDetailsOpen(false)}
          sx={{ mr: 1 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const drawer = (
    <Box sx={{ 
      overflow: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider',
      width: drawerState.width,
      transition: theme => theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }}>
      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        minHeight: 80,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Avatar 
          src={user?.profileImage}
          sx={{ 
            width: drawerState.collapsed ? 40 : 48, 
            height: drawerState.collapsed ? 40 : 48, 
            bgcolor: 'primary.main',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => setProfileDialog(true)}
        />
        {!drawerState.collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'text.primary',
                noWrap: true, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}
            >
              {user?.name || 'Vendor'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                noWrap: true, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}
            >
              {user?.email || 'vendor@example.com'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ 
        flexGrow: 1, 
        px: drawerState.collapsed ? 1 : 2,
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={selectedTab === item.id}
              onClick={() => handleNavigation(item.id)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: drawerState.collapsed ? 1 : 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: drawerState.collapsed ? 'auto' : 40,
                color: selectedTab === item.id ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              {!drawerState.collapsed && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: selectedTab === item.id ? 'bold' : 'normal',
                    color: 'text.primary'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <ListItemButton 
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: drawerState.collapsed ? 1 : 2,
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: drawerState.collapsed ? 'auto' : 40,
            color: 'error.main'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {!drawerState.collapsed && (
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                color: 'error.main',
                fontWeight: 'medium'
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  // Add a function to toggle drawer collapse
  const handleDrawerCollapse = () => {
    setDrawerState(prev => ({
      ...prev,
      collapsed: !prev.collapsed,
      width: !prev.collapsed ? 80 : 280
    }));
  };

  const LoadingSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ height: 200, position: 'relative' }}>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={30} />
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" height={60} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" height={40} />
              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ ml: 2, width: '100%' }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Add this function to handle order status updates
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      showSnackbar(`Order status updated to ${newStatus}`, 'success');
      fetchOrders(); // Refresh orders list
      setOrderDetailsOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      showSnackbar('Error updating order status', 'error');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      overflow: 'hidden',
      pb: { xs: 7, sm: 0 } // Add padding for mobile bottom nav
    }}>
      {/* Drawer - Only show on desktop */}
      {!isMobile && (
        <Drawer
          variant={drawerState.variant}
          open={drawerState.open}
          onClose={handleDrawerToggle}
          sx={{
            width: drawerState.width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerState.width,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 1200
            }
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerState.open && !isMobile && {
            width: `calc(100% - ${drawerState.width}px)`,
            marginLeft: `${drawerState.width}px`,
          }),
          minHeight: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        {/* Top Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: 1100
          }}
        >
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {!isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              {menuItems.find(item => item.id === selectedTab)?.label || 'Dashboard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleNotificationClick}
                  size={isMobile ? "small" : "medium"}
                  sx={{ color: 'text.primary' }}
                >
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              {isMobile && (
                <IconButton 
                  onClick={() => setMobileMenuOpen(true)}
                  size="small"
                  sx={{ color: 'text.primary' }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              {!isMobile && (
                <Tooltip title="Profile">
                  <IconButton 
                    onClick={() => handleNavigation('profile')}
                    size="medium"
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box sx={{ 
          flexGrow: 1,
          width: '100%',
          bgcolor: '#f5f5f5',
          p: { xs: 1, sm: 2, md: 3 },
          overflow: 'auto',
          position: 'relative',
          zIndex: 1
        }}>
          {isDataLoading ? (
            <Box sx={{ p: 2 }}>
              <LinearProgress />
            </Box>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              {renderContent()}
            </motion.div>
          )}
        </Box>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          selectedTab={selectedTab}
          handleNavigation={handleNavigation}
        />

        {/* Mobile Menu Drawer */}
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          menuItems={menuItems}
          selectedTab={selectedTab}
          handleNavigation={handleNavigation}
        />

        {/* Dialogs and other components */}
        {renderProductDialog()}
        {renderOrderDetails()}
        {renderCustomerDetails()}
        {renderFooter()}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top',
            horizontal: 'center'
          }}
          sx={{ zIndex: 1400 }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default VendorDashboard; 