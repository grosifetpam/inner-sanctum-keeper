import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login, signup } = useSystem();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignup) {
      if (password.length < 6) { setError('Minimum 6 caractères'); setLoading(false); return; }
      if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); setLoading(false); return; }
      const err = await signup(email, password);
      if (err) { setError(err); } else { setMessage('Vérifiez votre email pour confirmer votre compte.'); }
    } else {
      const err = await login(email, password);
      if (err) setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card-grimoire p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
          <h1 className="font-display text-xl text-foreground">
            {isSignup ? 'Créer un compte' : 'Connexion Admin'}
          </h1>
          <p className="text-sm text-muted-foreground font-ui mt-1">
            {isSignup ? 'Créez votre compte administrateur' : 'Connectez-vous pour gérer le système'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-input border border-border rounded px-3 py-2 pl-10 text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          )}
          {error && <p className="text-destructive text-xs font-ui">{error}</p>}
          {message && <p className="text-primary text-xs font-ui">{message}</p>}
          <button type="submit" className="btn-grimoire w-full" disabled={loading}>
            {loading ? '...' : isSignup ? 'Créer le compte' : 'Se connecter'}
          </button>
        </form>

        <button
          onClick={() => { setIsSignup(!isSignup); setError(''); setMessage(''); }}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4 font-ui transition-colors"
        >
          {isSignup ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
        </button>
      </div>
    </div>
  );
}
