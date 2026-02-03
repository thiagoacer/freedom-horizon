import { motion } from "framer-motion";
import { Users, TrendingUp, Sparkles } from "lucide-react";

export const SocialProof = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-3 mb-6"
    >
      {/* Stats Row */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users size={14} className="text-emerald-600" />
          <span><strong className="text-foreground">347</strong> mulheres já descobriram</span>
        </div>
      </div>

      {/* Mini Testimonial */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
            M
          </div>
          <div className="flex-1">
            <p className="text-xs text-foreground/90 leading-relaxed mb-2">
              "Descobri que poderia me aposentar <strong>5 anos mais cedo</strong> apenas otimizando meus investimentos."
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium">
                Maria L. — Executiva
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} size={8} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Average Stat */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp size={12} className="text-bronze" />
          <span>Aceleração média: <strong className="text-foreground">4.2 anos</strong></span>
        </div>
      </div>
    </motion.div>
  );
};
