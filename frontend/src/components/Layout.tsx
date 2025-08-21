import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Inventory, People, Assessment, ShoppingBag, ExitToApp } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <ShoppingCart />
          </Avatar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            E-Commerce System
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/products')}
              sx={{
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Productos
            </Button>
            
            {user?.role === 'ADMIN' && (
              <Button 
                color="inherit" 
                startIcon={<Inventory />}
                onClick={() => navigate('/inventory')}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Inventario
              </Button>
            )}
            
            {user?.role === 'ADMIN' && (
              <Button 
                color="inherit" 
                startIcon={<People />}
                onClick={() => navigate('/users')}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Usuarios
              </Button>
            )}
            
            {user?.role === 'ADMIN' && (
              <Button 
                color="inherit" 
                startIcon={<Assessment />}
                onClick={() => navigate('/reports')}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Reportes
              </Button>
            )}
            
            <Button 
              color="inherit" 
              startIcon={<ShoppingBag />}
              onClick={() => navigate('/orders')}
              sx={{
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Órdenes
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Chip 
                label={user?.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                size="small"
                sx={{
                  bgcolor: user?.role === 'ADMIN' ? '#ff6b6b' : '#4ecdc4',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mr: 1 }}>
                {user?.username}
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ExitToApp />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;