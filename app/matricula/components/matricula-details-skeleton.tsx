'use client'

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export function MatriculaDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Matrícula</CardTitle>
              <CardDescription>Detalhes gerais sobre a matrícula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Documentos enviados para esta matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-3 w-48 mb-2" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-40" />
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contrato</CardTitle>
              <CardDescription>Detalhes do contrato de matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-40" />
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>Parcelas e pagamentos da matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Parcela</th>
                        <th className="p-2 text-left font-medium">Vencimento</th>
                        <th className="p-2 text-left font-medium">Valor</th>
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array(4).fill(0).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2"><Skeleton className="h-4 w-8" /></td>
                          <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                          <td className="p-2"><Skeleton className="h-4 w-20" /></td>
                          <td className="p-2"><Skeleton className="h-5 w-20 rounded-full" /></td>
                          <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-40" />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
