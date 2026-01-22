import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { useMemo } from "react";

interface TimelineDisplayProps {
  yearsToFreedom: number;
  freedomPercentage: number;
}

export const TimelineDisplay = ({ yearsToFreedom, freedomPercentage }: TimelineDisplayProps) => {
  const displayYears = useMemo(() => {
    if (!isFinite(yearsToFreedom) || yearsToFreedom < 0) return "—";
    if (yearsToFreedom === 0 || freedomPercentage >= 100) return "0";
    if (yearsToFreedom > 50) return "50+";
    return yearsToFreedom.toFixed(1);
  }, [yearsToFreedom, freedomPercentage]);

  const getMessage = useMemo(() => {
    if (freedomPercentage >= 100) {
      return {
        primary: "Você já conquistou sua autonomia.",
        secondary: "Seu estilo de vida é autossustentável.",
        encouragement: "Você fez o que poucos conseguem. Aproveite cada momento."
      };
    }
    if (!isFinite(yearsToFreedom) || yearsToFreedom < 0) {
      return {
        primary: "Defina seu aporte mensal",
        secondary: "para visualizar sua trajetória.",
        encouragement: "Não tenha pressa. A clareza vem com o tempo."
      };
    }
    if (yearsToFreedom <= 5) {
      return {
        primary: "Autonomia ao alcance.",
        secondary: "O horizonte está próximo.",
        encouragement: "Poucos anos podem parecer muito, mas você já percorreu o mais difícil."
      };
    }
    if (yearsToFreedom <= 15) {
      return {
        primary: "Uma trajetória clara se desenha.",
        secondary: "Cada mês é um passo firme.",
        encouragement: "Você não precisa correr. Consistência é mais poderosa que velocidade."
      };
    }
    return {
      primary: "Uma jornada longa, mas possível.",
      secondary: "O caminho se faz caminhando.",
      encouragement: "Ajustar os aportes é natural. Faça no seu ritmo, sem culpa."
    };
  }, [yearsToFreedom, freedomPercentage]);

  const isAchieved = freedomPercentage >= 100;

  return (
    <motion.div
      className="card-glass text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        {isAchieved ? (
          <Sparkles size={16} strokeWidth={1.5} className="text-emerald" />
        ) : (
          <Clock size={16} strokeWidth={1.5} className="text-bronze" />
        )}
        <span className="text-[10px] font-sans text-muted-foreground tracking-[0.25em] uppercase font-medium">
          {isAchieved ? "Conquista" : "Tempo até a Opção"}
        </span>
      </div>

      <motion.div
        key={displayYears}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <span className={`text-5xl md:text-6xl font-serif ${isAchieved ? 'text-emerald' : 'text-foreground'}`}>
          {displayYears}
        </span>
        {displayYears !== "—" && (
          <span className="text-lg font-sans text-muted-foreground ml-2">
            {displayYears === "0" ? "" : yearsToFreedom === 1 ? "ano" : "anos"}
          </span>
        )}
      </motion.div>

      <div className="space-y-2">
        <p className="text-sm font-sans text-foreground font-medium">
          {getMessage.primary}
        </p>
        <p className="text-xs font-sans text-muted-foreground font-light">
          {getMessage.secondary}
        </p>
        <p className="text-[11px] font-sans text-bronze/70 font-light italic mt-2">
          ✦ {getMessage.encouragement}
        </p>
      </div>

      {/* Decorative line */}
      <motion.div 
        className="mt-8 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-bronze/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />

      {/* Insight text */}
      <motion.p
        className="mt-6 text-xs font-sans text-muted-foreground/70 font-light italic max-w-xs mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        Neste ritmo, seu estilo de vida será autossustentável em {displayYears} anos.
      </motion.p>
    </motion.div>
  );
};
