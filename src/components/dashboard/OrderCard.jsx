
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const OrderCard = ({ order, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return theme.palette.success.main;
      case 'processing': return theme.palette.warning.main;
      case 'pending': return theme.palette.info.main;
      case 'cancelled': return theme.palette.error.main;
      case 'shipped': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          borderRadius: 2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent>
          {/* Order Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Order #{order._id?.slice(-6)}
              </Typography>
              <Chip
                label={order.status?.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: `${getStatusColor(order.status)}15`,
                  color: getStatusColor(order.status),
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <IconButton
              size="small"
              sx={{
                bgcolor: theme.palette.primary.lighter,
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light
                }
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Customer Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={order.customer?.avatar}
              alt={order.customer?.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {order.customer?.name || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {order.customer?.phone || 'No phone'}
              </Typography>
            </Box>
          </Box>

          {/* Order Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {order.paymentMethod?.toUpperCase()} - 
                <Box
                  component="span"
                  sx={{
                    color: order.paymentStatus === 'paid' ? 'success.main' : 'warning.main',
                    fontWeight: 500,
                    ml: 0.5
                  }}
                >
                  {order.paymentStatus?.toUpperCase()}
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Order Total */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {order.items?.length} items
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              ₹{order.totalAmount?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderCard; 