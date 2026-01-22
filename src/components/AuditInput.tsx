import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { NumericFormat } from "react-number-format";

interface AuditInputProps {
  label: string;
  sublabel?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder?: string;
  delay?: number;
}

export const AuditInput = ({
  label,
  sublabel,
  hint,
  value,
  onChange,
  icon: Icon,
  placeholder = "0",
  delay = 0,
}: AuditInputProps) => {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2.5 rounded-xl bg-secondary/50 text-muted-foreground group-focus-within:text-bronze group-focus-within:bg-bronze/10 transition-all duration-500">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-sans font-medium text-muted-foreground tracking-wide uppercase mb-1">
            {label}
          </label>
          {sublabel && (
            <p className="text-[11px] font-sans text-muted-foreground/70 mb-2 font-light leading-relaxed">
              {sublabel}
            </p>
          )}
          {hint && (
            <p className="text-[11px] font-sans text-bronze/70 mb-3 font-light leading-relaxed italic">
              ✦ {hint}
            </p>
          )}
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-sans text-lg font-light">
              R$
            </span>
            <NumericFormat
              value={value}
              onValueChange={(values) => {
                onChange(values.value);
              }}
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              decimalScale={0}
              placeholder={placeholder}
              className="input-luxury w-full pl-10 text-2xl"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
