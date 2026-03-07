import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, setupAdmin, isFirstSetup } = useSystem();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFirstSetup) {
      if (password.length < 6) { setError('Minimum 6 caractères'); return; }
      if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
      setupAdmin(password);
    } else {
      if (!login(password)) setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card-grimoire p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
          <h1 className="font-display text-xl text-foreground">
            {isFirstSetup ? 'Configuration Admin' : 'Connexion Admin'}
          </h1>
          {isFirstSetup && <p className="text-sm text-muted-foreground font-ui mt-1">Créez votre mot de passe administrateur</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {isFirstSetup && (
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          )}
          {error && <p className="text-destructive text-xs font-ui">{error}</p>}
          <button type="submit" className="btn-grimoire w-full">
            {isFirstSetup ? 'Créer le compte' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
