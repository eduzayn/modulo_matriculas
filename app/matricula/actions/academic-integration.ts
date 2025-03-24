'use server';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { createClient } from '@edunexia/auth';
import { z } from 'zod';
import { AppError, appErrors } from '@/lib/errors';
import type { ActionResponse } from '@edunexia/types';
import { MatriculaStatus } from '@edunexia/types';

const action = createSafeActionClient();

// Schema para alocação de turma
const allocateClassSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  turma_id: z.string().uuid({ message: 'ID de turma inválido' }),
  observacoes: z.string().optional(),
});

// Alocar aluno em uma turma
export const allocateClass = action
  .schema(allocateClassSchema)
  .action(async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      // Authentication is now handled by the main site
      const supabase = createClient();

      // Verificar se a matrícula existe e está ativa
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('id, status, aluno_id, curso_id')
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      if (matricula.status !== MatriculaStatus.ATIVO && matricula.status !== MatriculaStatus.APROVADO) {
        throw new AppError('Matrícula não está ativa ou aprovada', 'INVALID_STATUS');
      }

      // Verificar se a turma existe e pertence ao curso da matrícula
      const { data: turma, error: turmaError } = await supabase
        .from('classes')
        .select('id, course_id, current_students, max_students')
        .eq('id', data.turma_id)
        .single();

      if (turmaError) {
        console.error('Erro ao buscar turma:', turmaError);
        throw new AppError('Turma não encontrada', 'NOT_FOUND');
      }

      if (turma.course_id !== matricula.curso_id) {
        throw new AppError('Turma não pertence ao curso da matrícula', 'INVALID_CLASS');
      }

      // Verificar se há vagas disponíveis
      if (turma.current_students >= turma.max_students) {
        throw new AppError('Não há vagas disponíveis nesta turma', 'NO_VACANCIES');
      }

      // Verificar se o aluno já está alocado em alguma turma para este curso
      const { count, error: countError } = await supabase
        .from('student_classes')
        .select('*', { count: 'exact' })
        .eq('student_id', matricula.aluno_id)
        .eq('class_id', data.turma_id);

      if (countError) {
        console.error('Erro ao verificar alocação existente:', countError);
        throw new AppError('Erro ao verificar alocação existente', 'QUERY_ERROR');
      }

      if (count && count > 0) {
        throw new AppError('Aluno já está alocado nesta turma', 'ALREADY_ALLOCATED');
      }

      // Alocar aluno na turma
      const { error: allocateError } = await supabase
        .from('student_classes')
        .insert({
          student_id: matricula.aluno_id,
          class_id: data.turma_id,
          enrollment_date: new Date().toISOString(),
          status: 'active',
          metadata: {
            matricula_id: data.matricula_id,
            observacoes: data.observacoes,
          },
        });

      if (allocateError) {
        console.error('Erro ao alocar aluno na turma:', allocateError);
        throw new AppError('Erro ao alocar aluno na turma', 'ALLOCATION_FAILED');
      }

      // Incrementar contador de alunos na turma
      const { error: updateError } = await supabase
        .from('classes')
        .update({
          current_students: turma.current_students + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.turma_id);

      if (updateError) {
        console.error('Erro ao atualizar contador de alunos na turma:', updateError);
        // Não falhar a operação se apenas a atualização do contador falhar
      }

      // Atualizar matrícula com informações da turma
      const { error: matriculaUpdateError } = await supabase
        .from('matricula.registros')
        .update({
          turma_id: data.turma_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.matricula_id);

      if (matriculaUpdateError) {
        console.error('Erro ao atualizar matrícula:', matriculaUpdateError);
        // Não falhar a operação se apenas a atualização da matrícula falhar
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao alocar aluno em turma:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para verificação de requisitos acadêmicos
const checkAcademicRequirementsSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
});

// Verificar requisitos acadêmicos para matrícula
export const checkAcademicRequirements = action
  .schema(checkAcademicRequirementsSchema)
  .action(async (data): Promise<ActionResponse<{ approved: boolean; reasons?: string[] }>> => {
    try {
      // Authentication is now handled by the main site
      const supabase = createClient();

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select(`
          id, 
          aluno_id, 
          curso_id,
          curso:courses(*)
        `)
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      // Buscar documentos do aluno
      const { data: documentos, error: documentosError } = await supabase
        .from('matricula_documentos')
        .select('tipo, status')
        .eq('matricula_id', data.matricula_id);

      if (documentosError) {
        console.error('Erro ao buscar documentos:', documentosError);
        throw new AppError('Erro ao buscar documentos', 'QUERY_ERROR');
      }

      // Verificar requisitos acadêmicos
      const reasons: string[] = [];
      let approved = true;

      // Verificar documentos obrigatórios
      const documentosObrigatorios = ['rg', 'cpf', 'historico_escolar'];
      const documentosAprovados = documentos
        .filter((doc) => doc.status === 'aprovado')
        .map((doc) => doc.tipo);

      for (const docTipo of documentosObrigatorios) {
        if (!documentosAprovados.includes(docTipo)) {
          reasons.push(`Documento obrigatório não aprovado: ${docTipo}`);
          approved = false;
        }
      }

      // Verificar requisitos específicos do curso
      if (matricula.curso?.prerequisites) {
        // Verificar histórico acadêmico do aluno
        const { data: historicoAcademico, error: historicoError } = await supabase
          .from('academic.student_history')
          .select('*')
          .eq('student_id', matricula.aluno_id);

        if (!historicoError && historicoAcademico) {
          // Implementação mock - em produção, verificaria requisitos específicos
          // como formação anterior, notas mínimas, etc.
          console.log('Verificando requisitos específicos do curso...');
        }
      }

      return {
        success: true,
        data: {
          approved,
          reasons: reasons.length > 0 ? reasons : undefined,
        },
      };
    } catch (error) {
      console.error('Erro ao verificar requisitos acadêmicos:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para geração de grade curricular
const generateCurriculumSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
});

// Gerar grade curricular para matrícula
export const generateCurriculum = action
  .schema(generateCurriculumSchema)
  .action(async (data): Promise<ActionResponse<{ success: boolean; curriculum_id?: string }>> => {
    try {
      // Authentication is now handled by the main site
      const supabase = createClient();

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select(`
          id, 
          aluno_id, 
          curso_id,
          status
        `)
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      if (matricula.status !== MatriculaStatus.ATIVO && matricula.status !== MatriculaStatus.APROVADO) {
        throw new AppError('Matrícula não está ativa ou aprovada', 'INVALID_STATUS');
      }

      // Verificar se já existe uma grade curricular para esta matrícula
      const { count, error: countError } = await supabase
        .from('academic.student_curriculum')
        .select('*', { count: 'exact' })
        .eq('student_id', matricula.aluno_id)
        .eq('course_id', matricula.curso_id);

      if (countError) {
        console.error('Erro ao verificar grade curricular existente:', countError);
        throw new AppError('Erro ao verificar grade curricular existente', 'QUERY_ERROR');
      }

      if (count && count > 0) {
        throw new AppError('Já existe uma grade curricular para esta matrícula', 'ALREADY_EXISTS');
      }

      // Buscar disciplinas do curso
      const { data: disciplinas, error: disciplinasError } = await supabase
        .from('academic.course_subjects')
        .select('*')
        .eq('course_id', matricula.curso_id)
        .order('semester', { ascending: true });

      if (disciplinasError) {
        console.error('Erro ao buscar disciplinas do curso:', disciplinasError);
        throw new AppError('Erro ao buscar disciplinas do curso', 'QUERY_ERROR');
      }

      // Criar grade curricular
      const { data: curriculum, error: curriculumError } = await supabase
        .from('academic.student_curriculum')
        .insert({
          student_id: matricula.aluno_id,
          course_id: matricula.curso_id,
          matricula_id: data.matricula_id,
          status: 'active',
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (curriculumError) {
        console.error('Erro ao criar grade curricular:', curriculumError);
        throw new AppError('Erro ao criar grade curricular', 'CREATION_FAILED');
      }

      // Adicionar disciplinas à grade curricular do aluno
      if (disciplinas && disciplinas.length > 0) {
        const studentSubjects = disciplinas.map((disciplina) => ({
          curriculum_id: curriculum.id,
          subject_id: disciplina.subject_id,
          status: 'pending',
          semester: disciplina.semester,
        }));

        const { error: subjectsError } = await supabase
          .from('academic.student_subjects')
          .insert(studentSubjects);

        if (subjectsError) {
          console.error('Erro ao adicionar disciplinas à grade curricular:', subjectsError);
          // Não falhar a operação se apenas a adição de disciplinas falhar
        }
      }

      return {
        success: true,
        data: {
          success: true,
          curriculum_id: curriculum.id,
        },
      };
    } catch (error) {
      console.error('Erro ao gerar grade curricular:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
