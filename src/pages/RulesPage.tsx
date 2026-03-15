import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import { ScrollText, Lock, Handshake } from 'lucide-react';

interface Rule {
  id: string;
  category: 'interne' | 'social';
  title: string;
  content: string;
  sort_order: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('system_rules').select('*').eq('is_public', true).order('sort_order');
      if (data) setRules(data as Rule[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const interneRules = rules.filter(r => r.category === 'interne');
  const socialRules = rules.filter(r => r.category === 'social');

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <PageHeader title="Règlement du Système" icon={ScrollText} />

      {/* Internal rules */}
      {interneRules.length > 0 && (
        <section>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Lock className="w-4 h-4 text-gold/60" />
            <h2 className="font-display text-lg text-gold tracking-wider">Règles internes</h2>
            <div className="flex-1 divider-ornate" />
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
            {interneRules.map((rule, i) => (
              <motion.div
                key={rule.id}
                variants={itemVariants}
                className="card-grimoire p-4 hover-ember"
              >
                <div className="flex items-start gap-3">
                  <span className="text-gold/40 font-display text-sm mt-0.5">{i + 1}.</span>
                  <div>
                    <h3 className="text-sm font-ui text-foreground font-medium">{rule.title}</h3>
                    {rule.content && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{rule.content}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Serpent divider */}
      {interneRules.length > 0 && socialRules.length > 0 && <div className="divider-serpent" />}

      {/* Social rules */}
      {socialRules.length > 0 && (
        <section>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Handshake className="w-4 h-4 text-gold/60" />
            <h2 className="font-display text-lg text-gold tracking-wider">Interactions sociales</h2>
            <div className="flex-1 divider-ornate" />
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
            {socialRules.map((rule, i) => (
              <motion.div
                key={rule.id}
                variants={itemVariants}
                className="card-grimoire p-4 hover-ember"
              >
                <div className="flex items-start gap-3">
                  <span className="text-gold/40 font-display text-sm mt-0.5">{i + 1}.</span>
                  <div>
                    <h3 className="text-sm font-ui text-foreground font-medium">{rule.title}</h3>
                    {rule.content && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{rule.content}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {rules.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Aucun règlement publié pour le moment.</p>
      )}
    </div>
  );
}
