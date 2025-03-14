import { notFound, redirect } from 'next/navigation'
import { generateStaticParams } from './generateStaticParams'
import ContratoDetailsClient from './client-component'

export { generateStaticParams }

export default function ContratoDetailsPage({ params }: { params: { id: string } }) {
  return <ContratoDetailsClient params={params} />;
}
