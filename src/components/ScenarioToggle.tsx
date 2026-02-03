import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Target } from "lucide-react";

export type ScenarioType = "pessimista" | "realista" | "otimista";

interface ScenarioToggleProps {
  value: ScenarioType;
  onChange: (scenario: ScenarioType) => void;
}

const scenarios = [
  {
    id: "pessimista" as ScenarioType,
    label: "Conservador",
    rate: "3% a.a.",
    icon: TrendingDown,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
    borderColor: "border-orange-300 dark:border-orange-800",
  },
  {
    id: "realista" as ScenarioType,
    label: "Realista",
    rate: "5% a.a.",
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    borderColor: "border-blue-300 dark:border-blue-800",
  },
  {
    id: "otimista" as ScenarioType,
    label: "Otimista",
    rate: "8% a.a.",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    borderColor: "border-emerald-300 dark:border-emerald-800",
  },
];

export const ScenarioToggle = ({ value, onChange }: ScenarioToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <label className="block text-xs font-sans font-medium text-muted-foreground tracking-wide uppercase">
          Cenário de Rentabilidade
        </label>
        <div className="group relative">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Informações sobre cenários"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
          <div className="absolute right-0 top-6 w-64 p-3 bg-background border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Conservador:</strong> Renda fixa premium<br />
              <strong className="text-foreground">Realista:</strong> Carteira balanceada<br />
              <strong className="text-foreground">Otimista:</strong> Foco em ações/FIIs
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = value === scenario.id;

          return (
            <motion.button
              key={scenario.id}
              type="button"
              onClick={() => onChange(scenario.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-3 rounded-xl border-2 transition-all duration-300
                ${
                  isActive
                    ? `${scenario.bgColor} ${scenario.borderColor} shadow-md`
                    : "bg-secondary/20 border-border hover:border-border/60"
                }
              `}
            >
              <div className="flex flex-col items-center gap-1.5">
                <Icon
                  size={16}
                  className={isActive ? scenario.color : "text-muted-foreground"}
                />
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {scenario.label}
                </span>
                <span
                  className={`text-[9px] font-mono ${
                    isActive ? scenario.color : "text-muted-foreground/70"
                  }`}
                >
                  {scenario.rate}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeScenario"
                  className="absolute inset-0 rounded-xl border-2 border-bronze/40"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground/70 leading-relaxed italic">
        ✦ Escolha o cenário que mais se alinha com seu perfil de investimento atual.
      </p>
    </motion.div>
  );
};
