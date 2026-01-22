
interface ScoringInputs {
    patrimonio: number;
    aporteMensal: number;
    anosParaLiberdade: number;
}

interface ScoreResult {
    score: number; // 0 a 100
    categoria: "Iniciante" | "Em Construção" | "Potencial Private" | "Wealth/VIP";
    prioridade: "Baixa" | "Média" | "Alta" | "Imediata";
}

export const calculateLeadScore = ({ patrimonio, aporteMensal, anosParaLiberdade }: ScoringInputs): ScoreResult => {
    let score = 0;

    // 1. CRITÉRIO PATRIMÔNIO (Max 40)
    if (patrimonio >= 1000000) score += 40;
    else if (patrimonio >= 300000) score += 30;
    else if (patrimonio >= 50000) score += 10;
    else score += 5; // Pelo menos começou

    // 2. CRITÉRIO APORTE MENSAL (Max 35)
    if (aporteMensal >= 10000) score += 35;
    else if (aporteMensal >= 5000) score += 25;
    else if (aporteMensal >= 2000) score += 15;
    else score += 5;

    // 3. CRITÉRIO URGÊNCIA / TEMPO (Max 25)
    // Se já atingiu (anos <= 0), urgência máxima para gestão patrimonial
    if (anosParaLiberdade <= 2) score += 25;
    else if (anosParaLiberdade <= 7) score += 20;
    else if (anosParaLiberdade <= 15) score += 10;
    else score += 5;

    // CLASSIFICAÇÃO FINAL
    let categoria: ScoreResult["categoria"] = "Iniciante";
    let prioridade: ScoreResult["prioridade"] = "Baixa";

    if (score >= 80) {
        categoria = "Wealth/VIP";
        prioridade = "Imediata";
    } else if (score >= 60) {
        categoria = "Potencial Private";
        prioridade = "Alta";
    } else if (score >= 40) {
        categoria = "Em Construção";
        prioridade = "Média";
    }

    return { score, categoria, prioridade };
};
