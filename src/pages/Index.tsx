import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Wallet, PiggyBank, Lock, TrendingUp, Sparkles, ShieldCheck, CheckCircle2, Quote, Unlock, CalendarClock, MessageCircle } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { AutonomyCircle } from "@/components/AutonomyCircle";
import { AuditInput } from "@/components/AuditInput";
import { InvestmentSlider } from "@/components/InvestmentSlider";
import { TimelineDisplay } from "@/components/TimelineDisplay";
import { DEFAULT_MULTIPLIER } from "@/config/financial";
import { calculateFreedomMetrics } from "@/lib/financial-math";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { useABTest } from "@/hooks/use-ab-test";
import { useIsMobile } from "@/hooks/use-mobile";

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

  // Analytics State
  const [hasStarted, setHasStarted] = useState(false);

  // CRO Hooks
  const buttonCopyVariant = useABTest('BUTTON_COPY');
  const isMobile = useIsMobile();

  const calculations = useMemo(() => {
    // Validate inputs using Zod schema
    const monthly = MoneySchema.parse(lifestyleCost);
    const assets = MoneySchema.parse(currentAssets);
    const investment = MoneySchema.parse(monthlyInvestment);

    return calculateFreedomMetrics(monthly, assets, investment);
  }, [lifestyleCost, currentAssets, monthlyInvestment]);

  const hasInputs = lifestyleCost || currentAssets;

  // --- ANALYTICS HELPER ---
  const trackEvent = (eventName: string, params: object = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params
      });
      console.log(`📡 Evento Disparado: ${eventName}`, params);
    }
  };

  // 1. TRACK START JOURNEY
  useEffect(() => {
    if (!hasStarted && (lifestyleCost || currentAssets)) {
      setHasStarted(true);
      trackEvent("audit_start", {
        step: "input_data"
      });
    }
  }, [lifestyleCost, currentAssets, hasStarted]);

  const handleUnlock = async (formData: { name: string; email: string; whatsapp: string }) => {
    setUserLeadName(formData.name);

    // 1. Save to Supabase
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            nome: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            patrimonio_atual: parseFloat(currentAssets.toString().replace(/\./g, '')) || 0,
            custo_vida: parseFloat(lifestyleCost.toString().replace(/\./g, '')) || 0,
            anos_liberdade: parseFloat(calculations.yearsToFreedom.toFixed(2))
          }
        ]);

      if (error) throw error;
      console.log("✅ Lead salvo no Supabase!");
    } catch (err) {
      // console.error("Error saving lead (non-blocking):", err);
    }

    setIsUnlocked(true);

    // 2. TRACK COMPLETION & SEGMENTATION
    // Determine quality based on assets (Simple heuristic: > 500k is high ticket)
    const assetValue = parseFloat(currentAssets.toString().replace(/\./g, '')) || 0;
    const leadQuality = assetValue > 500000 ? "high_ticket" : "standard";

    trackEvent("audit_complete", {
      freedom_years: calculations.yearsToFreedom.toFixed(1),
      freedom_number: calculations.freedomNumber,
      current_assets: assetValue,
      percentage_done: calculations.percentage.toFixed(1),
      lead_quality: leadQuality
    });
  };

  const handleContactSarah = () => {
    // 3. TRACK CONVERSION CLICK
    trackEvent("contact_whatsapp_click", {
      location: "results_page",
      value: calculations.freedomNumber
    });

    const phone = "551151929255";
    const years = Math.floor(calculations.yearsToFreedom);
    const text = `Olá Sarah! A ferramenta me mostrou que posso ser livre em ${years} anos. Quero entender como a consultoria pode ajudar.`;
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-background relative pb-20 md:pb-0">
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
            Sarah Botelho - Planejadora Financeira
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

                              <h3 className="text-xl font-serif text-foreground mb-4 font-normal">
                                {buttonCopyVariant === 'A' ? "Sua estratégia está pronta" : "Descubra quando você para"}
                              </h3>

                              <p className="text-sm text-muted-foreground mb-8 font-light leading-relaxed max-w-[280px] mx-auto">
                                {buttonCopyVariant === 'A'
                                  ? "Calculamos a data exata da sua liberdade. Libere o acesso ao cronograma completo e à análise de aceleração."
                                  : "Pare de adivinhar. Veja exatamente quantos anos faltam para você não depender mais do seu salário."}
                              </p>

                              <LeadForm onSuccess={handleUnlock} />

                              <p className="text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5 opacity-60">
                                <ShieldCheck size={10} /> Seus dados estão seguros
                              </p>

                              <p className="text-[9px] text-muted-foreground/20 mt-2 font-mono">
                                Test Variant: {buttonCopyVariant}
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
                                {/* BOTÃO CORRIGIDO: Alto Contraste & Tracking */}
                                <Button
                                  onClick={handleContactSarah}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-900/10 h-11 px-6 min-w-[200px]"
                                >
                                  <div className="flex items-center gap-2">
                                    <MessageCircle size={18} />
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

      {/* Sticky Mobile CTA - Only visible when Unlocked & Mobile */}
      <AnimatePresence>
        {isUnlocked && isMobile && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-50 md:hidden"
          >
            <Button
              onClick={handleContactSarah}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 shadow-lg shadow-emerald-900/10"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                Falar com Sarah no WhatsApp
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="py-10 text-center border-t border-border/50 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <p className="text-[10px] font-sans text-muted-foreground tracking-[0.2em] uppercase">
          Para mulheres que escolhem construir patrimônio
        </p>
        <p className="text-[10px] font-sans text-muted-foreground/50">
          © 2025 Todos os direitos reservados. <br />
          Sarah Botelho & Agência Flow.
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
