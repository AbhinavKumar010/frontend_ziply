import React, { useState, useEffect } from 'react';
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
  const [drawerOpen, setDrawerOpen] = useState(true);
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
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
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
        setProfileDialogOpen(true);
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

  const renderHeader = () => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FF0000 0%, #FF3333 100%)',
        borderRadius: { xs: '0 0 16px 16px', sm: '0 0 24px 24px' },
        p: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2, sm: 3, md: 4 },
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: { xs: 1, sm: 2 },
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              Welcome back, {user?.name || 'Customer'}! 👋
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Discover amazing products and get them delivered to your doorstep
            </Typography>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,1)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#FF0000' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                '@media (max-width: 600px)': {
                  display: 'none',
                },
              }}
            >
              <img
                src="/images/delivery-illustration.svg"
                alt="Delivery"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const renderCategories = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={category.id}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  bgcolor: alpha('#FF6B6B', 0.05),
                },
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>
                {category.icon}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {category.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderStats = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Your Shopping Summary
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.5)} 100%)`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stat.title}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingUp fontSize="small" />
                {stat.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderProductCard = (product) => {
    // Get the first image URL from the product's images array or fallback to image field
    const imageUrl = product.images?.[0]?.url || product.image || '/placeholder-product.jpg';
    
    return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
          transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'grey.100' // Light grey background for missing images
          }}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
        </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              ₹{product.price}
        </Typography>
            <Button
              variant="contained" 
              color="primary"
              onClick={() => handleAddToCart(product)}
              disabled={!product.isAvailable || product.stock <= 0}
            >
              {!product.isAvailable ? 'Not Available' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Box>
        </CardContent>
    </Card>
  );
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await orderAPI.cancelOrder(orderId);
      if (response) {
        // Update the live orders list
        setLiveOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
        showSnackbar('Order cancelled successfully', 'success');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showSnackbar('Failed to cancel order', 'error');
    }
  };

  const renderLiveOrders = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping color="primary" />
          Live Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {liveOrders.map((order) => (
            <Card key={order._id} sx={{ minWidth: 280, flexShrink: 0 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Order #{order._id?.toString() || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={order.status || 'Unknown'}
                    color={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'processing' ? 'warning' :
                      order.status === 'cancelled' ? 'error' :
                      'primary'
                    }
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {order.updatedAt ? formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true }) : 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {order.items?.length || 0} items • ₹{order.total?.toFixed(2) || '0.00'}
                </Typography>
                {order.status === 'processing' && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleCancelOrder(order._id)}
                    sx={{ mt: 1 }}
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderTrendingProducts = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          Trending Now
        </Typography>
        <Grid container spacing={2}>
          {trendingProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderProductCard(product)}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRecommendations = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Favorite color="primary" />
          Recommended for You
        </Typography>
        <Grid container spacing={2}>
          {recommendations.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderProductCard(product)}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCart = () => (
    <Dialog
      open={cartOpen}
      onClose={() => setCartOpen(false)}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Shopping Cart</Typography>
          <IconButton onClick={() => setCartOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {cart.items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ShoppingCart sx={{ fontSize: 48, color: '#FF0000', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <Typography>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          sx={{ color: '#FF0000' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          sx={{ color: '#FF0000' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" sx={{ color: '#FF0000', fontWeight: 600 }}>
              ₹{cart.total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
            disabled={cart.items.length === 0}
            sx={buttonStyles}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        setSnackbar({
          open: true,
          message: 'Please select a delivery address',
          severity: 'error'
        });
        return;
      }

      if (!paymentMethod) {
        setSnackbar({
          open: true,
          message: 'Please select a payment method',
          severity: 'error'
        });
        return;
      }

      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        vendor: cart.items[0]?.vendor, // Assuming all items are from the same vendor
        deliveryAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode
        },
        paymentMethod: paymentMethod.toLowerCase(), // Ensure lowercase
        specialInstructions: settings.delivery.instructions || '',
        totalAmount: cart.total,
        status: 'pending',
        paymentStatus: 'pending'
      };

      // Create order
      const response = await orderAPI.createOrder(orderData);
      
      if (response) {
        // Clear cart after successful order
      setCart({ items: [], total: 0 });
        setCheckoutOpen(false);
        setOrderDetails(response.data);
        setOrderSuccessOpen(true);
      showSnackbar('Order placed successfully!', 'success');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to place order. Please try again.',
        severity: 'error'
      });
    }
  };

  const renderCheckout = () => (
    <Dialog
      open={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Checkout</Typography>
          <IconButton onClick={() => setCheckoutOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#FF0000', fontWeight: 600 }}>
                Delivery Address
              </Typography>
              {selectedAddress ? (
                <Card sx={{ p: 2, mb: 2, border: '1px solid #FF0000' }}>
                  <Typography variant="subtitle1">
                    {selectedAddress.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setAddressDialogOpen(true)}
                    sx={{ mt: 1, color: '#FF0000' }}
                  >
                    Change Address
                  </Button>
                </Card>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setAddressDialogOpen(true)}
                  startIcon={<LocationOn />}
                  sx={{ mb: 2, borderColor: '#FF0000', color: '#FF0000' }}
                >
                  Add Delivery Address
                </Button>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#FF0000', fontWeight: 600 }}>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio sx={{ color: '#FF0000' }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Money sx={{ color: '#FF0000' }} />
                        <Typography>Cash on Delivery</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio sx={{ color: '#FF0000' }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard sx={{ color: '#FF0000' }} />
                        <Typography>Credit/Debit Card</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF0000', fontWeight: 600 }}>
              Order Summary
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h6" sx={{ color: '#FF0000', fontWeight: 600 }}>
              ₹{cart.total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePlaceOrder}
            disabled={!selectedAddress}
            sx={buttonStyles}
          >
            Place Order
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );

  const renderOrderSuccess = () => (
    <Dialog
      open={orderSuccessOpen}
      onClose={() => setOrderSuccessOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleOutline sx={{ fontSize: 64, color: '#FF0000', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your order has been placed and will be delivered soon.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#FF0000', fontWeight: 600 }}>
              Order Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {orderDetails?.orderId || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount: ₹{orderDetails?.total?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment Method: {orderDetails?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setOrderSuccessOpen(false)}
            sx={{
              mt: 4,
              ...buttonStyles,
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderProfileDialog = () => (
    <Dialog
      open={profileDialogOpen}
      onClose={() => setProfileDialogOpen(false)}
      maxWidth="sm"
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Profile</Typography>
          <IconButton onClick={() => setProfileDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#FF0000',
              fontSize: '3rem',
              mb: 2,
              mx: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {user?.name || 'Customer'}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {user?.email || 'No email provided'}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={user?.name || ''}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF0000',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FF0000',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderSettingsDialog = () => (
    <Dialog
      open={settingsDialogOpen}
      onClose={() => setSettingsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={() => setSettingsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Preferences
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.orderUpdates}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      orderUpdates: e.target.checked
                    }
                  }))}
                />
              }
              label="Order Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.promotions}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      promotions: e.target.checked
                    }
                  }))}
                />
              }
              label="Promotions"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.deliveryUpdates}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      deliveryUpdates: e.target.checked
                    }
                  }))}
                />
              }
              label="Delivery Updates"
            />
          </FormGroup>
        </Box>
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Delivery Preferences
          </Typography>
          <TextField
            fullWidth
            label="Preferred Delivery Time"
            value={settings.delivery.preferredTime}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              delivery: {
                ...prev.delivery,
                preferredTime: e.target.value
              }
            }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Delivery Instructions"
            value={settings.delivery.instructions}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              delivery: {
                ...prev.delivery,
                instructions: e.target.value
              }
            }))}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            // Here you would typically save the settings
            showSnackbar('Settings saved successfully', 'success');
            setSettingsDialogOpen(false);
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderNotificationsDialog = () => (
    <Dialog
      open={notificationsDialogOpen}
      onClose={() => setNotificationsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={() => setNotificationsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );

  const handleAddressSelect = (address) => {
    try {
    setSelectedAddress(address);
    setDeliveryAddress(`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`);
    setAddressDialogOpen(false);
      showSnackbar('Delivery address selected successfully', 'success');
    } catch (error) {
      console.error('Error selecting address:', error);
      showSnackbar('Failed to select address', 'error');
    }
  };

  const handleAddAddress = (newAddress) => {
    try {
      if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
        showSnackbar('Please fill in all address fields', 'error');
        return;
      }

    const addressToAdd = {
      id: addresses.length + 1,
      ...newAddress,
      isDefault: addresses.length === 0 // Make first address default
    };

      setAddresses(prev => [...prev, addressToAdd]);
      
      // If this is the first address, select it automatically
      if (addresses.length === 0) {
        setSelectedAddress(addressToAdd);
        setDeliveryAddress(`${addressToAdd.street}, ${addressToAdd.city}, ${addressToAdd.state} - ${addressToAdd.zipCode}`);
      }

    setNewAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
      
    showSnackbar('Address added successfully', 'success');
    } catch (error) {
      console.error('Error adding address:', error);
      showSnackbar('Failed to add address', 'error');
    }
  };

  const handleSetDefaultAddress = (addressId) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
      }));
      
      setAddresses(updatedAddresses);
      
      // If the default address is not currently selected, select it
      const defaultAddress = updatedAddresses.find(addr => addr.id === addressId);
      if (defaultAddress && (!selectedAddress || selectedAddress.id !== addressId)) {
        setSelectedAddress(defaultAddress);
        setDeliveryAddress(`${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.zipCode}`);
      }
      
    showSnackbar('Default address updated', 'success');
    } catch (error) {
      console.error('Error setting default address:', error);
      showSnackbar('Failed to update default address', 'error');
    }
  };

  const handleDeleteAddress = (addressId) => {
    try {
    if (addresses.length <= 1) {
      showSnackbar('Cannot delete the only address', 'error');
      return;
    }

      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);

      // If the deleted address was selected, select the default address instead
      if (selectedAddress && selectedAddress.id === addressId) {
        const defaultAddress = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        setSelectedAddress(defaultAddress);
        setDeliveryAddress(`${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.zipCode}`);
      }

    showSnackbar('Address deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting address:', error);
      showSnackbar('Failed to delete address', 'error');
    }
  };

  const renderAddressDialog = () => (
    <Dialog
      open={addressDialogOpen}
      onClose={() => setAddressDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Manage Addresses</Typography>
          <IconButton onClick={() => setAddressDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={newAddress.street}
                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => handleAddAddress(newAddress)}
                disabled={!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode}
                sx={{
                  bgcolor: '#FF6B6B',
                  '&:hover': { bgcolor: '#4ECDC4' }
                }}
              >
                Add Address
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Saved Addresses
        </Typography>
        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid item xs={12} key={address.id}>
              <Card
                sx={{
                  p: 2,
                  border: selectedAddress?.id === address.id ? '2px solid #FF6B6B' : '1px solid',
                  borderColor: selectedAddress?.id === address.id ? '#FF6B6B' : 'divider',
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">
                    {address.street}
                  </Typography>
                  {address.isDefault && (
                    <Chip
                      label="Default"
                      size="small"
                      color="primary"
                      sx={{ bgcolor: '#FF6B6B' }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {address.city}, {address.state} - {address.zipCode}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => handleAddressSelect(address)}
                    sx={{ color: '#FF6B6B' }}
                  >
                    Select
                  </Button>
                  {!address.isDefault && (
                    <Button
                      size="small"
                      onClick={() => handleSetDefaultAddress(address.id)}
                      sx={{ color: '#4ECDC4' }}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#FF0000',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          '@media (max-width: 600px)': {
            '& .MuiToolbar-root': {
              padding: '0 8px',
            },
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ 
              mr: 2, 
              color: 'white',
              '@media (max-width: 600px)': {
                mr: 1,
              },
            }}
          >
            <Menu />
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            '@media (max-width: 600px)': {
              '& .MuiTypography-h5': {
                fontSize: '1.25rem',
              },
            },
          }}>
            <ShoppingBag sx={{ 
              mr: 1, 
              fontSize: 28, 
              color: 'white',
              '@media (max-width: 600px)': {
                fontSize: 24,
              },
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
            }}
          >
            ZIPLY
          </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '@media (max-width: 600px)': {
              gap: '4px',
            },
          }}>
          <IconButton
            color="inherit"
            onClick={() => setCartOpen(true)}
              sx={{ 
                color: 'white', 
                mr: 1,
                '@media (max-width: 600px)': {
                  mr: 0,
                  padding: '8px',
                },
              }}
          >
            <Badge badgeContent={cart.items.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => setNotificationsDialogOpen(true)}
              sx={{ 
                color: 'white', 
                mr: 1,
                '@media (max-width: 600px)': {
                  mr: 0,
                  padding: '8px',
                },
              }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
            <IconButton 
              onClick={() => setProfileDialogOpen(true)}
              sx={{
                '@media (max-width: 600px)': {
                  padding: '8px',
                },
              }}
            >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                  bgcolor: 'white',
                  color: '#FF0000',
                fontWeight: 600,
                  '@media (max-width: 600px)': {
                    width: 28,
                    height: 28,
                  },
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
          </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: { xs: '100%', sm: 280 },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 280 },
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #FF0000 0%, #FF3333 100%)',
            color: 'white',
            borderRight: 'none',
            mt: '64px',
            height: 'calc(100% - 64px)',
            '@media (max-width: 600px)': {
              mt: '56px',
              height: 'calc(100% - 56px)',
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.2rem',
                mr: 2,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || 'Customer'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={item.onClick}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: { xs: '56px', sm: '64px' },
          ml: { xs: 0, sm: drawerOpen ? '280px' : 0 },
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          '@media (max-width: 600px)': {
            padding: '16px',
          },
        }}
      >
        {renderHeader()}
        <Container 
          maxWidth="lg" 
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
          }}
        >
          {renderCategories()}
          {renderStats()}
          {renderLiveOrders()}
          {renderTrendingProducts()}
          {renderRecommendations()}

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderProductCard(product)}
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
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