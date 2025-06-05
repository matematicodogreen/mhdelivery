
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/contexts/AdminContext'; // Import useAdmin to access product stock

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { products: adminProducts } = useAdmin(); // Get all products from AdminContext

  const productWithLiveStock = adminProducts.find(p => p.id === product.id) || product;
  const currentStock = productWithLiveStock.stock;
  const isInStock = productWithLiveStock.inStock && currentStock > 0;

  const cartItem = cartItems.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (isInStock && currentStock > 0) {
      addToCart(productWithLiveStock, 1);
    }
  };

  const handleIncrement = () => {
    if (isInStock && currentStock > quantityInCart) {
      if (quantityInCart === 0) {
        addToCart(productWithLiveStock, 1);
      } else {
        updateQuantity(product.id, quantityInCart + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden card-hover bg-card border-0 shadow-lg ${!isInStock ? 'opacity-70' : ''}`}>
        <div className="relative overflow-hidden h-48">
          <img
            src={product.image || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {!isInStock && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-2">
              <ShoppingCart className="w-8 h-8 text-white mb-2" />
              <span className="text-white font-semibold">Produto Indisponível</span>
              <span className="text-xs text-gray-300">Estoque: {currentStock}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--theme-text-main-hex)'}}>{product.name}</h3>
          <p className="text-sm mb-2 line-clamp-2 h-10" style={{ color: 'var(--theme-text-muted-hex)'}}>{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold" style={{ color: 'var(--theme-color-primary-hex)'}}>
              R$ {product.price.toFixed(2)}
            </span>
            {product.category && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--theme-color-accent-hex)', color: 'var(--theme-color-accent-text-hex)'}}>
                {product.category}
              </span>
            )}
          </div>
           {isInStock && <p className="text-xs mt-1" style={{color: 'var(--theme-text-muted-hex)'}}>Estoque: {currentStock}</p>}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {quantityInCart === 0 ? (
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock || currentStock <= 0}
              className="w-full button-primary font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 rounded-lg p-1"
                style={{ backgroundColor: 'var(--theme-color-accent-hex)'}}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDecrement}
                  className="h-8 w-8 rounded-full"
                  style={{ color: 'var(--theme-color-accent-text-hex)'}}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg min-w-[1.5rem] text-center" style={{ color: 'var(--theme-color-accent-text-hex)'}}>
                  {quantityInCart}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={!isInStock || currentStock <= quantityInCart}
                  className="h-8 w-8 rounded-full"
                  style={{ color: 'var(--theme-color-accent-text-hex)'}}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
              <span className="font-bold" style={{ color: 'var(--theme-color-primary-hex)'}}>
                R$ {(product.price * quantityInCart).toFixed(2)}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
