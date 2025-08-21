import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  InputAdornment,
  Fade,
  Avatar
} from '@mui/material';
import { Logout, Search, Clear, ShoppingCart, Add, AttachMoney, Inventory, Category } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { productsAPI, api } from '../services/api';
import { Product, PageResponse } from '../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [buyDialog, setBuyDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadProducts();
  }, [page, rowsPerPage]);

  const loadProducts = async () => {
    try {
      const response: PageResponse<Product> = await productsAPI.getProducts(page, rowsPerPage);
      setProducts(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response: PageResponse<Product> = await productsAPI.searchProducts(searchParams, 0, rowsPerPage);
      setProducts(response.content);
      setTotalElements(response.totalElements);
      setPage(0);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleClear = () => {
    setSearchParams({ name: '', category: '', minPrice: '', maxPrice: '' });
    setPage(0);
    loadProducts();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setBuyDialog(true);
  };

  const handleBuyConfirm = async () => {
    if (!selectedProduct || !user) return;

    try {
      await api.post(`/orders?userId=${user.id}`, {
        items: [{
          productId: selectedProduct.id,
          quantity: quantity
        }]
      });
      setBuyDialog(false);
      setSuccess(`Orden creada exitosamente para ${selectedProduct.name}`);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error creating order';
      setError(errorMessage);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await api.post('/products', {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });
      setCreateDialog(false);
      setNewProduct({ name: '', category: '', price: '', stock: '' });
      setSuccess('Producto creado exitosamente');
      setError('');
      loadProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error creating product';
      setError(errorMessage);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <ShoppingCart />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            E-Commerce System
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
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 4, pb: 4 }}>
        <Container maxWidth="lg">
          {success && (
            <Fade in>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}
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
        
          {user?.role === 'ADMIN' && (
            <Box sx={{ mb: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<Add />}
                onClick={() => setCreateDialog(true)}
                sx={{
                  background: 'linear-gradient(45deg, #4caf50, #45a049)',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Agregar Producto
              </Button>
            </Box>
          )}
        
          <Paper 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Search color="primary" />
              Buscar Productos
            </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={searchParams.name}
                onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={searchParams.category}
                onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="">Todas las Categorías</MenuItem>
                <MenuItem value="Electronics">Electrónicos</MenuItem>
                <MenuItem value="Home">Hogar</MenuItem>
                <MenuItem value="Sports">Deportes</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Precio Mínimo"
                type="number"
                value={searchParams.minPrice}
                onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Precio Máximo"
                type="number"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClear}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

          <Paper 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Inventory />
                Productos ({totalElements} artículos)
              </Typography>
            </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Stock</TableCell>
                  {user?.role !== 'ADMIN' && <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Acciones</TableCell>}
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
                        sx={{
                          bgcolor: product.stock > 10 ? '#dcfce7' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                          color: product.stock > 10 ? '#166534' : product.stock > 0 ? '#92400e' : '#dc2626',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    {user?.role !== 'ADMIN' && (
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleBuyClick(product)}
                          disabled={product.stock === 0}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            background: product.stock === 0 ? undefined : 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                            boxShadow: product.stock === 0 ? undefined : '0 4px 12px rgba(255, 107, 107, 0.3)',
                            '&:hover': {
                              background: product.stock === 0 ? undefined : 'linear-gradient(45deg, #ee5a52, #e04848)',
                              boxShadow: product.stock === 0 ? undefined : '0 6px 16px rgba(255, 107, 107, 0.4)',
                              transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                              background: '#e0e0e0',
                              color: '#9e9e9e'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {product.stock === 0 ? 'Agotado' : 'Comprar'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
        
        {/* Buy Dialog */}
        <Dialog open={buyDialog} onClose={() => setBuyDialog(false)}>
          <DialogTitle>Comprar Producto</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Producto: {selectedProduct?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Precio: ${selectedProduct?.price}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Stock disponible: {selectedProduct?.stock}
            </Typography>
            <TextField
              label="Cantidad"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1, max: selectedProduct?.stock }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBuyDialog(false)}>Cancelar</Button>
            <Button onClick={handleBuyConfirm} variant="contained">Comprar</Button>
          </DialogActions>
        </Dialog>
        
        {/* Create Product Dialog */}
        <Dialog open={createDialog} onClose={() => setCreateDialog(false)}>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre del Producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              select
              label="Categoría"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
            </TextField>
            <TextField
              label="Precio"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateProduct} variant="contained">Crear Producto</Button>
          </DialogActions>
        </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default Products;