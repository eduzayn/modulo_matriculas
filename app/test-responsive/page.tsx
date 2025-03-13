'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  ResponsiveHeader, 
  ResponsiveSection, 
  ResponsiveGrid 
} from '@/app/components/ui/responsiveLayout';
import { 
  ResponsiveForm, 
  ResponsiveFormGroup, 
  ResponsiveLabel, 
  ResponsiveInput, 
  ResponsiveTextarea, 
  ResponsiveSelect 
} from '@/app/components/ui/responsiveForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function TestResponsivePage() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeader>
        <h1 className="text-2xl font-bold">Teste de Componentes Responsivos</h1>
      </ResponsiveHeader>
      
      <ResponsiveSection>
        <h2 className="text-xl font-semibold mb-4">Formulário Responsivo</h2>
        <ResponsiveForm onSubmit={(e) => e.preventDefault()}>
          <ResponsiveFormGroup>
            <ResponsiveLabel htmlFor="name">Nome</ResponsiveLabel>
            <ResponsiveInput id="name" placeholder="Digite seu nome" />
          </ResponsiveFormGroup>
          
          <ResponsiveFormGroup>
            <ResponsiveLabel htmlFor="email">Email</ResponsiveLabel>
            <ResponsiveInput id="email" type="email" placeholder="Digite seu email" />
          </ResponsiveFormGroup>
          
          <ResponsiveFormGroup>
            <ResponsiveLabel htmlFor="course">Curso</ResponsiveLabel>
            <ResponsiveSelect id="course">
              <option value="">Selecione um curso</option>
              <option value="web">Desenvolvimento Web</option>
              <option value="mobile">Desenvolvimento Mobile</option>
              <option value="data">Ciência de Dados</option>
            </ResponsiveSelect>
          </ResponsiveFormGroup>
          
          <ResponsiveFormGroup>
            <ResponsiveLabel htmlFor="message">Mensagem</ResponsiveLabel>
            <ResponsiveTextarea id="message" placeholder="Digite sua mensagem" />
          </ResponsiveFormGroup>
          
          <Button type="submit">Enviar</Button>
        </ResponsiveForm>
      </ResponsiveSection>
      
      <ResponsiveSection>
        <h2 className="text-xl font-semibold mb-4">Grid Responsivo</h2>
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
    </ResponsiveContainer>
  );
}
