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
    image: null,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    loadProducts();
    fetchOrders();
    fetchDashboardStats();
    fetchCustomers();
    setupSocketListeners();
    
    // Set active tab based on current route
    const path = location.pathname.split('/').pop();
    setSelectedTab(path || 'dashboard');
    
    return () => {
      socketService.disconnect();
    };
  }, [location]);

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
      setLoading(true);
      const response = await productAPI.getVendorProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      showSnackbar('Error loading products', 'error');
      setProducts([]);
      setLoading(false);
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

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(`/vendor/${path}`);
    setSelectedTab(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setDrawerOpen(false);
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
        image: product.image,
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
        image: null,
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
      image: null,
    });
    setPreviewUrls([]);
    setImageFiles([]);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      showSnackbar('Please upload only JPG, PNG or WebP images', 'error');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      showSnackbar('Images must be less than 5MB each', 'error');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(file => URL.createObjectURL(file))]
    }));
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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
                height: '300px',
                mb: 4,
                borderRadius: 2,
                overflow: 'hidden',
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
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
                  p: 4
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Welcome back, {user?.name || 'Vendor'}!
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography variant="h6">
                    Here's what's happening with your store today
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Stats Cards Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  title: 'Total Orders',
                  value: dashboardStats.totalOrders,
                  icon: <CartIcon sx={{ fontSize: 40 }} />,
                  change: '+12%',
                  color: '#1b5e20',
                  image: '/images/orders-bg.jpg'
                },
                {
                  title: 'Shipped Orders',
                  value: dashboardStats.shippedOrders,
                  icon: <ShippingIcon sx={{ fontSize: 40 }} />,
                  change: '+8%',
                  color: '#1976d2',
                  image: '/images/shipping-bg.jpg'
                },
                {
                  title: 'Pending Orders',
                  value: dashboardStats.pendingOrders,
                  icon: <WarningIcon sx={{ fontSize: 40 }} />,
                  change: '-3%',
                  color: '#f57c00',
                  image: '/images/pending-bg.jpg'
                },
                {
                  title: 'Total Revenue',
                  value: formatCurrency(dashboardStats.totalRevenue),
                  icon: <MoneyIcon sx={{ fontSize: 40 }} />,
                  change: '+15%',
                  color: '#9c27b0',
                  image: '/images/revenue-bg.jpg'
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card sx={{ 
                      height: 200,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `url(${stat.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.1
                        }}
                      />
                      <CardContent sx={{ 
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" color="text.secondary">
                            {stat.title}
                          </Typography>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: 2,
                            bgcolor: `${stat.color}15`,
                            color: stat.color
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {stat.value}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {stat.change.startsWith('+') ? (
                              <TrendingUpIcon color="success" fontSize="small" />
                            ) : (
                              <TrendingDownIcon color="error" fontSize="small" />
                            )}
                            <Typography 
                              variant="body2" 
                              color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {stat.change} from last month
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Recent Orders and Top Products */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Recent Orders</Typography>
                        <Button 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleNavigation('orders')}
                        >
                          View All
                        </Button>
                      </Box>
                      <TableContainer>
                        <Table>
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
                                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={order.status}
                                    color={
                                      order.status === 'delivered' ? 'success' :
                                      order.status === 'pending' ? 'warning' :
                                      order.status === 'cancelled' ? 'error' :
                                      'default'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleNavigation(`orders/${order._id}`)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
                            label={product.stock}
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
                          <Chip
                            label={order.status?.toUpperCase() || 'N/A'}
                            color={
                              order.status === 'delivered' ? 'success' :
                              order.status === 'processing' ? 'warning' :
                              order.status === 'cancelled' ? 'error' :
                              'default'
                            }
                            size="small"
                          />
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
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
                sx={{ mb: 2 }}
              />
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
                <MenuItem value="meat">Meat</MenuItem>
                <MenuItem value="seafood">Seafood</MenuItem>
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
                      <Chip
                        label={selectedOrder.status?.toUpperCase() || 'N/A'}
                        color={
                          selectedOrder.status === 'delivered' ? 'success' :
                          selectedOrder.status === 'processing' ? 'warning' :
                          selectedOrder.status === 'cancelled' ? 'error' :
                          'default'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
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
        {selectedOrder?.status === 'processing' && (
        <Button
          variant="contained"
            color="success"
            onClick={() => {
              // Handle order status update
              setOrderDetailsOpen(false);
            }}
            sx={{
              bgcolor: '#4ECDC4',
              '&:hover': { bgcolor: '#45b7af' }
            }}
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
                                <Chip
                                  label={order.status?.toUpperCase() || 'N/A'}
                                  color={
                                    order.status === 'delivered' ? 'success' :
                                    order.status === 'processing' ? 'warning' :
                                    order.status === 'cancelled' ? 'error' :
                                    'default'
                                  }
                                  size="small"
                                />
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
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      borderRight: '1px solid',
      borderColor: 'divider'
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
            width: isDrawerCollapsed ? 40 : 48, 
            height: isDrawerCollapsed ? 40 : 48, 
            bgcolor: 'primary.main',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => setProfileDialog(true)}
        />
        {!isDrawerCollapsed && (
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
        px: isDrawerCollapsed ? 1 : 2,
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
                px: isDrawerCollapsed ? 1 : 2,
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
                minWidth: isDrawerCollapsed ? 'auto' : 40,
                color: selectedTab === item.id ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              {!isDrawerCollapsed && (
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
            px: isDrawerCollapsed ? 1 : 2,
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: isDrawerCollapsed ? 'auto' : 40,
            color: 'error.main'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && (
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

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            background: 'linear-gradient(180deg, #FF6B6B 0%, #4ECDC4 100%)',
            color: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            background: 'linear-gradient(180deg, #FF6B6B 0%, #4ECDC4 100%)',
            color: 'white',
            transition: 'transform 0.3s ease-in-out',
            transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { sm: isDrawerOpen ? `${drawerWidth}px` : 0 },
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {menuItems.find(item => item.id === selectedTab)?.label || 'Dashboard'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Notifications">
                <IconButton onClick={handleNotificationClick}>
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton onClick={() => handleNavigation('profile')}>
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
            </Box>
          </Box>
        </motion.div>

        {/* Notification Panel */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              width: 360,
              maxHeight: 400,
              mt: 1.5
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItemButton
                  key={notification.id}
                  onClick={() => handleNotificationRead(notification.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.type === 'order' ? 'primary.main' :
                                notification.type === 'stock' ? 'warning.main' :
                                notification.type === 'delivery' ? 'success.main' :
                                'grey.500'
                      }}
                    >
                      {notification.type === 'order' ? <CartIcon /> :
                       notification.type === 'stock' ? <WarningIcon /> :
                       notification.type === 'delivery' ? <ShippingIcon /> :
                       <NotificationsIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{
                      fontWeight: notification.read ? 'normal' : 'bold'
                    }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">No new notifications</Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button
              color="primary"
              onClick={() => {
                handleNotificationClose();
                handleNavigation('notifications');
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </Menu>

        {/* Main Content Area */}
        <Box sx={{ 
          flexGrow: 1,
          mb: 3,
          width: '100%'
        }}>
          {renderContent()}
        </Box>

        {/* Product Dialog */}
        {renderProductDialog()}

        {/* Order Details Dialog */}
        {renderOrderDetails()}

        {/* Customer Details Dialog */}
        {renderCustomerDetails()}

        {/* Footer */}
        {renderFooter()}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default VendorDashboard; 