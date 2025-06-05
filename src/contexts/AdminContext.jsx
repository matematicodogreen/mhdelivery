
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const defaultTheme = {
  primaryColorHex: '#D32F2F', 
  primaryTextColorHex: '#FFFFFF',
  secondaryColorHex: '#1976D2', 
  secondaryTextColorHex: '#FFFFFF',
  accentColorHex: '#FF5252', 
  accentTextColorHex: '#FFFFFF',
  bgGradientStartHex: '#FFEBEE', 
  bgGradientEndHex: '#E3F2FD', 
  textMainHex: '#212121',
  textMutedHex: '#757575',
  cardBgHex: '#FFFFFF',
  cardForegroundHex: '#212121',
  inputBorderHex: '#BDBDBD',
  ringHex: '#D32F2F',
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    storeName: 'MH Delivery',
    minOrderValue: 20.00,
    deliveryZones: [
      { id: 'zone1', name: 'Centro', fee: 5.00 },
      { id: 'zone2', name: 'Taquari', fee: 10.00 },
    ],
    defaultDeliveryFee: 7.00,
    theme: defaultTheme,
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('mhdelivery-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts = [
        {
          id: '1',
          name: 'Coca-Cola 2L',
          description: 'Refrigerante Coca-Cola Original Garrafa 2 Litros',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
          category: 'Bebidas',
          stock: 10, 
        },
        {
          id: '2',
          name: 'Arroz Tipo 1 5kg',
          description: 'Arroz branco tipo 1, ideal para o dia a dia',
          price: 22.50,
          image: 'https://images.unsplash.com/photo-1586201375822-52c6739cadf6?w=400',
          category: 'Mercearia',
          stock: 15,
        },
        {
          id: '3',
          name: 'Pão de Forma Tradicional',
          description: 'Pão de forma macio e saboroso',
          price: 6.75,
          image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400',
          category: 'Padaria',
          stock: 0, 
        },
      ];
      setProducts(initialProducts.map(p => ({...p, inStock: p.stock > 0 })));
      localStorage.setItem('mhdelivery-products', JSON.stringify(initialProducts.map(p => ({...p, inStock: p.stock > 0 }))));
    }

    const savedSettings = localStorage.getItem('mhdelivery-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(prevSettings => ({
        ...prevSettings,
        ...parsedSettings,
        theme: { ...defaultTheme, ...(parsedSettings.theme || {}) },
        deliveryZones: parsedSettings.deliveryZones || prevSettings.deliveryZones,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mhdelivery-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mhdelivery-settings', JSON.stringify(settings));
  }, [settings]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      stock: parseInt(product.stock, 10) || 0,
      inStock: (parseInt(product.stock, 10) || 0) > 0,
    };
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado com sucesso`,
    });
  };

  const updateProduct = (productId, updatedProduct) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { 
          ...product, 
          ...updatedProduct, 
          stock: parseInt(updatedProduct.stock, 10) || 0,
          inStock: (parseInt(updatedProduct.stock, 10) || 0) > 0 
        } : product
      )
    );
    toast({
      title: "Produto atualizado!",
      description: "As informações do produto foram atualizadas",
    });
  };

  const deleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast({
      title: "Produto removido",
      description: `${product?.name} foi removido do catálogo`,
    });
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast({
      title: "Configurações atualizadas!",
      description: "As configurações foram salvas com sucesso",
    });
  };

  const addDeliveryZone = (zone) => {
    const newZone = { ...zone, id: Date.now().toString() };
    setSettings(prev => ({
      ...prev,
      deliveryZones: [...(prev.deliveryZones || []), newZone]
    }));
    toast({ title: "Zona de entrega adicionada!" });
  };

  const updateDeliveryZone = (zoneId, updatedZone) => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: (prev.deliveryZones || []).map(zone =>
        zone.id === zoneId ? { ...zone, ...updatedZone } : zone
      )
    }));
    toast({ title: "Zona de entrega atualizada!" });
  };

  const deleteDeliveryZone = (zoneId) => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: (prev.deliveryZones || []).filter(zone => zone.id !== zoneId)
    }));
    toast({ title: "Zona de entrega removida!" });
  };

  const decreaseStock = (productId, quantity) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock - quantity);
          return { ...p, stock: newStock, inStock: newStock > 0 };
        }
        return p;
      })
    );
  };

  const value = {
    products,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone,
    decreaseStock,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
