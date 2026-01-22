import { motion } from "framer-motion";
import { useMemo } from "react";

interface AutonomyCircleProps {
  percentage: number;
  freedomNumber: number;
}

export const AutonomyCircle = ({ percentage, freedomNumber }: AutonomyCircleProps) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusMessage = useMemo(() => {
    if (clampedPercentage >= 100) return { 
      text: "Autonomia Plena", 
      subtitle: "Você conquistou o direito de escolher como usar seu tempo.",
      encouragement: "Esta é uma jornada rara. Celebre cada passo.",
      color: "text-emerald"
    };
    if (clampedPercentage >= 50) return { 
      text: "Meio Caminho", 
      subtitle: "Você já possui a metade do seu tempo.",
      encouragement: "Respire fundo. Você está mais perto do que imagina.",
      color: "text-emerald"
    };
    if (clampedPercentage >= 25) return { 
      text: "Construindo Momentum", 
      subtitle: "Uma fundação sólida está se formando.",
      encouragement: "Cada aporte é um tijolo na casa da sua liberdade.",
      color: "text-bronze"
    };
    if (clampedPercentage >= 5) return { 
      text: "Em Movimento", 
      subtitle: "Você já deu o passo mais difícil: começar.",
      encouragement: "A maioria das pessoas nunca chega aqui. Você chegou.",
      color: "text-bronze"
    };
    return { 
      text: "O Início de Tudo", 
      subtitle: "Este é o ponto de partida da sua jornada.",
      encouragement: "Saber onde você está é o primeiro ato de coragem.",
      color: "text-charcoal-soft"
    };
  }, [clampedPercentage]);

  return (
    <div className="relative flex flex-col items-center">
      <motion.div 
        className="animate-breathe relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            className="opacity-50"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="url(#bronzeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            className="progress-ring"
          />

          {/* Inner decorative circle */}
          <circle
            cx="140"
            cy="140"
            r="100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            className="opacity-30"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(35, 40%, 70%)" />
              <stop offset="100%" stopColor="hsl(158, 35%, 35%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-4xl md:text-5xl font-serif text-foreground tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {clampedPercentage.toFixed(1)}%
          </motion.span>
          <motion.span 
            className="text-xs font-sans text-muted-foreground mt-2 tracking-[0.2em] uppercase font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            da sua liberdade
          </motion.span>
        </div>
      </motion.div>

      {/* Status message */}
      <motion.div 
        className="mt-10 text-center max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <h3 className={`text-xl font-serif ${statusMessage.color}`}>{statusMessage.text}</h3>
        <p className="text-muted-foreground font-sans text-sm mt-2 font-light leading-relaxed">
          {statusMessage.subtitle}
        </p>
        <p className="text-bronze/80 font-sans text-xs mt-3 font-light italic leading-relaxed">
          {statusMessage.encouragement}
        </p>
      </motion.div>

      {/* Freedom target */}
      <motion.div 
        className="mt-8 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <span className="text-[10px] font-sans text-muted-foreground tracking-[0.25em] uppercase">
          Patrimônio Alvo
        </span>
        <span className="text-lg font-serif text-bronze">
          {formatCurrency(freedomNumber)}
        </span>
      </motion.div>
    </div>
  );
};
