
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Settings as SettingsIcon, Palette, MapPin, Package, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { 
    products, settings, addProduct, updateProduct, deleteProduct, updateSettings,
    addDeliveryZone, updateDeliveryZone, deleteDeliveryZone 
  } = useAdmin();
  const navigate = useNavigate();
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [generalSettingsForm, setGeneralSettingsForm] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    minOrderValue: settings.minOrderValue,
    defaultDeliveryFee: settings.defaultDeliveryFee,
  });

  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [themeSettingsForm, setThemeSettingsForm] = useState(settings.theme);

  const [showDeliveryZones, setShowDeliveryZones] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState({ name: '', fee: '' });


  useEffect(() => {
    setGeneralSettingsForm({
      storeName: settings.storeName,
      whatsappNumber: settings.whatsappNumber,
      minOrderValue: settings.minOrderValue,
      defaultDeliveryFee: settings.defaultDeliveryFee,
    });
    const currentTheme = settings.theme || {
      primaryColorHex: '#D32F2F', primaryTextColorHex: '#FFFFFF',
      secondaryColorHex: '#1976D2', secondaryTextColorHex: '#FFFFFF',
      accentColorHex: '#FF5252', accentTextColorHex: '#FFFFFF',
      bgGradientStartHex: '#FFEBEE', bgGradientEndHex: '#E3F2FD',
      textMainHex: '#212121', textMutedHex: '#757575',
      cardBgHex: '#FFFFFF', cardForegroundHex: '#212121',
      inputBorderHex: '#BDBDBD', ringHex: '#D32F2F',
    };
    setThemeSettingsForm(currentTheme);
  }, [settings]);

  const handleAddProductSubmit = (productData) => {
    addProduct(productData);
    setShowProductForm(false);
  };

  const handleUpdateProductSubmit = (productData) => {
    updateProduct(editingProduct.id, productData);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }

  const handleDeleteProductConfirm = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const handleSaveGeneralSettings = () => {
    updateSettings({ 
      ...generalSettingsForm, 
      minOrderValue: parseFloat(generalSettingsForm.minOrderValue) || 0,
      defaultDeliveryFee: parseFloat(generalSettingsForm.defaultDeliveryFee) || 0,
    });
    setShowGeneralSettings(false);
  };

  const handleSaveThemeSettings = () => {
    updateSettings({ theme: themeSettingsForm });
    setShowThemeSettings(false);
  };
  
  const handleZoneFormChange = (field, value) => {
    setZoneForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDeliveryZone = () => {
    if (!zoneForm.name || zoneForm.fee === '') {
      toast({ title: "Erro", description: "Nome da zona e taxa são obrigatórios.", variant: "destructive" });
      return;
    }
    const fee = parseFloat(zoneForm.fee);
    if (isNaN(fee) || fee < 0) {
      toast({ title: "Erro", description: "Taxa inválida.", variant: "destructive" });
      return;
    }

    if (editingZone) {
      updateDeliveryZone(editingZone.id, { ...editingZone, name: zoneForm.name, fee });
    } else {
      addDeliveryZone({ name: zoneForm.name, fee });
    }
    setEditingZone(null);
    setZoneForm({ name: '', fee: '' });
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneForm({ name: zone.name, fee: zone.fee.toString() });
  };
  
  const handleDeleteZone = (zoneId) => {
    if (window.confirm('Tem certeza que deseja excluir esta zona de entrega?')) {
      deleteDeliveryZone(zoneId);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    toast({title: "Logout realizado", description: "Você foi desconectado."});
    navigate('/admin-login');
  };

  const themeColorFields = [
    { label: "Cor Primária", key: "primaryColorHex" },
    { label: "Texto na Cor Primária", key: "primaryTextColorHex" },
    { label: "Cor Secundária", key: "secondaryColorHex" },
    { label: "Texto na Cor Secundária", key: "secondaryTextColorHex" },
    { label: "Cor de Destaque (Accent)", key: "accentColorHex" },
    { label: "Texto na Cor de Destaque", key: "accentTextColorHex" },
    { label: "Início do Gradiente de Fundo", key: "bgGradientStartHex" },
    { label: "Fim do Gradiente de Fundo", key: "bgGradientEndHex" },
    { label: "Texto Principal", key: "textMainHex" },
    { label: "Texto Secundário (Muted)", key: "textMutedHex" },
    { label: "Fundo do Card", key: "cardBgHex" },
    { label: "Texto do Card", key: "cardForegroundHex" },
    { label: "Borda de Inputs", key: "inputBorderHex" },
    { label: "Cor de Foco (Ring)", key: "ringHex" },
  ];


  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">Painel Administrativo</h1>
            <p style={{color: 'var(--theme-text-muted-hex)'}}>Gerencie produtos e configurações do seu {settings.storeName}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="button-secondary">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => { setEditingProduct(null); setShowProductForm(true); }} className="w-full button-primary">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Produto
                </Button>
                <Button onClick={() => setShowGeneralSettings(true)} variant="outline" className="w-full">
                  <SettingsIcon className="w-4 h-4 mr-2" /> Configurações Gerais
                </Button>
                <Button onClick={() => setShowThemeSettings(true)} variant="outline" className="w-full">
                  <Palette className="w-4 h-4 mr-2" /> Personalizar Cores
                </Button>
                <Button onClick={() => setShowDeliveryZones(true)} variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" /> Taxas de Entrega
                </Button>
              </CardContent>
            </Card>

            {showProductForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ProductForm
                  key={editingProduct ? editingProduct.id : 'new'}
                  initialData={editingProduct}
                  onSubmit={editingProduct ? handleUpdateProductSubmit : handleAddProductSubmit}
                  onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
                />
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Cadastrados</CardTitle>
                <CardDescription>Total: {products.length} produtos</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <p style={{color: 'var(--theme-text-muted-hex)'}}>Nenhum produto cadastrado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/10 ${!product.inStock ? 'opacity-60' : ''}`}>
                        <img src={product.image || 'https://via.placeholder.com/64'} alt={product.name} className="w-16 h-16 object-cover rounded-lg"/>
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm line-clamp-1" style={{color: 'var(--theme-text-muted-hex)'}}>{product.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="font-bold" style={{color: 'var(--theme-color-primary-hex)'}}>R$ {product.price.toFixed(2)}</span>
                            {product.category && (<span className="text-xs px-2 py-1 rounded" style={{backgroundColor: 'var(--theme-color-accent-hex)', color: 'var(--theme-color-accent-text-hex)'}}>{product.category}</span>)}
                            <span className={`text-xs px-2 py-1 rounded flex items-center ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              <Package className="w-3 h-3 mr-1" /> {product.inStock ? `Estoque: ${product.stock}` : 'Indisponível'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteProductConfirm(product.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showGeneralSettings} onOpenChange={setShowGeneralSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Configurações Gerais</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              {[
                {label: "Nome da Loja", key: "storeName", type: "text"},
                {label: "Número do WhatsApp", key: "whatsappNumber", type: "text", placeholder: "5511999999999"},
                {label: "Pedido Mínimo (R$)", key: "minOrderValue", type: "number"},
                {label: "Taxa de Entrega Padrão (R$)", key: "defaultDeliveryFee", type: "number"},
              ].map(field => (
                <div key={field.key}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input id={field.key} type={field.type} placeholder={field.placeholder} value={generalSettingsForm[field.key]} onChange={(e) => setGeneralSettingsForm(prev => ({...prev, [field.key]: e.target.value}))} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowGeneralSettings(false)}>Cancelar</Button>
              <Button onClick={handleSaveGeneralSettings} className="button-primary">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showThemeSettings} onOpenChange={setShowThemeSettings}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Personalizar Cores do App</DialogTitle></DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {themeColorFields.map(field => (
                <div key={field.key} className="flex items-center justify-between">
                  <Label htmlFor={field.key} className="text-sm">{field.label}</Label>
                  <div className="flex items-center space-x-2">
                    <Input id={field.key} type="text" value={themeSettingsForm[field.key]} onChange={(e) => setThemeSettingsForm(prev => ({...prev, [field.key]: e.target.value}))} className="w-32 h-8"/>
                    <Input type="color" value={themeSettingsForm[field.key]} onChange={(e) => setThemeSettingsForm(prev => ({...prev, [field.key]: e.target.value}))} className="w-8 h-8 p-0 border-none"/>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowThemeSettings(false)}>Cancelar</Button>
              <Button onClick={handleSaveThemeSettings} className="button-primary">Salvar Cores</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeliveryZones} onOpenChange={setShowDeliveryZones}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Taxas de Entrega por Localidade</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Adicionar/Editar Zona</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div><Label htmlFor="zoneName">Nome da Localidade</Label><Input id="zoneName" value={zoneForm.name} onChange={(e) => handleZoneFormChange('name', e.target.value)} /></div>
                  <div><Label htmlFor="zoneFee">Taxa (R$)</Label><Input id="zoneFee" type="number" value={zoneForm.fee} onChange={(e) => handleZoneFormChange('fee', e.target.value)} /></div>
                  <div className="flex justify-end space-x-2">
                    {editingZone && <Button variant="ghost" onClick={() => { setEditingZone(null); setZoneForm({name: '', fee: ''});}}>Cancelar Edição</Button>}
                    <Button onClick={handleSaveDeliveryZone} className="button-primary">{editingZone ? 'Atualizar Zona' : 'Adicionar Zona'}</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Zonas Cadastradas</CardTitle></CardHeader>
                <CardContent className="max-h-[30vh] overflow-y-auto">
                  {(settings.deliveryZones || []).length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma zona cadastrada.</p> :
                    <ul className="space-y-2">
                      {(settings.deliveryZones || []).map(zone => (
                        <li key={zone.id} className="flex justify-between items-center p-2 border rounded">
                          <div>{zone.name} - <span className="font-semibold">R$ {zone.fee.toFixed(2)}</span></div>
                          <div className="space-x-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditZone(zone)}><Edit className="h-3 w-3"/></Button>
                            <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteZone(zone.id)}><Trash2 className="h-3 w-3"/></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  }
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default AdminPage;
