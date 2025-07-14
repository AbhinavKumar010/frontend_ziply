import React from 'react';
import { Grid, Container, Typography, Box, Card } from '@mui/material';

const CategoryList = ({ categories, selectedCategory, onCategoryClick }) => (
  <Container maxWidth="lg">
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        mb: { xs: 2, sm: 3 },
        color: 'text.primary',
        textAlign: { xs: 'center', sm: 'left' }
      }}
    >
      Categories
    </Typography>
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
      {categories.map((category, index) => (
        <Grid item xs={6} sm={4} md={3} key={category.id}>
          <Card
            onClick={() => onCategoryClick(category.id)}
            sx={{
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
              },
              bgcolor: selectedCategory === category.id ? 'rgba(255, 107, 107, 0.15)' : 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {category.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
                {category.name}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default CategoryList; 