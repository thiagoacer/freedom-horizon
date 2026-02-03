import { motion } from "framer-motion";
import { TrendingUp, Zap, ArrowRight } from "lucide-react";

interface AccelerationCardProps {
  currentYears: number;
  acceleratedYears: number;
  yearsReduced: number;
  opportunityCost: number;
}

export const AccelerationCard = ({
  currentYears,
  acceleratedYears,
  yearsReduced,
  opportunityCost,
}: AccelerationCardProps) => {
  const percentageReduction = ((yearsReduced / currentYears) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border border-blue-200 dark:border-blue-900/30 flex flex-col justify-between min-h-[280px]"
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground uppercase tracking-wider">
              Potencial de Aceleração
            </h4>
            <p className="text-[10px] text-muted-foreground">Com estratégia otimizada</p>
          </div>
        </div>

        {/* Comparison Visual */}
        <div className="space-y-4 mb-5">
          {/* Current Timeline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Cenário Atual</span>
              <span className="font-medium text-foreground">
                {Math.floor(currentYears)} anos
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex items-center justify-center">
            <ArrowRight size={16} className="text-emerald-600" />
          </div>

          {/* Accelerated Timeline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Com Otimização</span>
              <span className="font-medium text-emerald-600">
                {Math.floor(acceleratedYears)} anos
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(acceleratedYears / currentYears) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900/30">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Redução
            </div>
            <div className="text-xl font-serif text-emerald-600">
              {yearsReduced.toFixed(1)} anos
            </div>
            <div className="text-[9px] text-emerald-600 font-medium">
              -{percentageReduction}% tempo
            </div>
          </div>

          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900/30">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Ganho Financeiro
            </div>
            <div className="text-lg font-serif text-blue-600">
              {opportunityCost >= 1000000
                ? `R$ ${(opportunityCost / 1000000).toFixed(1)}M`
                : `R$ ${(opportunityCost / 1000).toFixed(0)}k`}
            </div>
            <div className="text-[9px] text-blue-600 font-medium">
              Valor adicional
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Insight */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
          <TrendingUp size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Otimizando para <strong className="text-foreground">6.5% a.a.</strong>, você
            antecipa sua liberdade significativamente.
          </span>
        </p>
      </div>
    </motion.div>
  );
};
