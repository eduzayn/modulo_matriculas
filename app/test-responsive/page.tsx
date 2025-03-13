'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  ResponsiveContent, 
  ResponsiveFooter, 
  ResponsiveHeader, 
  ResponsiveSection, 
  ResponsiveGrid 
} from '@/app/components/ui/responsive-layout';
import { 
  ResponsiveForm, 
  ResponsiveFormGroup, 
  ResponsiveFormLabel, 
  ResponsiveInput, 
  ResponsiveTextarea, 
  ResponsiveSelect 
} from '@/app/components/ui/responsive-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function TestResponsivePage() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeader>
        <h1 className="text-2xl font-bold">Teste de Layout Responsivo</h1>
      </ResponsiveHeader>
      
      <ResponsiveContent>
        <ResponsiveSection title="Formulário Responsivo">
          <ResponsiveForm onSubmit={(e) => e.preventDefault()}>
            <ResponsiveFormGroup>
              <ResponsiveFormLabel>Nome</ResponsiveFormLabel>
              <ResponsiveInput placeholder="Digite seu nome" />
            </ResponsiveFormGroup>
            
            <ResponsiveFormGroup>
              <ResponsiveFormLabel>Email</ResponsiveFormLabel>
              <ResponsiveInput type="email" placeholder="Digite seu email" />
            </ResponsiveFormGroup>
            
            <ResponsiveFormGroup>
              <ResponsiveFormLabel>Mensagem</ResponsiveFormLabel>
              <ResponsiveTextarea placeholder="Digite sua mensagem" />
            </ResponsiveFormGroup>
            
            <ResponsiveFormGroup>
              <ResponsiveFormLabel>Categoria</ResponsiveFormLabel>
              <ResponsiveSelect>
                <option value="">Selecione uma categoria</option>
                <option value="suporte">Suporte</option>
                <option value="vendas">Vendas</option>
                <option value="outros">Outros</option>
              </ResponsiveSelect>
            </ResponsiveFormGroup>
            
            <Button type="submit">Enviar</Button>
          </ResponsiveForm>
        </ResponsiveSection>
        
        <ResponsiveSection title="Grid Responsivo">
          <ResponsiveGrid columns={3}>
            <Card>
              <CardHeader>
                <CardTitle>Card 1</CardTitle>
                <CardDescription>Descrição do card 1</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo do card 1</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Ação</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Card 2</CardTitle>
                <CardDescription>Descrição do card 2</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo do card 2</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Ação</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Card 3</CardTitle>
                <CardDescription>Descrição do card 3</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo do card 3</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Ação</Button>
              </CardFooter>
            </Card>
          </ResponsiveGrid>
        </ResponsiveSection>
      </ResponsiveContent>
      
      <ResponsiveFooter>
        <p>© 2023 Teste de Layout Responsivo</p>
      </ResponsiveFooter>
    </ResponsiveContainer>
  );
}
