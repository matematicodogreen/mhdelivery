import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';

const HomePage = () => {
  const { products, settings } = useAdmin();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const imageUrlEntregaRapida = "src/imagens/1.png";
  const imageUrlProdutosFrescos = "src/imagens/2.png";
  const imageUrlPagamentoSeguro = "src/imagens/3.png";


  return (
    <div className="min-h-screen">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(to bottom right, var(--theme-bg-gradient-start-hex), var(--theme-bg-gradient-end-hex))` }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">{settings.storeName}</span>
              <br />
              <span style={{ color: 'var(--theme-text-main-hex)'}}>Bebidas & Supermercado</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--theme-text-muted-hex)'}}>
              Seus produtos favoritos entregues com rapidez e segurança. 
              Faça seu pedido online!
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--theme-text-muted-hex)'}} />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="h-4 w-4 mr-2" style={{ color: 'var(--theme-color-primary-hex)'}} />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--theme-text-main-hex)'}}>
              Nossos Produtos
            </h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl" style={{ color: 'var(--theme-text-muted-hex)'}}>
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Nenhum produto encontrado com os filtros aplicados.'
                    : 'Nenhum produto disponível no momento.'
                  }
                </p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--theme-bg-gradient-end-hex)'}}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-6 bg-card rounded-lg shadow-lg"
            >
              <div className="icon-globe gradient-primary-bg">
                <img  alt="Ícone de entrega rápida preenchendo o círculo" className="w-full h-full object-cover" src={imageUrlEntregaRapida} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-color-primary-hex)'}}>Entrega Rápida</h3>
              <p style={{ color: 'var(--theme-text-muted-hex)'}}>Receba seus produtos em casa com agilidade e segurança</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-6 bg-card rounded-lg shadow-lg"
            >
              <div className="icon-globe gradient-primary-bg">
                <img  alt="Ícone de produtos frescos preenchendo o círculo" className="w-full h-full object-cover" src={imageUrlProdutosFrescos} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-color-primary-hex)'}}>Produtos Frescos</h3>
              <p style={{ color: 'var(--theme-text-muted-hex)'}}>Selecionamos apenas os melhores produtos para você</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-6 bg-card rounded-lg shadow-lg"
            >
              <div className="icon-globe gradient-primary-bg">
                <img  alt="Ícone de pagamento seguro preenchendo o círculo" className="w-full h-full object-cover" src={imageUrlPagamentoSeguro} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-color-primary-hex)'}}>Pagamento Seguro</h3>
              <p style={{ color: 'var(--theme-text-muted-hex)'}}>Múltiplas formas de pagamento para sua comodidade</p>
            </motion.div>
          </div>
        </div>
      </section>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default HomePage;
