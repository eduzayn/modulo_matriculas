'use client';

import React from 'react';
import { Button } from '../../components/ui/Button';
import { 
  ResponsiveHeader, 
  ResponsiveSection,
  ResponsiveContainer
} from '../components/ui/ResponsiveLayout';
import {
  ResponsiveForm,
  ResponsiveFormGroup,
  ResponsiveInput,
  ResponsiveSelect,
  ResponsiveTextarea,
  ResponsiveFormSection,
  ResponsiveFormActions
} from '../components/ui/ResponsiveForm';

export default function TestResponsivePage() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeader
        title="Teste de Layout Responsivo"
        subtitle="Demonstração dos componentes responsivos"
        actions={
          <>
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar</Button>
          </>
        }
      />
      
      <ResponsiveSection
        title="Formulário Responsivo"
        description="Exemplo de formulário com componentes responsivos"
      >
        <ResponsiveForm onSubmit={(e) => e.preventDefault()}>
          <ResponsiveFormSection title="Informações Pessoais" description="Preencha seus dados pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveFormGroup
                label="Nome Completo"
                htmlFor="name"
                required
              >
                <ResponsiveInput
                  id="name"
                  placeholder="Digite seu nome completo"
                />
              </ResponsiveFormGroup>
              
              <ResponsiveFormGroup
                label="E-mail"
                htmlFor="email"
                required
              >
                <ResponsiveInput
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                />
              </ResponsiveFormGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResponsiveFormGroup
                label="CPF"
                htmlFor="cpf"
                required
              >
                <ResponsiveInput
                  id="cpf"
                  placeholder="000.000.000-00"
                />
              </ResponsiveFormGroup>
              
              <ResponsiveFormGroup
                label="Data de Nascimento"
                htmlFor="birthdate"
              >
                <ResponsiveInput
                  id="birthdate"
                  type="date"
                />
              </ResponsiveFormGroup>
              
              <ResponsiveFormGroup
                label="Gênero"
                htmlFor="gender"
              >
                <ResponsiveSelect
                  options={[
                    { value: 'male', label: 'Masculino' },
                    { value: 'female', label: 'Feminino' },
                    { value: 'other', label: 'Outro' },
                    { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
                  ]}
                />
              </ResponsiveFormGroup>
            </div>
          </ResponsiveFormSection>
          
          <ResponsiveFormSection title="Endereço" description="Informe seu endereço completo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveFormGroup
                label="CEP"
                htmlFor="zipcode"
                required
              >
                <ResponsiveInput
                  id="zipcode"
                  placeholder="00000-000"
                />
              </ResponsiveFormGroup>
              
              <ResponsiveFormGroup
                label="Estado"
                htmlFor="state"
                required
              >
                <ResponsiveSelect
                  options={[
                    { value: 'sp', label: 'São Paulo' },
                    { value: 'rj', label: 'Rio de Janeiro' },
                    { value: 'mg', label: 'Minas Gerais' },
                    { value: 'rs', label: 'Rio Grande do Sul' },
                  ]}
                />
              </ResponsiveFormGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveFormGroup
                label="Cidade"
                htmlFor="city"
                required
              >
                <ResponsiveInput
                  id="city"
                  placeholder="Digite sua cidade"
                />
              </ResponsiveFormGroup>
              
              <ResponsiveFormGroup
                label="Bairro"
                htmlFor="neighborhood"
                required
              >
                <ResponsiveInput
                  id="neighborhood"
                  placeholder="Digite seu bairro"
                />
              </ResponsiveFormGroup>
            </div>
            
            <ResponsiveFormGroup
              label="Endereço"
              htmlFor="address"
              required
            >
              <ResponsiveInput
                id="address"
                placeholder="Rua, número, complemento"
              />
            </ResponsiveFormGroup>
          </ResponsiveFormSection>
          
          <ResponsiveFormSection title="Observações" description="Informações adicionais">
            <ResponsiveFormGroup
              label="Comentários"
              htmlFor="comments"
            >
              <ResponsiveTextarea
                id="comments"
                placeholder="Digite suas observações ou comentários"
                rows={4}
              />
            </ResponsiveFormGroup>
          </ResponsiveFormSection>
          
          <ResponsiveFormActions>
            <Button variant="outline">Cancelar</Button>
            <Button type="submit">Enviar Formulário</Button>
          </ResponsiveFormActions>
        </ResponsiveForm>
      </ResponsiveSection>
    </ResponsiveContainer>
  );
}
