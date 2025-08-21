import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip, FormControl, InputLabel, Select, MenuItem,
  Avatar, Fade, InputAdornment
} from '@mui/material';
import { Edit, Delete, Add, People, Person, Email, Lock, Badge } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

const Users: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialog, setDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
    isFrequentCustomer: false
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?size=100');
      setUsers(response.data.content);
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'CUSTOMER',
      isFrequentCustomer: false
    });
    setDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isFrequentCustomer: user.isFrequentCustomer
    });
    setDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        await api.post('/auth/register', formData);
        setSuccess('Usuario creado exitosamente');
      }
      setDialog(false);
      setError('');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving user');
      setSuccess('');
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/users/${userId}`);
        setSuccess('Usuario eliminado exitosamente');
        setError('');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError('Error deleting user');
        setSuccess('');
      }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <People sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Gestión de Usuarios
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Crear Usuario
          </Button>
        </Box>
      </Paper>

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
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Cliente Frecuente</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u, index) => (
              <TableRow 
                key={u.id}
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
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography sx={{ fontWeight: 600 }}>{u.username}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#64748b' }}>{u.email}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.role === 'ADMIN' ? 'Administrador' : 'Cliente'} 
                    sx={{
                      bgcolor: u.role === 'ADMIN' ? '#fee2e2' : '#dbeafe',
                      color: u.role === 'ADMIN' ? '#dc2626' : '#2563eb',
                      fontWeight: 600
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={u.isFrequentCustomer ? 'Sí' : 'No'}
                    sx={{
                      bgcolor: u.isFrequentCustomer ? '#dcfce7' : '#fee2e2',
                      color: u.isFrequentCustomer ? '#166534' : '#dc2626',
                      fontWeight: 600
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={() => handleEdit(u)} 
                      size="small"
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
                    <IconButton 
                      onClick={() => handleDelete(u.id)} 
                      size="small"
                      sx={{
                        bgcolor: '#ffebee',
                        color: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#ffcdd2',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={dialog} 
        onClose={() => setDialog(false)} 
        maxWidth="sm" 
        fullWidth
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
          <Person />
          {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Usuario"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            fullWidth
            sx={{ mt: 2 }}
            disabled={!!editingUser}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label={editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nombre"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Apellido"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as 'ADMIN' | 'CUSTOMER'})}
            >
              <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Cliente Frecuente</InputLabel>
            <Select
              value={formData.isFrequentCustomer ? 'true' : 'false'}
              onChange={(e) => setFormData({...formData, isFrequentCustomer: e.target.value === 'true'})}
            >
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setDialog(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
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
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;