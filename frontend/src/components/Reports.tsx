import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Grid, Card, CardContent, Avatar, Fade, Chip
} from '@mui/material';
import { Assessment, TrendingUp, People, Inventory, Star, EmojiEvents } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

type TopProduct = [string, number]; // [productName, totalQuantitySold]
type TopCustomer = [string, number]; // [customerName, totalOrders]

interface ActiveProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [activeProducts, setActiveProducts] = useState<ActiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchReports();
    }
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return (
      <Box>
        <Alert severity="error">
          No tienes permisos para acceder a esta sección.
        </Alert>
      </Box>
    );
  }

  const fetchReports = async () => {
    try {
      const [productsRes, customersRes, activeRes] = await Promise.all([
        api.get('/products/top-selling'),
        api.get('/orders/frequent-customers'),
        api.get('/products/active')
      ]);
      
      setTopProducts(productsRes.data);
      setTopCustomers(customersRes.data);
      setActiveProducts(activeRes.data);
    } catch (err) {
      setError('Error loading reports');
    } finally {
      setLoading(false);
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
            <Assessment sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Reportes del Sistema
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

      <Grid container spacing={3}>
        {/* Top 5 Productos Más Vendidos */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#fee2e2', color: '#dc2626' }}>
                  <TrendingUp />
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b'
                  }}
                >
                  Top 5 Productos Más Vendidos
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad Vendida</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc'
                          }
                        }}
                      >
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1}
                            size="small"
                            sx={{
                              bgcolor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7c2f' : '#e5e7eb',
                              color: index < 3 ? 'white' : '#374151',
                              fontWeight: 600,
                              minWidth: 24
                            }}
                          />
                          <Typography sx={{ fontWeight: 600 }}>{product[0]}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={product[1]}
                            size="small"
                            sx={{
                              bgcolor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 5 Clientes Frecuentes */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#dbeafe', color: '#2563eb' }}>
                  <People />
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b'
                  }}
                >
                  Top 5 Clientes Frecuentes
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Órdenes Aprobadas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.map((customer, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc'
                          }
                        }}
                      >
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1}
                            size="small"
                            icon={index === 0 ? <EmojiEvents /> : <Star />}
                            sx={{
                              bgcolor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7c2f' : '#e5e7eb',
                              color: index < 3 ? 'white' : '#374151',
                              fontWeight: 600,
                              minWidth: 24
                            }}
                          />
                          <Typography sx={{ fontWeight: 600 }}>{customer[0]}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={customer[1]}
                            size="small"
                            sx={{
                              bgcolor: '#e0f2fe',
                              color: '#0277bd',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos Activos */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#f3e8ff', color: '#7c3aed' }}>
                  <Inventory />
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b'
                  }}
                >
                  Productos Activos ({activeProducts.length} productos)
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeProducts.map((product, index) => (
                      <TableRow 
                        key={product.id}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc'
                          },
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
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>
                          ${product.price}
                        </TableCell>
                        <TableCell align="right">
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;