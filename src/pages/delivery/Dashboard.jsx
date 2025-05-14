import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Badge,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalShipping as DeliveryIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  DirectionsBike as BikeIcon,
  Map as MapIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { deliveryAPI } from '../../services/api';

const drawerWidth = 280;

const styles = {
  gradientBackground: {
    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
    borderRadius: { xs: '0 0 16px 16px', sm: '0 0 24px 24px' },
    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
  },
  cardHover: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.15)' },
    }
  },
  statsCard: {
    height: '100%',
    borderRadius: { xs: '12px', sm: '16px' },
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.15)' },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
    }
  },
  deliveryCard: {
    borderRadius: { xs: '12px', sm: '16px' },
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px)' },
      boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.15)' },
    }
  },
  mobileNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: { xs: 'flex', sm: 'none' },
    borderTop: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  }
};

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [profileDialog, setProfileDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [notificationsDialog, setNotificationsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [notifications, setNotifications] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    completed: 0,
    inProgress: 0,
    earnings: 0
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Delivery Boy',
    email: user?.email || 'delivery@ziply.com',
    phone: user?.phone || '+1234567890',
    address: user?.address || '123 Delivery St',
    vehicleNumber: user?.vehicleNumber || 'DL-1234'
  });
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoAccept: false,
    deliveryRadius: 10
  });

  useEffect(() => {
    // Set active tab based on current route
    const path = location.pathname.split('/').pop();
    setSelectedTab(path || 'dashboard');
    
    // Fetch initial data
    fetchActiveDeliveries();
    fetchStats();
    setupNotifications();
  }, [location]);

  const fetchActiveDeliveries = async () => {
    try {
      const response = await deliveryAPI.getActiveDeliveries();
      setActiveDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching active deliveries:', error);
      showSnackbar('Failed to fetch active deliveries', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await deliveryAPI.getDeliveryStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showSnackbar('Failed to fetch delivery stats', 'error');
    }
  };

  const setupNotifications = () => {
    // Setup WebSocket connection for real-time notifications
    // This is a placeholder - implement actual WebSocket connection
    const mockNotifications = [
      { id: 1, message: 'New delivery request', time: '2 mins ago' },
      { id: 2, message: 'Order #123 has been picked up', time: '5 mins ago' }
    ];
    setNotifications(mockNotifications);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(`/delivery/${path}`);
    setSelectedTab(path);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await deliveryAPI.updateProfile(profileData);
      showSnackbar('Profile updated successfully', 'success');
      setProfileDialog(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      await deliveryAPI.updateSettings(settings);
      showSnackbar('Settings updated successfully', 'success');
      setSettingsDialog(false);
    } catch (error) {
      console.error('Error updating settings:', error);
      showSnackbar('Failed to update settings', 'error');
    }
  };

  const handleNavigateToDelivery = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Active Deliveries', icon: <DeliveryIcon />, path: 'active' },
    { text: 'Delivery History', icon: <HistoryIcon />, path: 'history' },
    { text: 'Profile', icon: <PersonIcon />, path: 'profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: 'settings' }
  ];

  const renderMobileNavigation = () => (
    <Paper 
      sx={styles.mobileNav} 
      elevation={3}
    >
      <BottomNavigation
        value={selectedTab}
        onChange={(event, newValue) => {
          handleNavigation(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction 
          label="Home" 
          value="dashboard" 
          icon={<HomeIcon />} 
        />
        <BottomNavigationAction 
          label="Deliveries" 
          value="active" 
          icon={<DeliveryIcon />} 
        />
        <BottomNavigationAction 
          label="History" 
          value="history" 
          icon={<HistoryIcon />} 
        />
        <BottomNavigationAction 
          label="Profile" 
          value="profile" 
          icon={<PersonIcon />} 
        />
      </BottomNavigation>
    </Paper>
  );

  const renderProfileDialog = () => (
    <Dialog 
      open={profileDialog} 
      onClose={() => setProfileDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        Edit Profile
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            fullWidth
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          />
          <TextField
            label="Vehicle Number"
            fullWidth
            value={profileData.vehicleNumber}
            onChange={(e) => setProfileData({ ...profileData, vehicleNumber: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={() => setProfileDialog(false)}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleProfileUpdate}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSettingsDialog = () => (
    <Dialog 
      open={settingsDialog} 
      onClose={() => setSettingsDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        Settings
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                />
              }
              label="Enable Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                />
              }
              label="Dark Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoAccept}
                  onChange={(e) => setSettings({ ...settings, autoAccept: e.target.checked })}
                />
              }
              label="Auto Accept Deliveries"
            />
          </FormGroup>
          <TextField
            label="Delivery Radius (km)"
            type="number"
            fullWidth
            value={settings.deliveryRadius}
            onChange={(e) => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
            InputProps={{ inputProps: { min: 1, max: 50 } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={() => setSettingsDialog(false)}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSettingsUpdate}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderNotificationsDialog = () => (
    <Dialog
      open={notificationsDialog}
      onClose={() => setNotificationsDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        Notifications
      </DialogTitle>
      <DialogContent>
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No new notifications" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={() => setNotificationsDialog(false)}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add a hero section with greeting and today's summary
  const renderHeroSection = () => (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          mb: 4,
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Hello, {user?.name?.split(' ')[0] || 'Delivery Hero'}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Here's your delivery summary for today:
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.todayDeliveries}</Typography>
            <Typography variant="caption">Today</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.completed}</Typography>
            <Typography variant="caption">Completed</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.inProgress}</Typography>
            <Typography variant="caption">In Progress</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>₹{stats.earnings}</Typography>
            <Typography variant="caption">Earnings</Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );

  // Define drawer content
  const drawer = (
    <Box sx={{ 
      width: drawerWidth,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      {/* Drawer Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48,
            bgcolor: 'primary.main'
          }}
        >
          {user?.name?.charAt(0) || 'D'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name || 'Delivery Person'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email || 'delivery@ziply.com'}
          </Typography>
        </Box>
      </Box>

      {/* Drawer Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding
            sx={{ 
              mb: 0.5,
              '& .MuiListItemButton-root': {
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              },
            }}
          >
            <ListItemButton
              selected={selectedTab === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: selectedTab === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Drawer Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const renderStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        { title: 'Today\'s Deliveries', value: stats.todayDeliveries, color: 'primary.main', icon: <DeliveryIcon /> },
        { title: 'Completed', value: stats.completed, color: 'success.main', icon: <CheckCircleIcon /> },
        { title: 'In Progress', value: stats.inProgress, color: 'warning.main', icon: <PendingIcon /> },
        { title: 'Earnings', value: `₹${stats.earnings}`, color: 'info.main', icon: <BikeIcon /> }
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    mr: 2
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography 
                    color="textSecondary"
                    sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    color: stat.color,
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  const renderActiveDeliveries = () => (
    <>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <DeliveryIcon color="primary" />
        Active Deliveries
      </Typography>

      <Grid container spacing={2}>
        {activeDeliveries.map((delivery, index) => (
          <Grid item xs={12} key={delivery._id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={styles.deliveryCard}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    gap: 2,
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={delivery.customer?.avatar}
                        sx={{ 
                          width: { xs: 40, sm: 50 }, 
                          height: { xs: 40, sm: 50 },
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        {delivery.customer?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6"
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600
                          }}
                        >
                          Order #{delivery._id}
                        </Typography>
                        <Typography 
                          color="textSecondary"
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                          }}
                        >
                          {delivery.customer?.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={delivery.status}
                      color={delivery.status === 'DELIVERED' ? 'success' : 'warning'}
                      icon={delivery.status === 'DELIVERED' ? <CheckCircleIcon /> : <PendingIcon />}
                      sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    gap: 1
                  }}>
                    <LocationIcon sx={{ color: 'text.secondary' }} />
                    <Typography 
                      color="textSecondary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '0.9rem' }
                      }}
                    >
                      {delivery.deliveryAddress}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {new Date(delivery.createdAt).toLocaleString()}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleNavigation(`delivery/${delivery._id}`)}
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<MapIcon />}
                      onClick={() => handleNavigateToDelivery(delivery.deliveryAddress)}
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Navigate
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)' }}>
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
            width: drawerWidth 
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
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { sm: isDrawerOpen ? `${drawerWidth}px` : 0 },
          mb: { xs: '56px', sm: 0 },
          overflow: 'auto',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
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
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Delivery Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <IconButton
                  onClick={() => setNotificationsDialog(true)}
                  sx={{ color: 'primary.main', position: 'relative' }}
                >
                  <Badge badgeContent={notifications.length} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 8px #f44336' } }}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </motion.div>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {user?.name?.charAt(0) || 'D'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    mt: 1.5
                  }
                }}
              >
                <MenuItem onClick={() => {
                  handleProfileMenuClose();
                  setProfileDialog(true);
                }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => {
                  handleProfileMenuClose();
                  setSettingsDialog(true);
                }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </motion.div>

        {/* Hero Section */}
        {renderHeroSection()}

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <Container maxWidth="lg">
            {selectedTab === 'dashboard' && (
              <>
                {renderStats()}
                {renderActiveDeliveries()}
              </>
            )}

            {selectedTab === 'profile' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Profile</Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setProfileDialog(true)}
                  sx={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}

            {selectedTab === 'settings' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setSettingsDialog(true)}
                  sx={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                    }
                  }}
                >
                  Edit Settings
                </Button>
              </Box>
            )}
          </Container>
        </Box>

        {/* Mobile Navigation */}
        {isMobile && renderMobileNavigation()}

        {/* Dialogs */}
        {renderProfileDialog()}
        {renderSettingsDialog()}
        {renderNotificationsDialog()}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default DeliveryDashboard; 