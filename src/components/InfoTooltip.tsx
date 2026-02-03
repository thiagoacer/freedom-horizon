import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => {
  return (
    <div className="group relative inline-block">
      <button
        type="button"
        className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        aria-label="Mais informações"
      >
        <HelpCircle size={14} strokeWidth={1.5} />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-popover border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <p className="text-[11px] text-popover-foreground leading-relaxed">
          {content}
        </p>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
          <div className="border-4 border-transparent border-t-border" />
        </div>
      </div>
    </div>
  );
};
