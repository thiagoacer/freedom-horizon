import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const leadSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    whatsapp: z
        .string()
        .min(10, "Digite DDD + Número (ex: 11999999999)")
        .regex(/^\d+$/, "Apenas números"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
    onSuccess: () => void;
}

export const LeadForm = ({ onSuccess }: LeadFormProps) => {
    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: "",
            email: "",
            whatsapp: "",
        },
    });

    const onSubmit = (data: LeadFormValues) => {
        // In a real scenario, this would POST to a backend/webhook
        console.log("Lead Capturado:", data);

        // Simulate API delay
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Desbloqueando sua análise...',
                success: () => {
                    onSuccess();
                    return 'Análise desbloqueada com sucesso!';
                },
                error: 'Erro ao desbloquear',
            }
        );
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Nome</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Seu nome"
                                        className="bg-white/50 border-bronze/20 focus:border-bronze focus:ring-bronze/20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">E-mail</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Seu melhor e-mail"
                                        type="email"
                                        className="bg-white/50 border-bronze/20 focus:border-bronze focus:ring-bronze/20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">WhatsApp</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="WhatsApp (DDD + Número)"
                                        type="tel"
                                        inputMode="numeric"
                                        className="bg-white/50 border-bronze/20 focus:border-bronze focus:ring-bronze/20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-bronze hover:bg-bronze-dark text-white font-serif transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Lock className="w-4 h-4 mr-2" />
                        Desbloquear Minha Análise
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground/60 w-full">
                        Seus dados estão seguros. Respeitamos a sua privacidade.
                    </p>
                </form>
            </Form>
        </div>
    );
}
