
import { Card, Box, Typography, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, change, color, image }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: { xs: 180, sm: 200, md: 220 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: `${color}20`,
          boxShadow: `0 8px 32px ${color}15`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: `0 12px 48px ${color}25`,
            borderColor: `${color}30`,
          }
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 0.08
            }
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 2, sm: 3 }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <IconButton
              sx={{
                bgcolor: `${color}15`,
                color: color,
                '&:hover': {
                  bgcolor: `${color}25`,
                },
                transition: 'all 0.2s ease-in-out',
                transform: 'rotate(0deg)',
                '&:hover': {
                  transform: 'rotate(15deg) scale(1.1)',
                }
              }}
            >
              {icon}
            </IconButton>
          </Box>

          {/* Value and Change */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                color: 'text.primary',
                letterSpacing: '-0.5px'
              }}
            >
              {value}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: change.startsWith('+') ? 'success.main' : 'error.main',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {change}
                <Box
                  component="span"
                  sx={{
                    ml: 0.5,
                    color: 'text.secondary',
                    fontWeight: 400
                  }}
                >
                  from last month
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default StatCard; 