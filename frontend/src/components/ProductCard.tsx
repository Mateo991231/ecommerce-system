import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  user: User;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBuy: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  user,
  onEdit,
  onDelete,
  onBuy
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
        </Typography>
      </CardContent>
      <CardActions>
        {user.role === 'ADMIN' ? (
          <>
            <Button size="small" onClick={() => onEdit(product)}>
              Editar
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(product.id)}>
              Eliminar
            </Button>
          </>
        ) : (
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => onBuy(product)}
            disabled={product.stock === 0}
          >
            Comprar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;