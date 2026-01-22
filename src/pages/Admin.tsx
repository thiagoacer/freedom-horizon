import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Lock, MessageCircle, TrendingUp, ShieldAlert, Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Lead {
    id: number;
    created_at: string;
    nome: string;
    whatsapp: string;
    email: string;
    patrimonio_atual: number;
    lead_score: number;
    lead_category: string;
    lead_priority: string;
    anos_liberdade: number;
}

const Admin = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Senha simples para acesso rápido (não é segurança militar, mas evita curiosos)
    const ADMIN_PASS = "sarahwealth2025";

    const fetchLeads = async () => {
        setLoading(true);
        // Busca leads ordenados por SCORE (os melhores aparecem no topo)
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("lead_score", { ascending: false });

        if (error) {
            toast.error("Erro ao carregar leads");
            console.error(error);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASS) {
            setIsAuthenticated(true);
            fetchLeads();
            toast.success("Acesso autorizado");
        } else {
            toast.error("Senha incorreta");
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Imediata": return "bg-emerald-600 hover:bg-emerald-700";
            case "Alta": return "bg-blue-600 hover:bg-blue-700";
            case "Média": return "bg-yellow-600 hover:bg-yellow-700";
            default: return "bg-gray-500";
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center font-serif text-2xl">Sala de Comando</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Senha de Acesso"
                                    className="pl-9"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-bronze hover:bg-bronze-dark text-white">
                                Entrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-foreground">Gestão de Leads</h1>
                        <p className="text-muted-foreground text-sm">
                            {leads.length} oportunidades mapeadas | Ordenadas por Potencial
                        </p>
                    </div>
                    <Button onClick={fetchLeads} variant="outline" className="gap-2">
                        <TrendingUp size={16} /> Atualizar Lista
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Prioridade</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Patrimônio</TableHead>
                                    <TableHead>Liberdade em</TableHead>
                                    <TableHead>Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">Carregando inteligência...</TableCell>
                                    </TableRow>
                                ) : leads.map((lead) => (
                                    <TableRow key={lead.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <Badge className={`${getPriorityColor(lead.lead_priority)} text-white border-0`}>
                                                {lead.lead_priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono font-bold text-lg text-foreground">
                                                {lead.lead_score}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase">{lead.lead_category}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{lead.nome}</div>
                                            <div className="text-xs text-muted-foreground">{lead.email}</div>
                                            <div className="text-[10px] text-muted-foreground/60">
                                                {format(new Date(lead.created_at), "dd/MM 'às' HH:mm")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.patrimonio_atual)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {lead.anos_liberdade.toFixed(1)} anos
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                                onClick={() => window.open(`https://wa.me/${lead.whatsapp}`, '_blank')}
                                            >
                                                <MessageCircle size={14} />
                                                Chamar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
