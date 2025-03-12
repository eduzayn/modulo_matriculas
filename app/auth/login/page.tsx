"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";

// Esquema de validação do formulário
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/matricula/pages/dashboard";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Configurar o formulário com React Hook Form e validação Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Simulação de login bem-sucedido sem verificação no banco de dados
      // Apenas para fins de teste e desenvolvimento
      
      // Verificar se o formulário está válido (já feito pelo React Hook Form)
      console.log("Login com:", data.email, "senha:", data.password);
      
      // Login bem-sucedido, redirecionar para a URL de callback ou dashboard
      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para o sistema.",
        variant: "default",
      });

      // Redirecionar imediatamente para o dashboard usando URL absoluta
      window.location.href = window.location.origin + "/matricula/pages/dashboard";
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      
      // Exibir mensagem de erro
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Módulo de Matrículas
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!form.formState.errors.email}
                aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p id="email-error" className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Senha
              </label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Ocultar senha" : "Mostrar senha"}
                    </span>
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p id="password-error" className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            {/* Link para recuperação de senha */}
            <div className="text-center text-sm">
              <a href="#" className="text-primary hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
