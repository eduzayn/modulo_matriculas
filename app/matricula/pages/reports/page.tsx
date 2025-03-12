import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { colors } from '@/app/styles/colors'

export default async function ReportsPage() {
  // Authentication is now handled by the main site's middleware
  // TODO: Update database queries to use the main site's data access layer

  // Buscar estatísticas de matrículas por mês (últimos 6 meses)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const { data: matriculasPorMes, error: matriculasMesError } = await supabase
    .from('matricula.registros')
    .select('created_at, status')
    .gte('created_at', sixMonthsAgo.toISOString())
    .order('created_at', { ascending: false })

  if (matriculasMesError) {
    console.error('Erro ao buscar estatísticas de matrículas por mês:', matriculasMesError)
  }

  // Agrupar matrículas por mês
  const matriculasMensais: Record<string, {
    total: number;
    ativas: number;
    pendentes: number;
    canceladas: number;
    trancadas: number;
  }> = {}
  
  matriculasPorMes?.forEach((matricula) => {
    const date = new Date(matricula.created_at)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    
    if (!matriculasMensais[monthYear]) {
      matriculasMensais[monthYear] = {
        total: 0,
        ativas: 0,
        pendentes: 0,
        canceladas: 0,
        trancadas: 0
      }
    }
    
    matriculasMensais[monthYear].total += 1
    
    if (matricula.status === 'ativa') matriculasMensais[monthYear].ativas += 1
    if (matricula.status === 'pendente') matriculasMensais[monthYear].pendentes += 1
    if (matricula.status === 'cancelada') matriculasMensais[monthYear].canceladas += 1
    if (matricula.status === 'trancada') matriculasMensais[monthYear].trancadas += 1
  })

  // Ordenar meses
  const mesesOrdenados = Object.keys(matriculasMensais).sort((a, b) => {
    const [mesA, anoA] = a.split('/')
    const [mesB, anoB] = b.split('/')
    
    if (anoA !== anoB) return parseInt(anoB) - parseInt(anoA)
    return parseInt(mesB) - parseInt(mesA)
  })

  // Calcular taxa de conversão (matrículas ativas / total)
  const { data: totalMatriculas, error: totalError } = await supabase
    .from('matricula.registros')
    .select('status', { count: 'exact' })

  const { data: matriculasAtivas, error: ativasError } = await supabase
    .from('matricula.registros')
    .select('status', { count: 'exact' })
    .eq('status', 'ativa')

  if (totalError || ativasError) {
    console.error('Erro ao calcular taxa de conversão:', totalError || ativasError)
  }

  const taxaConversao = totalMatriculas?.length > 0 
    ? ((matriculasAtivas?.length || 0) / totalMatriculas.length) * 100 
    : 0

  // Buscar cursos mais populares
  const { data: cursosMaisPopulares, error: cursosError } = await supabase
    .from('matricula.registros')
    .select(`
      curso_id,
      curso:courses(name)
    `)
    .eq('status', 'ativa')

  if (cursosError) {
    console.error('Erro ao buscar cursos mais populares:', cursosError)
  }

  // Agrupar por curso
  const cursoCount: Record<string, {
    nome: string;
    count: number;
  }> = {}
  
  cursosMaisPopulares?.forEach((matricula) => {
    const cursoId = matricula.curso_id
    const cursoNome = matricula.curso?.name || 'Curso não identificado'
    
    if (!cursoCount[cursoId]) {
      cursoCount[cursoId] = {
        nome: cursoNome,
        count: 0
      }
    }
    
    cursoCount[cursoId].count += 1
  })

  // Ordenar cursos por popularidade
  const cursosOrdenados = Object.values(cursoCount).sort((a, b) => b.count - a.count).slice(0, 5)

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-neutral-500">
            Análise de dados e estatísticas de matrículas
          </p>
        </div>
        <Button variant="outline" style={{ borderColor: colors.primary.enrollment.main, color: colors.primary.enrollment.main }}>
          <Link href={matriculaRoutes.dashboard}>Voltar para Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{taxaConversao.toFixed(1)}%</p>
            <p className="text-neutral-500 text-sm">
              Matrículas ativas / Total de matrículas
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Matrículas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalMatriculas?.length || 0}</p>
            <p className="text-neutral-500 text-sm">
              Todas as matrículas registradas
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{matriculasAtivas?.length || 0}</p>
            <p className="text-neutral-500 text-sm">
              Matrículas com status ativo
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
        <CardHeader>
          <CardTitle>Matrículas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Mês/Ano</TableHead>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Total</TableHead>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Ativas</TableHead>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Pendentes</TableHead>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Canceladas</TableHead>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Trancadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mesesOrdenados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                mesesOrdenados.map((mes, index) => (
                  <TableRow key={mes} className={index % 2 === 0 ? 'bg-neutral-50' : ''}>
                    <TableCell className="font-medium">{mes}</TableCell>
                    <TableCell>{matriculasMensais[mes].total}</TableCell>
                    <TableCell>{matriculasMensais[mes].ativas}</TableCell>
                    <TableCell>{matriculasMensais[mes].pendentes}</TableCell>
                    <TableCell>{matriculasMensais[mes].canceladas}</TableCell>
                    <TableCell>{matriculasMensais[mes].trancadas}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
        <CardHeader>
          <CardTitle>Cursos Mais Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: colors.primary.enrollment.dark }}>Curso</TableHead>
                <TableHead className="text-right" style={{ color: colors.primary.enrollment.dark }}>Matrículas Ativas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursosOrdenados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                cursosOrdenados.map((curso, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-neutral-50' : ''}>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell className="text-right">{curso.count}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button style={{ background: colors.primary.enrollment.gradient }}>
          Exportar Relatórios
        </Button>
      </div>
    </div>
  )
}
