
import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { logUserAction } from '../services/auditLogger';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await logUserAction('Login', 'Auth', `Login realizado via web: ${email}`);
      onLogin(); 
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = 'Falha ao autenticar. Verifique suas credenciais.';
      
      await logUserAction('Falha Login', 'Auth', `Tentativa frustrada para: ${email}`);

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
              LC
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400 text-sm">Acesse o painel do Landi Consultores ERP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="admin@landi.co.mz"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
                <ShieldCheck size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Esqueceu sua senha? <button className="text-blue-400 hover:text-blue-300 transition-colors">Contate o suporte</button>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
            <p className="text-xs text-gray-600">
                &copy; {new Date().getFullYear()} Landi Consultores. Todos os direitos reservados.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
