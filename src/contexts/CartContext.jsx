
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/contexts/AdminContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { products } = useAdmin(); // Access products to check stock

  useEffect(() => {
    const savedCart = localStorage.getItem('mhdelivery-cart'); // Changed key to avoid conflict
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mhdelivery-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const productInAdmin = products.find(p => p.id === product.id);
    if (!productInAdmin || productInAdmin.stock < quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Não há estoque suficiente para ${product.name}.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (productInAdmin.stock < newQuantity) {
          toast({
            title: "Estoque insuficiente",
            description: `Apenas ${productInAdmin.stock - existingItem.quantity} unidades de ${product.name} podem ser adicionadas.`,
            variant: "destructive",
          });
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: productInAdmin.stock }
              : item
          );
        }
        const updatedItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        toast({
          title: "Produto atualizado!",
          description: `${product.name} foi atualizado no carrinho`,
        });
        return updatedItems;
      } else {
        toast({
          title: "Produto adicionado!",
          description: `${product.name} foi adicionado ao carrinho`,
        });
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Produto removido",
          description: `${item.name} foi removido do carrinho`,
        });
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    const productInAdmin = products.find(p => p.id === productId);
    if (!productInAdmin) return; // Should not happen

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (productInAdmin.stock < quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${productInAdmin.stock} unidades de ${productInAdmin.name} disponíveis.`,
        variant: "destructive",
      });
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: productInAdmin.stock } : item
        )
      );
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mhdelivery-cart');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
