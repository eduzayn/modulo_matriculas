export const matriculaRoutes = {
  root: '/matricula',
  list: '/matricula/list',
  create: '/matricula/create',
  details: (id: string) => `/matricula/${id}`,
  edit: (id: string) => `/matricula/${id}/edit`,
  documents: (id: string) => `/matricula/${id}/documents`,
  payments: (id: string) => `/matricula/${id}/payments`,
  contract: (id: string) => `/matricula/${id}/contract`,
  dashboard: '/matricula/dashboard',
  reports: '/matricula/reports',
  discounts: '/matricula/discounts',
  support: '/matricula/support',
}
