import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Mail, KeyRound, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login, signup } = useSystem();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isForgot) {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) { setError(err.message); } else { setMessage('Un lien de réinitialisation a été envoyé à votre email.'); }
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fond avec image et overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-main.png')" }}
      />
      <div className="absolute inset-0 bg-overlay" />

      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Card principale */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-grimoire p-8 md:p-10 relative overflow-hidden">
          {/* Lueur décorative en haut */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/5 blur-xl rounded-full" />

          {/* Icône et titre */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4"
              animate={{ boxShadow: ['0 0 20px hsla(350,60%,45%,0.1)', '0 0 30px hsla(350,60%,45%,0.25)', '0 0 20px hsla(350,60%,45%,0.1)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <KeyRound className="w-7 h-7 text-primary" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isForgot ? 'forgot' : isSignup ? 'signup' : 'login'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-2xl text-foreground text-glow tracking-wide">
                  {isForgot ? 'Mot de passe oublié' : isSignup ? 'Créer un compte' : 'Sanctuaire'}
                </h1>
                <p className="text-sm text-muted-foreground font-body mt-2 italic">
                  {isForgot ? 'Recevez un lien de réinitialisation' : isSignup ? 'Forgez votre accès au grimoire' : 'Entrez dans les ombres du grimoire'}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Séparateur orné */}
          <div className="divider-ornate mb-8 opacity-40" />

          {/* Formulaire */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {/* Email */}
            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-input/60 border border-border rounded-md px-3.5 py-3 pl-11 text-sm font-ui text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all duration-300 focus:bg-input/80"
                required
              />
            </div>

            {/* Mot de passe */}
            <AnimatePresence>
              {!isForgot && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      className="w-full bg-input/60 border border-border rounded-md px-3.5 py-3 pl-11 pr-11 text-sm font-ui text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all duration-300 focus:bg-input/80"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirmation mot de passe */}
            <AnimatePresence>
              {isSignup && !isForgot && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full bg-input/60 border border-border rounded-md px-3.5 py-3 pl-11 text-sm font-ui text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all duration-300 focus:bg-input/80"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-destructive text-xs font-ui bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-primary text-xs font-ui bg-primary/10 border border-primary/20 rounded-md px-3 py-2"
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Bouton submit */}
            <motion.button
              type="submit"
              className="btn-grimoire w-full flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isForgot ? 'Envoyer le lien' : isSignup ? 'Forger le compte' : 'Entrer'}
                </>
              )}
            </motion.button>

            {/* Mot de passe oublié */}
            {!isSignup && !isForgot && (
              <motion.button
                type="button"
                onClick={() => { setIsForgot(true); setError(''); setMessage(''); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary font-ui transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                Mot de passe oublié ?
              </motion.button>
            )}
          </motion.form>

          {/* Séparateur */}
          <div className="divider-ornate mt-8 mb-5 opacity-40" />

          {/* Toggle signup/login/forgot */}
          <motion.button
            onClick={() => { 
              if (isForgot) { setIsForgot(false); } else { setIsSignup(!isSignup); }
              setError(''); setMessage(''); 
            }}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground font-ui transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {isForgot ? '← Retour à la connexion' : isSignup ? 'Déjà un compte ? Entrer dans le sanctuaire' : 'Pas de compte ? Forger un accès'}
          </motion.button>

          {/* Lueur décorative en bas */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
