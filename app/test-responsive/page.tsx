'use client';

import React from 'react';
import { 
  ResponsiveLayout, 
  ResponsiveContainer, 
  ResponsiveHeader, 
  ResponsiveSection, 
  ResponsiveGrid 
} from '@/app/components/ui/ResponsiveLayout';
import { 
  ResponsiveForm, 
  ResponsiveFormGroup, 
  ResponsiveInput, 
  ResponsiveTextarea, 
  ResponsiveSelect 
} from '@/app/components/ui/ResponsiveForm';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

export default function TestResponsivePage() {
  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Teste de Componentes Responsivos" 
          subtitle="Demonstração dos componentes UI responsivos"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar</Button>
            </div>
          }
        />

        <ResponsiveSection>
          <h2 className="text-2xl font-bold mb-4">Formulário Responsivo</h2>
          <p className="text-sm text-gray-500 mb-6">Exemplo de formulário com diferentes tipos de campos</p>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Aluno</CardTitle>
              <CardDescription>Preencha os dados do aluno para matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveForm onSubmit={(e) => e.preventDefault()}>
                <ResponsiveFormGroup>
                  <ResponsiveInput 
                    label="Nome Completo" 
                    placeholder="Digite o nome completo" 
                    id="nome"
                  />
                  <ResponsiveInput 
                    label="E-mail" 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    id="email"
                  />
                </ResponsiveFormGroup>
                
                <ResponsiveFormGroup>
                  <ResponsiveInput 
                    label="CPF" 
                    placeholder="000.000.000-00" 
                    id="cpf"
                  />
                  <ResponsiveInput 
                    label="Data de Nascimento" 
                    type="date" 
                    id="data_nascimento"
                  />
                </ResponsiveFormGroup>
                
                <ResponsiveFormGroup>
                  <ResponsiveSelect 
                    label="Curso" 
                    id="curso"
                    options={[
                      { value: "", label: "Selecione um curso" },
                      { value: "1", label: "Desenvolvimento Web" },
                      { value: "2", label: "Design UX/UI" },
                      { value: "3", label: "Marketing Digital" },
                    ]}
                  />
                  <ResponsiveSelect 
                    label="Forma de Pagamento" 
                    id="pagamento"
                    options={[
                      { value: "", label: "Selecione uma forma de pagamento" },
                      { value: "cartao", label: "Cartão de Crédito" },
                      { value: "boleto", label: "Boleto Bancário" },
                      { value: "pix", label: "PIX" },
                    ]}
                  />
                </ResponsiveFormGroup>
                
                <ResponsiveTextarea 
                  label="Observações" 
                  placeholder="Digite observações adicionais" 
                  id="observacoes"
                />
              </ResponsiveForm>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Enviar Matrícula</Button>
            </CardFooter>
          </Card>
        </ResponsiveSection>

        <ResponsiveSection>
          <h2 className="text-2xl font-bold mb-4">Grid Responsivo</h2>
          <p className="text-sm text-gray-500 mb-6">Exemplo de grid com diferentes números de colunas</p>
          <ResponsiveGrid columns={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item}>
                <CardHeader>
                  <CardTitle>Card {item}</CardTitle>
                  <CardDescription>Descrição do card {item}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo do card {item}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Ver Detalhes</Button>
                </CardFooter>
              </Card>
            ))}
          </ResponsiveGrid>
        </ResponsiveSection>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
