import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Rating,
  Chip,
  AppBar,
  Toolbar,
  Badge,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CardActions,
  Switch,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormGroup,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  Home,
  History,
  Person,
  Settings,
  Notifications,
  Logout,
  Favorite,
  FavoriteBorder,
  Close,
  Add,
  Remove,
  Delete,
  Star,
  LocalShipping,
  AttachMoney,
  People,
  Inventory,
  Category,
  FilterList,
  Sort,
  LocationOn,
  Store,
  LocalOffer,
  Timer,
  MyLocation,
  CheckCircle,
  Info,
  Payment,
  ViewList,
  GridView,
  TrendingUp,
  CreditCard,
  Money,
  CheckCircleOutline,
  ShoppingBag,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI, orderAPI, socketService } from '../../services/api';
import { addToCart } from '../../store/slices/cartSlice';
import { logout } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { alpha } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// Define button styles
const buttonStyles = {
  mt: 2,
  bgcolor: '#FF0000',
  color: 'white',
  '&:hover': {
    bgcolor: '#CC0000',
  },
  '&:disabled': {
    bgcolor: '#FFCCCC',
  }
};

// Add these new styles at the top after imports
const styles = {
  gradientBackground: {
    background: 'linear-gradient(135deg,rgb(191, 50, 50) 0%, #FF6B6B 100%)',
    borderRadius: { xs: '0', sm: '0 0 24px 24px' },
    boxShadow: '0 4px 20px rgba(255, 0, 0, 0.2)',
    minHeight: { xs: '140px', sm: '180px', md: '220px' },
    display: 'flex',
    alignItems: 'center',
    padding: { xs: 1.5, sm: 2, md: 3 }
  },
  cardHover: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.15)' },
    }
  },
  responsiveGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(1, 1fr)',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)'
    },
    gap: { xs: 1.5, sm: 2, md: 2.5 },
    width: '100%',
    mt: { xs: 1.5, sm: 2, md: 3 }
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: { xs: '8px', sm: '12px' },
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.15)' },
    }
  },
  categoryCard: {
    p: { xs: 1, sm: 1.5 },
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: { xs: '8px', sm: '12px' },
    transition: 'all 0.3s ease',
    height: { xs: '80px', sm: '100px', md: '120px' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-4px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 8px 24px rgba(0,0,0,0.15)' },
      bgcolor: 'rgba(255, 107, 107, 0.05)',
    }
  },
  searchBar: {
    width: '100%',
    maxWidth: { xs: '100%', sm: '500px', md: '600px' },
    mx: 'auto',
    mt: { xs: 1.5, sm: 2, md: 2.5 },
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      borderRadius: { xs: '6px', sm: '8px' },
      bgcolor: 'rgba(255,255,255,0.95)',
      transition: 'all 0.3s ease',
      height: { xs: '40px', sm: '44px' },
      '&:hover': {
        bgcolor: 'rgba(255,255,255,1)',
        transform: { xs: 'none', sm: 'translateY(-2px)' },
      },
      '&.Mui-focused': {
        bgcolor: 'white',
        transform: { xs: 'none', sm: 'translateY(-2px)' },
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }
    },
    '& .MuiOutlinedInput-input': {
      fontSize: { xs: '0.875rem', sm: '1rem' },
      padding: { xs: '8px 12px', sm: '10px 14px' }
    }
  },
  mobileNav: {
    display: { xs: 'flex', md: 'none' },
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: 'white',
    borderTop: '1px solid',
    borderColor: 'divider',
    zIndex: 1000,
    px: 1,
    py: 0.5,
    justifyContent: 'space-around',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    height: '56px'
  },
  dialogPaper: {
    borderRadius: { xs: 0, sm: '16px' },
    margin: { xs: 0, sm: 2 },
    maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' },
    width: { xs: '100%', sm: '600px' },
    maxWidth: { xs: '100%', sm: '90%', md: '600px' }
  },
  cartItem: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 1.5, sm: 2 },
    padding: { xs: 1.5, sm: 2 },
    borderBottom: '1px solid',
    borderColor: 'divider'
  },
  cartItemImage: {
    width: { xs: '100%', sm: '80px' },
    height: { xs: '160px', sm: '80px' },
    objectFit: 'cover',
    borderRadius: { xs: '6px', sm: '4px' }
  },
  cartItemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5
  },
  cartItemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mt: { xs: 1.5, sm: 0 }
  }
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currentTab, setCurrentTab] = useState('home');
  const [notifications, setNotifications] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [],
    rating: 0,
    availability: 'all'
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      isDefault: true
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      deliveryUpdates: true
    },
    delivery: {
      preferredTime: '',
      instructions: ''
    }
  });
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [profileDialog, setProfileDialog] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const matches = useMediaQuery('(max-width:600px)');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false
    },
    savedAddresses: [],
    paymentMethods: []
  });
  const productsRef = useRef(null);

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }

    let isComponentMounted = true;

    const initializeDashboard = async () => {
      try {
        // First fetch all data
        await Promise.all([
          fetchProducts(),
          fetchLiveOrders(),
          fetchTrendingProducts(),
          fetchRecommendations()
        ]);

        // Then setup socket connection with retry mechanism
        if (isComponentMounted) {
          await setupSocketListeners();
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (isComponentMounted) {
          showSnackbar('Failed to initialize dashboard', 'error');
        }
      }
    };

    initializeDashboard();

    return () => {
      isComponentMounted = false;
      if (socketService.socket?.connected) {
        socketService.disconnect();
      }
    };
  }, [user, navigate]);

  useEffect(() => {
    // Set default address on component mount
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
      setDeliveryAddress(`${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.zipCode}`);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      console.log('Products data:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const setupSocketListeners = async () => {
    try {
      // Disconnect existing connection if any
      if (socketService.socket?.connected) {
        socketService.disconnect();
      }

      // Wait for connection to be established
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket connection timeout'));
        }, 5000);

        socketService.connect();
        
        socketService.socket.on('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        socketService.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      // Setup listeners only after successful connection
      socketService.subscribe('orderStatusChanged', (data) => {
        setLiveOrders(prev => prev.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status }
            : order
        ));
        showSnackbar(`Order #${data.orderId} status updated to ${data.status}`, 'info');
      });

      socketService.subscribe('newNotification', (notification) => {
        setNotifications(prev => [{
          ...notification,
          time: 'Just now',
          read: false
        }, ...prev]);
        showSnackbar('New notification received', 'info');
      });

      socketService.subscribe('priceUpdate', (data) => {
        setProducts(prev => prev.map(product =>
          product._id === data.productId
            ? { ...product, price: data.newPrice }
            : product
        ));
        showSnackbar(`Price updated for ${data.productName}`, 'info');
      });

      socketService.subscribe('stockUpdate', (data) => {
        setProducts(prev => prev.map(product =>
          product._id === data.productId
            ? { ...product, stock: data.newStock }
            : product
        ));
        if (data.newStock < 10) {
          showSnackbar(`Low stock alert for ${data.productName}`, 'warning');
        }
      });

      socketService.subscribe('newPromotion', (promotion) => {
        showSnackbar(`New promotion: ${promotion.title}`, 'success');
      });

    } catch (error) {
      console.error('Socket connection failed:', error);
      showSnackbar('Failed to establish real-time connection', 'error');
    }
  };

  const fetchLiveOrders = async () => {
    try {
      const response = await orderAPI.getLiveOrders();
      if (response?.data) {
      setLiveOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching live orders:', error);
      showSnackbar('Failed to fetch live orders', 'error');
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const response = await productAPI.getAllProducts(); // Temporarily use getAllProducts
      if (response?.data) {
        setTrendingProducts(response.data.slice(0, 4)); // Show first 4 products as trending
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
      showSnackbar('Failed to fetch trending products', 'error');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await productAPI.getAllProducts(); // Temporarily use getAllProducts
      if (response?.data) {
        setRecommendations(response.data.slice(4, 8)); // Show next 4 products as recommendations
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      showSnackbar('Failed to fetch recommendations', 'error');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 5);
        return newHistory;
      });
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddToCart = (product) => {
    try {
      const existingItem = cart.items.find(item => item.id === product._id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = cart.items.map(item =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
        
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        
        setCart({
          items: updatedItems,
          total: updatedTotal
        });
      } else {
        // Add new item
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
          vendor: product.vendor
        };
        
        const updatedItems = [...cart.items, newItem];
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        
        setCart({
          items: updatedItems,
          total: updatedTotal
        });
      }
      
      showSnackbar('Product added to cart', 'success');
      setCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('Failed to add product to cart', 'error');
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        handleRemoveFromCart(productId);
        return;
      }

      const updatedItems = cart.items.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      setCart({
        items: updatedItems,
        total: updatedTotal
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      showSnackbar('Failed to update quantity', 'error');
    }
  };

  const handleRemoveFromCart = (productId) => {
    try {
      const updatedItems = cart.items.filter(item => item.id !== productId);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      setCart({
        items: updatedItems,
        total: updatedTotal
      });
      
      showSnackbar('Product removed from cart', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
      showSnackbar('Failed to remove product from cart', 'error');
    }
  };

  const handleToggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const categories = [
    { id: 'fruits', name: 'Fruits & Vegetables', icon: '🍎' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'burger', name: 'Stallfood', icon: '🍕'},
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'pantry', name: 'Pantry', icon: '🥫' },
    { id: 'frozen', name: 'Frozen Foods', icon: '❄️' },
    { id: 'snacks', name: 'Snacks', icon: '🍪' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
  ];

  const menuItems = [
    { 
      icon: <Home />, 
      text: 'Home',
      onClick: () => {
        setCurrentTab('home');
        setDrawerOpen(false);
      }
    },
    { 
      icon: <History />, 
      text: 'Order History',
      onClick: () => {
        navigate('/customer/orders');
        setDrawerOpen(false);
      }
    },
    { 
      icon: <Person />, 
      text: 'Profile',
      onClick: () => {
        setProfileDialog(true);
        setDrawerOpen(false);
      }
    },
    { 
      icon: <Settings />, 
      text: 'Settings',
      onClick: () => {
        setSettingsDialogOpen(true);
        setDrawerOpen(false);
      }
    },
    {
      icon: <LocationOn />,
      text: 'Addresses',
      onClick: () => {
        setAddressDialogOpen(true);
        setDrawerOpen(false);
      }
    },
    {
      icon: <Notifications />,
      text: 'Notifications',
      onClick: () => {
        setNotificationsDialogOpen(true);
        setDrawerOpen(false);
      }
    },
    {
      icon: <Logout />,
      text: 'Logout',
      onClick: () => {
        handleLogout();
        setDrawerOpen(false);
      }
    }
  ];

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      change: '+5%',
      color: '#1b5e20',
    },
    {
      title: 'Active Orders',
      value: orders.filter(o => o.status === 'PROCESSING').length.toString(),
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      change: '+2%',
      color: '#1976d2',
    },
    {
      title: 'Total Spent',
      value: `₹${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      change: '+15%',
      color: '#9c27b0',
    },
    {
      title: 'Saved Items',
      value: favorites.length.toString(),
      icon: <Favorite sx={{ fontSize: 40 }} />,
      change: '+3%',
      color: '#f57c00',
    },
  ];

  const scrollToProducts = (category) => {
    setSelectedCategory(category);
    productsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const renderHeader = () => (
    <Box sx={styles.gradientBackground}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: { xs: 1, sm: 2 },
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                  lineHeight: 1.2
                }}
              >
                Welcome back, {user?.name || 'Customer'}! 👋
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  maxWidth: '600px'
                }}
              >
                Discover amazing products and get them delivered to your doorstep
              </Typography>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                sx={styles.searchBar}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#FF0000', fontSize: '1.5rem' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  '@media (max-width: 900px)': {
                    display: 'none',
                  },
                }}
              >
                <img
                  src="/images/delivery-illustration.svg"
                  alt="Delivery"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const renderCategories = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      {categories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            variant="outlined"
            onClick={() => scrollToProducts(category.id)}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              textTransform: 'none',
              borderColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <Box sx={{ 
              width: 24,
              height: 24,
              mr: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {category.icon}
            </Box>
            {category.name}
          </Button>
        </motion.div>
      ))}
    </Box>
  );

  const renderStats = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {stat.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {stat.change}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5
          }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {stat.icon}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );

  const renderLiveOrders = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
        Live Orders
      </Typography>
      {liveOrders.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {order.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {order.status}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );

  const renderTrendingProducts = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
        Trending Products
      </Typography>
      {trendingProducts.map((product) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.price}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );

  const renderRecommendations = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
        Recommendations
      </Typography>
      {recommendations.map((product) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.price}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );

  const renderProducts = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      mt: 2
    }}>
      {products.map((product) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {product.price}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f8f9fa'
    }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#FF0000',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          '& .MuiToolbar-root': {
            minHeight: { xs: '48px', sm: '56px' },
            px: { xs: 1, sm: 2 }
          }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '48px', sm: '56px' } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              mr: { xs: 0.5, sm: 1 },
              color: 'white',
              display: { xs: 'flex', md: 'none' },
              padding: { xs: '4px', sm: '8px' }
            }}
          >
            <Menu sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
          }}>
            <ShoppingBag sx={{ 
              mr: 0.5, 
              fontSize: { xs: 20, sm: 24 }, 
              color: 'white'
            }} />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                color: 'white',
                fontWeight: 700,
                letterSpacing: '1px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              ZIPLY
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 0.25, sm: 0.5 }
          }}>
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{ 
                color: 'white',
                padding: { xs: '4px', sm: '8px' }
              }}
            >
              <Badge badgeContent={cart.items.length} color="error">
                <ShoppingCart sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setNotificationsDialogOpen(true)}
              sx={{ 
                color: 'white',
                padding: { xs: '4px', sm: '8px' }
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <Notifications sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
            <IconButton 
              onClick={() => setProfileDialog(true)}
              sx={{
                padding: { xs: '4px', sm: '8px' }
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 24, sm: 28 },
                  height: { xs: 24, sm: 28 },
                  bgcolor: 'white',
                  color: '#FF0000',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' }, // Show only on mobile
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 320 },
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, rgb(191, 50, 50) 0%, #FF6B6B 100%)',
            color: 'rgba(245, 67, 67, 0.8)',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
            transition: 'transform 0.3s ease-in-out',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none'
            }
          },
        }}
      >
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                {user?.name || 'Customer'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            px: 2,
            py: 3,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
              },
            },
          }}>
            <List>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    button
                    onClick={item.onClick}
                    sx={{
                      borderRadius: '12px',
                      mb: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(4px)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'white', 
                      minWidth: 40,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: 'white'
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: 'white'
                }}
              />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' }, // Show only on desktop
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, rgb(191, 50, 50) 0%, #FF6B6B 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none'
            }
          },
        }}
      >
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                {user?.name || 'Customer'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            px: 2,
            py: 3,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
              },
            },
          }}>
            <List>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    button
                    onClick={item.onClick}
                    sx={{
                      borderRadius: '12px',
                      mb: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(4px)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'white', 
                      minWidth: 40,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: 'white'
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: 'white'
                }}
              />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: { xs: '48px', sm: '56px' },
          mb: { xs: '56px', md: 0 },
          ml: { xs: 0, md: drawerOpen ? '320px' : 0 },
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          bgcolor: '#f8f9fa',
          overflowX: 'hidden',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {renderHeader()}
        <Container 
          maxWidth="lg" 
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} md={8}>
              {renderCategories()}
              {renderProducts()}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderStats()}
              {renderLiveOrders()}
              {renderTrendingProducts()}
              {renderRecommendations()}
            </Grid>
          </Grid>
        </Container>
        <MobileBottomNav />
      </Box>

      {renderProfileDialog()}
      {renderSettingsDialog()}
      {renderNotificationsDialog()}
      {renderAddressDialog()}
      {renderCart()}
      {renderCheckout()}
      {renderOrderSuccess()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerDashboard; 