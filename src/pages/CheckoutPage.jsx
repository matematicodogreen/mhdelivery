
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, MapPin, User, Phone, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { settings, decreaseStock } = useAdmin();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    complement: '',
    observations: '',
  });

  const subtotal = getTotalPrice();
  
  const deliveryFee = React.useMemo(() => {
    if (selectedZoneId && settings.deliveryZones && settings.deliveryZones.length > 0) {
      const zone = settings.deliveryZones.find(z => z.id === selectedZoneId);
      return zone ? zone.fee : (settings.defaultDeliveryFee || 0);
    }
    return settings.defaultDeliveryFee || 0;
  }, [selectedZoneId, settings.deliveryZones, settings.defaultDeliveryFee]);

  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (settings.deliveryZones && settings.deliveryZones.length > 0 && !selectedZoneId) {
       // setSelectedZoneId(settings.deliveryZones[0].id); 
    }
  }, [settings.deliveryZones, selectedZoneId]);


  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customerData.name || !customerData.phone || !customerData.address || !paymentMethod) {
      toast({ title: "Campos obrigatórios", description: "Por favor, preencha nome, telefone, endereço e forma de pagamento.", variant: "destructive" });
      return false;
    }
    if (settings.deliveryZones && settings.deliveryZones.length > 0 && !selectedZoneId) {
      toast({ title: "Zona de entrega", description: "Por favor, selecione uma zona de entrega.", variant: "destructive" });
      return false;
    }
    if (subtotal < settings.minOrderValue) {
      toast({ title: "Valor mínimo não atingido", description: `O pedido mínimo é de R$ ${settings.minOrderValue.toFixed(2)}`, variant: "destructive" });
      return false;
    }
    // Validate stock for each item in cart
    for (const item of cartItems) {
      const productInAdmin = settings.products.find(p => p.id === item.id);
      if (!productInAdmin || productInAdmin.stock < item.quantity) {
        toast({
          title: "Estoque insuficiente",
          description: `O produto ${item.name} não tem estoque suficiente. Disponível: ${productInAdmin ? productInAdmin.stock : 0}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const generateOrderMessage = () => {
    const itemsList = cartItems.map(item => 
      `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const paymentText = paymentMethod === 'pix' ? 'PIX (Pagamento antecipado)' 
      : paymentMethod === 'credit' ? 'Cartão de Crédito (Pagamento na entrega)'
      : 'Cartão de Débito (Pagamento na entrega)';
    
    const selectedZone = settings.deliveryZones?.find(z => z.id === selectedZoneId);
    const deliveryZoneText = selectedZone ? `\n🛵 *Zona de Entrega:* ${selectedZone.name}` : '';

    return `🛒 *NOVO PEDIDO - ${settings.storeName}*

👤 *Cliente:* ${customerData.name}
📱 *Telefone:* ${customerData.phone}
📍 *Endereço:* ${customerData.address}
${customerData.complement ? `🏠 *Complemento:* ${customerData.complement}` : ''}${deliveryZoneText}

📦 *Itens do Pedido:*
${itemsList}

💰 *Resumo do Pedido:*
Subtotal: R$ ${subtotal.toFixed(2)}
Taxa de entrega: R$ ${deliveryFee.toFixed(2)}
*Total: R$ ${total.toFixed(2)}*

💳 *Forma de Pagamento:* ${paymentText}

${customerData.observations ? `📝 *Observações:* ${customerData.observations}` : ''}

---
Pedido realizado através do app de delivery`;
  };

  const handleFinishOrder = () => {
    if (!validateForm()) return;

    // Decrease stock for each item
    cartItems.forEach(item => {
      decreaseStock(item.id, item.quantity);
    });

    const message = generateOrderMessage();
    if (paymentMethod === 'pix') {
      if (!settings.whatsappNumber) {
        toast({ title: "WhatsApp não configurado", description: "O número do WhatsApp não foi configurado pelo administrador.", variant: "destructive" });
        return;
      }
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
      clearCart();
      toast({ title: "Pedido enviado!", description: "Você será redirecionado para o WhatsApp para finalizar o pagamento via PIX." });
      window.open(whatsappUrl, '_blank');
      navigate('/');
    } else {
      if (settings.whatsappNumber) {
        const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
      clearCart();
      toast({ title: "Pedido confirmado!", description: "Seu pedido foi enviado e será entregue em breve. O pagamento será feito na entrega." });
      navigate('/');
    }
  };

  if (cartItems.length === 0 && !navigate.state?.fromOrderConfirmation) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6" style={{color: 'var(--theme-text-muted-hex)'}}/>
          <h1 className="text-2xl font-bold mb-4">Carrinho vazio</h1>
          <p className="mb-8" style={{color: 'var(--theme-text-muted-hex)'}}>Adicione produtos ao carrinho para continuar.</p>
          <Button onClick={() => navigate('/')} className="button-primary">
            Voltar às Compras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar às Compras
          </Button>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Finalizar Pedido</h1>
          <p style={{color: 'var(--theme-text-muted-hex)'}}>Preencha seus dados para concluir a compra.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center"><User className="w-5 h-5 mr-2" />Dados Pessoais</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="name">Nome Completo *</Label><Input id="name" value={customerData.name} onChange={(e) => handleInputChange('name', e.target.value)} required /></div>
                  <div><Label htmlFor="phone">Telefone *</Label><Input id="phone" value={customerData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required /></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle className="flex items-center"><MapPin className="w-5 h-5 mr-2" />Endereço de Entrega</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(settings.deliveryZones && settings.deliveryZones.length > 0) && (
                  <div>
                    <Label htmlFor="deliveryZone">Zona de Entrega *</Label>
                    <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                      <SelectTrigger><SelectValue placeholder="Selecione a localidade" /></SelectTrigger>
                      <SelectContent>
                        {settings.deliveryZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>{zone.name} - R$ {zone.fee.toFixed(2)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div><Label htmlFor="address">Endereço Completo (Rua, N°, Bairro) *</Label><Textarea id="address" value={customerData.address} onChange={(e) => handleInputChange('address', e.target.value)} rows={2} required /></div>
                <div><Label htmlFor="complement">Complemento/Referência</Label><Input id="complement" value={customerData.complement} onChange={(e) => handleInputChange('complement', e.target.value)} /></div>
                <div><Label htmlFor="observations">Observações</Label><Textarea id="observations" value={customerData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} rows={2} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Forma de Pagamento *</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  {value: 'pix', label: 'PIX', icon: Smartphone, desc: 'Pagamento antecipado via WhatsApp'},
                  {value: 'credit', label: 'Cartão de Crédito', icon: CreditCard, desc: 'Pagamento na entrega'},
                  {value: 'debit', label: 'Cartão de Débito', icon: CreditCard, desc: 'Pagamento na entrega'},
                ].map(opt => (
                  <motion.div key={opt.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-primary bg-primary/10' : 'hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                      <opt.icon className="w-5 h-5 mr-3" style={{color: 'var(--theme-color-primary-hex)'}} />
                      <div><div className="font-semibold">{opt.label}</div><div className="text-sm" style={{color: 'var(--theme-text-muted-hex)'}}>{opt.desc}</div></div>
                    </label>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1"><h4 className="font-semibold text-sm">{item.name}</h4><p className="text-sm" style={{color: 'var(--theme-text-muted-hex)'}}>{item.quantity}x R$ {item.price.toFixed(2)}</p></div>
                      <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-3 space-y-2">
                  <div className="flex justify-between"><span>Subtotal:</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Taxa de entrega:</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total:</span><span style={{color: 'var(--theme-color-primary-hex)'}}>R$ {total.toFixed(2)}</span></div>
                </div>
                {subtotal < settings.minOrderValue && (
                  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-3 mt-3 text-sm">
                    Pedido mínimo: R$ {settings.minOrderValue.toFixed(2)}. Adicione mais R$ {(settings.minOrderValue - subtotal).toFixed(2)}.
                  </div>
                )}
                <Button onClick={handleFinishOrder} disabled={subtotal < settings.minOrderValue || (settings.deliveryZones && settings.deliveryZones.length > 0 && !selectedZoneId)} className="w-full button-primary mt-4 py-3">
                  {paymentMethod === 'pix' ? 'Finalizar com PIX' : 'Confirmar Pedido'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
