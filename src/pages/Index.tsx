import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Wallet, PiggyBank, Lock, TrendingUp, Sparkles, ShieldCheck, CheckCircle2, Quote } from "lucide-react";
import { z } from "zod";
import { AutonomyCircle } from "@/components/AutonomyCircle";
import { AuditInput } from "@/components/AuditInput";
import { InvestmentSlider } from "@/components/InvestmentSlider";
import { TimelineDisplay } from "@/components/TimelineDisplay";
import { DEFAULT_MULTIPLIER } from "@/config/financial";
import { calculateFreedomMetrics } from "@/lib/financial-math";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";

// Schema for financial inputs to ensure safety and integrity
const MoneySchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    if (val === "" || val === undefined || val === null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  })
  .pipe(
    z.number()
      .min(0, "Value cannot be negative")
      .max(Number.MAX_SAFE_INTEGER, "Value is too large for safe calculation")
  );

const Index = () => {
  const [lifestyleCost, setLifestyleCost] = usePersistedState("audit_lifestyle_cost", "");
  const [currentAssets, setCurrentAssets] = usePersistedState("audit_current_assets", "");
  const [monthlyInvestment, setMonthlyInvestment] = usePersistedState("audit_monthly_investment", 5000);
  const [isUnlocked, setIsUnlocked] = usePersistedState("audit_unlocked", false);
  const [userLeadName, setUserLeadName] = usePersistedState("audit_user_name", "");

  const calculations = useMemo(() => {
    // Validate inputs using Zod schema
    const monthly = MoneySchema.parse(lifestyleCost);
    const assets = MoneySchema.parse(currentAssets);
    const investment = MoneySchema.parse(monthlyInvestment);

    return calculateFreedomMetrics(monthly, assets, investment);
  }, [lifestyleCost, currentAssets, monthlyInvestment]);

  const hasInputs = lifestyleCost || currentAssets;

  const handleUnlock = (name: string) => {
    setUserLeadName(name);
    setIsUnlocked(true);
  };

  const handleContactSarah = () => {
    const phone = "551151929255";
    const text = "Olá Sarah! Acabei de desbloquear minha data no Freedom Horizon e gostaria de reivindicar meu diagnóstico gratuito de 30min.";
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="py-12 md:py-16 px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gem size={16} strokeWidth={1.5} className="text-bronze" />
          <span className="text-[10px] font-sans text-muted-foreground tracking-[0.35em] uppercase font-medium">
            Wealth Timeline
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground tracking-tight leading-tight">
          A Data da Sua Liberdade
        </h1>
        <p className="mt-5 text-muted-foreground font-sans text-sm max-w-lg mx-auto leading-relaxed font-light">
          Não é sobre quanto dinheiro você tem, mas quanto tempo ele compra.
          <span className="block mt-2 text-bronze/70 italic text-xs">
            Descubra quando você se torna opcionalmente empregável.
          </span>
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Input Section */}
          <motion.section
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="card-glass space-y-10">
              <AuditInput
                label="Custo do Estilo de Vida"
                sublabel="Qual o custo mensal para manter seu padrão de vida hoje?"
                hint="Não julgue seus gastos. Apenas observe com curiosidade."
                value={lifestyleCost}
                onChange={setLifestyleCost}
                icon={Wallet}
                placeholder="20.000"
                delay={0.1}
              />

              <AuditInput
                label="Patrimônio Líquido"
                sublabel="Quanto você tem investido e disponível hoje?"
                hint="Qualquer valor é um começo válido. Zero também é um ponto de partida."
                value={currentAssets}
                onChange={setCurrentAssets}
                icon={PiggyBank}
                placeholder="800.000"
                delay={0.2}
              />

              <InvestmentSlider
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                min={1000}
                max={50000}
                step={500}
                delay={0.3}
              />
            </div>

            {/* Info Card */}
            <motion.div
              className="p-6 bg-emerald-light/30 rounded-2xl border border-emerald/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-xs font-sans text-charcoal-soft leading-relaxed mb-3">
                <span className="font-medium text-emerald">Metodologia:</span> Seu patrimônio alvo
                é calculado multiplicando seu custo mensal por {DEFAULT_MULTIPLIER} (regra dos 25 anos), permitindo
                retiradas sustentáveis de aproximadamente {(1 / DEFAULT_MULTIPLIER * 100).toFixed(1).replace('.', ',')}% ao ano do patrimônio.
              </p>
              <p className="text-[11px] font-sans text-muted-foreground/70 leading-relaxed italic">
                ✦ Lembre-se: este é um norte, não uma sentença. A vida muda, os planos se adaptam,
                e tudo bem recalcular a rota quantas vezes precisar.
              </p>
            </motion.div>
          </motion.section>

          {/* Results Section */}
          <section className="space-y-10 relative">
            {hasInputs ? (
              <>
                <AutonomyCircle
                  percentage={calculations.percentage}
                  freedomNumber={calculations.freedomNumber}
                />

                <AnimatePresence mode="wait">
                  {!isUnlocked ? (
                    /* LOCKED STATE: Fog of Opportunity */
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.5 } }}
                      className="relative isolate"
                    >
                      <div
                        className="blur-[5px] opacity-60 pointer-events-none select-none [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)]"
                      >
                        <TimelineDisplay
                          yearsToFreedom={calculations.yearsToFreedom}
                          freedomPercentage={calculations.percentage}
                        />
                        <div className="h-20" /> {/* Spacer */}
                      </div>

                      {/* The Gate */}
                      <div className="absolute inset-0 flex items-center justify-center z-20 -mt-10">
                        <div className="w-full max-w-sm px-6">
                          <div className="bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-center ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-bronze/10 via-transparent to-emerald/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10 flex flex-col items-center">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-bronze to-bronze-dark flex items-center justify-center mb-5 shadow-lg shadow-bronze/20"
                              >
                                <Lock className="w-6 h-6 text-white" strokeWidth={2} />
                              </motion.div>

                              <h3 className="text-xl font-serif text-foreground mb-2">
                                Sua estratégia está pronta
                              </h3>
                              <p className="text-sm text-muted-foreground mb-6 font-light leading-relaxed">
                                Calculamos a data exata da sua liberdade. Libere o acesso ao cronograma completo e à análise de aceleração.
                              </p>
                              <LeadForm onSuccess={handleUnlock} />
                              <p className="text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5 opacity-60">
                                <ShieldCheck size={10} /> Seus dados estão seguros
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* UNLOCKED STATE: The Revelation Dashboard */
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="space-y-8 relative"
                    >
                      {/* 1. Headline & Headline */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="text-center space-y-2 mb-8"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium uppercase tracking-widest border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Análise Desbloqueada
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                          Sua liberdade chega em <span className="text-bronze underline decoration-bronze/30 underline-offset-4">{Math.floor(calculations.yearsToFreedom)} anos</span>
                        </h2>
                        <p className="text-muted-foreground font-light max-w-lg mx-auto">
                          Com sua capacidade de aporte atual de R$ {calculations.monthlyInvestment.toLocaleString('pt-BR')},
                          este é o cenário base conservador.
                        </p>
                      </motion.div>

                      {/* 2. The Proof (Chart) */}
                      <motion.div
                        initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="p-1 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 shadow-2xl"
                      >
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 md:p-8">
                          <TimelineDisplay
                            yearsToFreedom={calculations.yearsToFreedom}
                            freedomPercentage={calculations.percentage}
                          />
                        </div>
                      </motion.div>

                      {/* 3. Insights & Upsell */}
                      <div className="grid md:grid-cols-3 gap-6">

                        {/* Card A: Acceleration Potential */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="md:col-span-1 p-6 rounded-2xl bg-secondary/30 border border-border flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                              <TrendingUp size={20} />
                            </div>
                            <h4 className="font-medium text-foreground mb-2">Potencial de Aceleração</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              O modelo assume 5% a.a. Se otimizarmos a alocação fiscal da sua carteira para atingir 6.5% reais,
                              você pode antecipar essa data em até <strong>{(calculations.yearsToFreedom * 0.3).toFixed(1)} anos</strong>.
                            </p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-border/50">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cenário Otimista</span>
                            <p className="text-lg font-serif text-foreground">{(calculations.yearsToFreedom * 0.7).toFixed(1)} Anos</p>
                          </div>
                        </motion.div>

                        {/* Card B: Sarah Consultation (Personalized) */}
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-bronze/30 shadow-lg group"
                        >
                          {/* Elemento decorativo de fundo */}
                          <div className="absolute top-0 right-0 p-3 opacity-5 text-bronze">
                            <Quote size={80} />
                          </div>

                          <div className="p-6 h-full flex flex-col md:flex-row gap-6 items-center relative z-10">

                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-bronze to-secondary p-[2px]">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                  <span className="font-serif text-2xl text-bronze">S</span>
                                  {/* Se tiver a foto: <img src="..." className="w-full h-full object-cover" /> */}
                                </div>
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center" title="Online Agora">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              </div>
                            </div>

                            {/* Texto e Call to Action */}
                            <div className="flex-1 text-center md:text-left">
                              <h3 className="text-lg font-serif text-foreground mb-1">
                                "Vamos validar sua estratégia, {userLeadName || 'Investidora'}?"
                              </h3>
                              <p className="text-sm text-muted-foreground mb-5 font-light leading-relaxed">
                                Os números são apenas o começo. Clique abaixo para me chamar no WhatsApp e agendar nossa conversa.
                              </p>

                              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                {/* BOTÃO CORRIGIDO: Alto Contraste */}
                                <Button
                                  onClick={handleContactSarah}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-900/10 h-11 px-6 min-w-[200px]"
                                >
                                  <div className="flex items-center gap-2">
                                    {/* Ícone do Whats */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Falar com Sarah
                                  </div>
                                </Button>

                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                                  Baixar Relatório PDF
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                className="card-glass flex flex-col items-center justify-center min-h-[450px] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-8">
                  <Gem size={24} strokeWidth={1} className="text-bronze" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-3">
                  Inicie sua Auditoria
                </h3>
                <p className="text-muted-foreground font-sans text-sm max-w-xs font-light leading-relaxed">
                  Preencha os campos ao lado para visualizar sua trajetória até a autonomia financeira.
                </p>
                <p className="text-bronze/70 font-sans text-xs max-w-xs font-light italic leading-relaxed mt-4">
                  ✦ Não existe resposta certa. Este é um exercício de autoconhecimento,
                  não de julgamento.
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="py-10 text-center border-t border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <p className="text-[10px] font-sans text-muted-foreground tracking-[0.2em] uppercase">
          Para mulheres que escolhem construir patrimônio
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
