import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        {/* Product Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1
            }}
          >
            <Tooltip title="Edit Product">
              <IconButton
                size="small"
                onClick={onEdit}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Product">
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'error.lighter',
                    color: 'error.main'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Product Category */}
          <Chip
            label={product.category}
            size="small"
            sx={{
              mb: 1,
              bgcolor: theme.palette.primary.lighter,
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          />

          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 48
            }}
          >
            {product.name}
          </Typography>

          {/* Product Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40
            }}
          >
            {product.description}
          </Typography>

          {/* Product Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto'
            }}
          >
            {/* Stock Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon
                fontSize="small"
                color={product.stock < 10 ? 'error' : 'success'}
              />
              <Typography
                variant="body2"
                color={product.stock < 10 ? 'error.main' : 'success.main'}
                fontWeight="medium"
              >
                {product.stock} {product.stockUnit}
              </Typography>
            </Box>

            {/* Price */}
            <Typography
              variant="h6"
              color="primary.main"
              fontWeight="bold"
              sx={{ letterSpacing: -0.5 }}
            >
              ₹{product.price?.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard; 