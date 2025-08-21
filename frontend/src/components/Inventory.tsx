import React, { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, Alert, Avatar, Fade, Chip,
  IconButton, InputAdornment
} from '@mui/material';
import { Inventory as InventoryIcon, Edit, Warning, CheckCircle, AttachMoney } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchProducts();
    }
  }, [user]);
  
  // Redirect non-admin users
  if (user?.role !== 'ADMIN') {
    return (
      <Box>
        <Alert severity="error">
          No tienes permisos para acceder a esta sección.
        </Alert>
      </Box>
    );
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?size=100');
      setProducts(response.data.content);
    } catch (err) {
      setError('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    
    try {
      await api.put(`/products/${selectedProduct.id}`, {
        ...selectedProduct,
        stock: newStock
      });
      setEditDialog(false);
      fetchProducts();
    } catch (err) {
      setError('Error updating stock');
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setEditDialog(true);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', p: 3 }}>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <InventoryIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestión de Inventario
          </Typography>
        </Box>
      </Paper>
      
      {error && (
        <Fade in>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow 
                key={product.id}
                sx={{
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    transform: 'scale(1.001)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.2s ease',
                  bgcolor: index % 2 === 0 ? '#fff' : '#fafbfc'
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{product.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={product.category === 'Electronics' ? 'Electrónicos' : 
                           product.category === 'Home' ? 'Hogar' : 
                           product.category === 'Sports' ? 'Deportes' : product.category}
                    size="small"
                    sx={{
                      bgcolor: product.category === 'Electronics' ? '#e3f2fd' : 
                               product.category === 'Home' ? '#f3e5f5' : 
                               product.category === 'Sports' ? '#e8f5e8' : '#f5f5f5',
                      color: product.category === 'Electronics' ? '#1976d2' : 
                             product.category === 'Home' ? '#7b1fa2' : 
                             product.category === 'Sports' ? '#388e3c' : '#666',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>
                  ${product.price}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.stock}
                    size="small"
                    icon={product.stock < 10 ? <Warning /> : <CheckCircle />}
                    sx={{
                      bgcolor: product.stock > 10 ? '#dcfce7' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                      color: product.stock > 10 ? '#166534' : product.stock > 0 ? '#92400e' : '#dc2626',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.isActive ? 'Activo' : 'Inactivo'}
                    size="small"
                    sx={{
                      bgcolor: product.isActive ? '#dcfce7' : '#fee2e2',
                      color: product.isActive ? '#166534' : '#dc2626',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => openEditDialog(product)}
                    sx={{
                      bgcolor: '#e0f2fe',
                      color: '#0277bd',
                      '&:hover': {
                        bgcolor: '#b3e5fc',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Edit sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Edit />
          Actualizar Stock
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
            Producto: {selectedProduct?.name}
          </Typography>
          <TextField
            label="Nuevo Stock"
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setEditDialog(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateStock} 
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;