import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";

interface InvestmentSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  delay?: number;
}

export const InvestmentSlider = ({
  value,
  onChange,
  min = 1000,
  max = 50000,
  step = 500,
  delay = 0,
}: InvestmentSliderProps) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2.5 rounded-xl bg-secondary/50 text-muted-foreground group-hover:text-bronze group-hover:bg-bronze/10 transition-all duration-500">
          <TrendingUp size={18} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-sans font-medium text-muted-foreground tracking-wide uppercase mb-1">
            Aporte Mensal
          </label>
          <p className="text-[11px] font-sans text-muted-foreground/70 mb-2 font-light leading-relaxed">
            Quanto você consegue destinar para sua liberdade por mês?
          </p>
          <p className="text-[11px] font-sans text-bronze/70 mb-4 font-light leading-relaxed italic">
            ✦ Não existe valor certo ou errado. Comece com o que é confortável para você hoje.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <motion.span 
                key={value}
                className="text-3xl font-serif text-foreground"
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatCurrency(value)}
              </motion.span>
              <span className="text-xs text-muted-foreground font-sans">
                por mês
              </span>
            </div>
            
            <Slider
              value={[value]}
              onValueChange={([newValue]) => onChange(newValue)}
              min={min}
              max={max}
              step={step}
              className="slider-luxury"
            />
            
            <div className="flex justify-between text-[10px] text-muted-foreground/60 font-sans tracking-wide">
              <span>{formatCurrency(min)}</span>
              <span>{formatCurrency(max)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
