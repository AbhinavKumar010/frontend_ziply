import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const Stats = ({ stats }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 1.5, sm: 2 },
    mt: { xs: 1, sm: 2 },
    p: { xs: 1.5, sm: 2 },
    bgcolor: 'background.paper',
    borderRadius: { xs: '8px', sm: '12px' },
    boxShadow: { xs: 'none', sm: '0 2px 8px rgba(0,0,0,0.1)' }
  }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        fontSize: { xs: '1.125rem', sm: '1.25rem' },
        mb: 1
      }}
    >
      Statistics
    </Typography>
    <Grid container spacing={{ xs: 1, sm: 1.5 }}>
      {stats.map((stat, index) => (
        <Grid item xs={6} key={stat.title}>
          <Box sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: 'background.paper',
            borderRadius: { xs: '8px', sm: '12px' },
            border: '1px solid',
            borderColor: 'divider',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {stat.title}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {stat.change}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                {stat.value}
              </Typography>
              <Box sx={{ color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default Stats; 