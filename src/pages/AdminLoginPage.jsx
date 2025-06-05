import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/contexts/AdminContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { settings } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/LoginAdmin.txt');
      if (!response.ok) {
        throw new Error('Arquivo de credenciais não encontrado.');
      }
      const text = await response.text();
      const lines = text.split('\n');
      const storedLogin = lines.find(line => line.startsWith('Login:'))?.split(':')[1]?.trim();
      const storedPassword = lines.find(line => line.startsWith('Senha:'))?.split(':')[1]?.trim();

      if (username === storedLogin && password === storedPassword) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast({
          title: 'Login bem-sucedido!',
          description: 'Redirecionando para o painel administrativo...',
        });
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast({
          title: 'Falha no Login',
          description: 'Usuário ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao tentar fazer login',
        description: error.message || 'Ocorreu um problema. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/e7698b0a-57cc-48b5-9074-5853220a1132/a2da475007f7bf9dc1b95cb698852758.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, var(--theme-bg-gradient-start-hex), var(--theme-bg-gradient-end-hex))' }}>
       <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <img src={logoUrl} alt={`${settings.storeName} Logo`} className="h-20 w-auto" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glass-effect">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--theme-color-primary-hex)'}} />
            <CardTitle className="text-3xl font-bold" style={{ color: 'var(--theme-text-main-hex)'}}>Acesso Administrativo</CardTitle>
            <CardDescription style={{ color: 'var(--theme-text-muted-hex)'}}>Entre com suas credenciais para gerenciar o {settings.storeName}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" style={{ color: 'var(--theme-text-main-hex)'}}>Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--theme-text-muted-hex)'}} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'var(--theme-text-main-hex)'}}>Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--theme-text-muted-hex)'}} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full button-primary h-12 text-lg" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
       <p className="mt-8 text-sm" style={{ color: 'var(--theme-text-muted-hex)'}}>
        &copy; {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default AdminLoginPage;