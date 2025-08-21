import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box, Alert, Select, MenuItem, FormControl,
  InputLabel, Grid, Card, CardContent, IconButton, Chip, Paper,
  Avatar, Fade, InputAdornment
} from '@mui/material';
import { CheckCircle, Cancel, Delete, ShoppingBag, Person, AttachMoney, CalendarToday } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Order, Product, User } from '../types';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userMap, setUserMap] = useState<{[key: number]: User}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [randomDiscountDialog, setRandomDiscountDialog] = useState(false);
  const [timeDiscountDialog, setTimeDiscountDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers(); // Always fetch users for display purposes
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user) {
        const endpoint = user.role === 'ADMIN' ? '/orders' : `/orders/user/${user.id}`;
        const response = await api.get(endpoint);
        setOrders(response.data.content || response.data);
      }
    } catch (err) {
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?size=100');
      setProducts(response.data.content);
    } catch (err) {
      console.error('Error loading products');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?size=100');
      const usersData = response.data.content;
      setUsers(usersData);
      
      // Create user map for quick lookup
      const map: {[key: number]: User} = {};
      usersData.forEach((u: User) => {
        map[u.id] = u;
      });
      setUserMap(map);
    } catch (err) {
      console.error('Error loading users');
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct || !user) return;
    
    const targetUserId = user.role === 'ADMIN' ? selectedUser : user.id;
    if (!targetUserId) return;

    try {
      await api.post(`/orders?userId=${targetUserId}`, {
        items: [{
          productId: Number(selectedProduct),
          quantity: quantity
        }]
      });
      setCreateDialog(false);
      setSelectedProduct('');
      setSelectedUser('');
      setQuantity(1);
      setSuccess('Orden creada exitosamente');
      setError('');
      fetchOrders();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error creating order';
      setError(errorMessage);
      setSuccess('');
    }
  };

  const handleRandomDiscount = async () => {
    if (!startDate || !endDate) return;

    try {
      await api.post(`/orders/apply-random-discount?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`);
      setRandomDiscountDialog(false);
      setStartDate('');
      setEndDate('');
      setSuccess('Descuento aleatorio del 50% aplicado exitosamente');
      setError('');
      fetchOrders();
    } catch (err: any) {
      setError('Error aplicando descuento aleatorio');
      setSuccess('');
    }
  };

  const handleTimeDiscount = async () => {
    if (!startDate || !endDate) return;

    try {
      await api.post(`/orders/apply-time-discount?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`);
      setTimeDiscountDialog(false);
      setStartDate('');
      setEndDate('');
      setSuccess('Descuento por tiempo del 10% aplicado exitosamente');
      setError('');
      fetchOrders();
    } catch (err: any) {
      setError('Error aplicando descuento por tiempo');
      setSuccess('');
    }
  };

  const handleOrderAction = async (orderId: number, action: 'APPROVED' | 'REJECTED' | 'DELETED') => {
    if (!user) return;

    try {
      if (action === 'DELETED') {
        await api.delete(`/orders/${orderId}?userId=${user.id}`);
        setSuccess('Orden eliminada exitosamente');
      } else {
        await api.put(`/orders/${orderId}/status?status=${action}&userId=${user.id}`);
        setSuccess(`Orden ${action.toLowerCase()} exitosamente`);
      }
      setError('');
      fetchOrders();
    } catch (err: any) {
      setError('Error updating order status');
      setSuccess('');
    }
  };

  const getStatusColor = (status: string, discountType?: string) => {
    if (discountType?.includes('RANDOM_50')) return '#e3f2fd'; // Light blue for random discount
    if (discountType?.includes('TIME_10')) return '#f3e5f5'; // Light purple for time discount
    if (discountType?.includes('FREQUENT_5')) return '#ffe0e0'; // Light salmon for frequent customer
    
    switch (status) {
      case 'APPROVED': return '#e8f5e8';
      case 'REJECTED': return '#ffeaea';
      case 'PENDING': return '#fff8e1';
      default: return '#f5f5f5';
    }
  };

  const getStatusChipColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
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
            <ShoppingBag sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestión de Órdenes
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

      {user?.role === 'ADMIN' && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
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
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Crear Orden
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setRandomDiscountDialog(true)}
            sx={{
              borderColor: '#9c27b0',
              color: '#9c27b0',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f3e5f5',
                borderColor: '#7b1fa2',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Descuento Aleatorio 50%
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setTimeDiscountDialog(true)}
            sx={{
              borderColor: '#ff9800',
              color: '#ff9800',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#fff3e0',
                borderColor: '#f57c00',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Descuento por Tiempo 10%
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card 
              sx={{ 
                backgroundColor: getStatusColor(order.status, order.discountType),
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">Orden #{order.id}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={order.status} 
                      color={getStatusChipColor(order.status)}
                      size="small"
                    />
                    {order.discountType?.includes('RANDOM_50') && (
                      <Chip label="50% DESC" color="info" size="small" />
                    )}
                    {order.discountType?.includes('TIME_10') && (
                      <Chip label="10% DESC" color="secondary" size="small" />
                    )}
                    {order.discountType?.includes('FREQUENT_5') && (
                      <Chip label="5% FRECUENTE" sx={{ backgroundColor: '#fa8072', color: 'white' }} size="small" />
                    )}
                  </Box>
                </Box>
                
                <Typography color="textSecondary">
                  Usuario: {userMap[order.userId] ? `${userMap[order.userId].firstName} ${userMap[order.userId].lastName}` : `ID: ${order.userId}`}
                </Typography>
                <Typography color="textSecondary">
                  Fecha: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Productos: {order.items?.map(item => `${item.productName || 'Producto'} (${item.quantity})`).join(', ') || 'Sin productos'}
                </Typography>
                {order.discountApplied > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Total original: ${(order.totalAmount + order.discountApplied).toFixed(2)}
                  </Typography>
                )}
                {order.discountApplied > 0 && (
                  <Typography color="success.main">
                    Descuento: -${order.discountApplied.toFixed(2)}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Total: ${order.totalAmount.toFixed(2)}
                </Typography>
                
                {user?.role === 'ADMIN' && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {order.status === 'PENDING' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleOrderAction(order.id, 'APPROVED')}
                          title="Aprobar"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOrderAction(order.id, 'REJECTED')}
                          title="Rechazar"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                    {(order.status === 'PENDING' || order.status === 'APPROVED' || order.status === 'REJECTED') && (
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOrderAction(order.id, 'DELETED')}
                        title="Eliminar"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Total for non-admin users */}
      {user?.role !== 'ADMIN' && orders.length > 0 && (
        <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Resumen de Órdenes
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            Total a Pagar: ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total de {orders.length} orden{orders.length !== 1 ? 'es' : ''}
          </Typography>
        </Paper>
      )}

      {/* Create Order Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)}>
        <DialogTitle>Crear Nueva Orden</DialogTitle>
        <DialogContent>
          {user?.role === 'ADMIN' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Usuario</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Producto</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - ${product.price} (Stock: {product.stock})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Cantidad"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateOrder} variant="contained">Crear Orden</Button>
        </DialogActions>
      </Dialog>

      {/* Random Discount Dialog */}
      <Dialog open={randomDiscountDialog} onClose={() => setRandomDiscountDialog(false)}>
        <DialogTitle>Aplicar Descuento Aleatorio 50%</DialogTitle>
        <DialogContent>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRandomDiscountDialog(false)}>Cancelar</Button>
          <Button onClick={handleRandomDiscount} variant="contained">Aplicar Descuento</Button>
        </DialogActions>
      </Dialog>

      {/* Time Discount Dialog */}
      <Dialog open={timeDiscountDialog} onClose={() => setTimeDiscountDialog(false)}>
        <DialogTitle>Aplicar Descuento por Tiempo 10%</DialogTitle>
        <DialogContent>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeDiscountDialog(false)}>Cancelar</Button>
          <Button onClick={handleTimeDiscount} variant="contained">Aplicar Descuento</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;