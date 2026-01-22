import { useMemo } from "react";
import { motion } from "framer-motion";
import { Gem, Wallet, PiggyBank, Lock, TrendingUp } from "lucide-react";
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

  const calculations = useMemo(() => {
    // Validate inputs using Zod schema
    const monthly = MoneySchema.parse(lifestyleCost);
    const assets = MoneySchema.parse(currentAssets);
    const investment = MoneySchema.parse(monthlyInvestment);

    return calculateFreedomMetrics(monthly, assets, investment);
  }, [lifestyleCost, currentAssets, monthlyInvestment]);

  const hasInputs = lifestyleCost || currentAssets;

  const handleUnlock = () => {
    setIsUnlocked(true);
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
            Lifestyle Equity Audit
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground tracking-tight leading-tight">
          Sua Autonomia
        </h1>
        <p className="mt-5 text-muted-foreground font-sans text-sm max-w-lg mx-auto leading-relaxed font-light">
          Visualize quanto do seu estilo de vida você já comprou para sempre.
          <span className="block mt-2 text-bronze/70 italic text-xs">
            Este é um espaço seguro para olhar seus números com honestidade e gentileza.
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

                <div className="relative">
                  {/* The Gated Content */}
                  <div className={isUnlocked ? "" : "filter blur-md select-none pointer-events-none transition-all duration-1000"}>
                    <TimelineDisplay
                      yearsToFreedom={calculations.yearsToFreedom}
                      freedomPercentage={calculations.percentage}
                    />

                    {/* Hero insight - also blurred if locked */}
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <p className="text-lg font-serif text-foreground leading-relaxed">
                        Você já comprou{" "}
                        <span className="text-bronze font-medium">
                          {calculations.percentage.toFixed(1)}%
                        </span>{" "}
                        da sua liberdade vitalícia.
                      </p>
                    </motion.div>
                  </div>

                  {/* The Gate (Lock Overlay) */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 top-0 -bottom-10 flex flex-col items-center justify-center z-10">
                      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
                      <div className="card-glass p-8 text-center max-w-sm border-bronze/30 shadow-2xl relative z-20 animate-in fade-in zoom-in duration-500">
                        <Lock className="w-10 h-10 text-bronze mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-foreground mb-2">Revelar Data de Liberdade</h3>
                        <p className="text-xs text-muted-foreground mb-6 font-light">
                          Sua análise detalhada está pronta. Preencha seus dados para desbloquear o cronograma exato e a taxa de aceleração.
                        </p>

                        <LeadForm onSuccess={handleUnlock} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Unlock Upsell Content */}
                {isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mt-8 grid gap-6"
                  >
                    {/* Card 1: A Lógica (Autoridade) */}
                    <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
                      <h4 className="font-serif text-lg mb-2 flex items-center gap-2 text-foreground">
                        <TrendingUp className="w-4 h-4 text-emerald" />
                        Sua Taxa de Aceleração
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">
                        Consideramos uma rentabilidade real de <strong>5% ao ano</strong> acima da inflação.
                        Isso é conservador para proteger seu poder de compra. Se otimizarmos sua carteira para 7%,
                        você pode reduzir esse tempo em até <strong>30%</strong>.
                      </p>
                    </div>

                    {/* Card 2: A Sarah (Conversão High-Ticket) */}
                    <div className="p-6 rounded-2xl bg-bronze/10 border border-bronze/20 relative overflow-hidden group hover:bg-bronze/15 transition-all duration-500 cursor-pointer">
                      <div className="relative z-10 text-center md:text-left">
                        <h4 className="font-serif text-lg mb-2 text-bronze-dark">Diagnóstico com Sarah</h4>
                        <p className="text-sm text-muted-foreground mb-6 font-light">
                          Não sabe se sua carteira atual suporta essa projeção? Vamos validar seus números em uma sessão estratégica gratuita.
                        </p>
                        <Button className="w-full bg-bronze hover:bg-bronze-dark text-white shadow-lg hover:shadow-primary/20">
                          Agendar 30min Gratuitos
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
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
