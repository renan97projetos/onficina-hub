/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ONficina'

interface ReceiptProps {
  clienteNome?: string
  oficinaNome?: string
  numeroOS?: string | number
  dataPagamento?: string
  formaPagamento?: string
  valorTotal?: string
  veiculo?: string
  placa?: string
}

const PaymentReceiptEmail = ({
  clienteNome,
  oficinaNome,
  numeroOS,
  dataPagamento,
  formaPagamento,
  valorTotal,
  veiculo,
  placa,
}: ReceiptProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Recibo de pagamento — {oficinaNome || SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{oficinaNome || SITE_NAME}</Heading>
        <Heading style={h1}>Pagamento confirmado ✓</Heading>
        <Text style={text}>
          {clienteNome ? `Olá, ${clienteNome}. ` : 'Olá. '}
          Recebemos seu pagamento. Obrigado pela confiança!
        </Text>

        <Section style={card}>
          {numeroOS && (
            <Row style={cardRow}>
              <Column style={cardLabel}>OS</Column>
              <Column style={cardValue}>#{numeroOS}</Column>
            </Row>
          )}
          {(veiculo || placa) && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Veículo</Column>
              <Column style={cardValue}>{[veiculo, placa].filter(Boolean).join(' · ')}</Column>
            </Row>
          )}
          {dataPagamento && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Data</Column>
              <Column style={cardValue}>{dataPagamento}</Column>
            </Row>
          )}
          {formaPagamento && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Forma</Column>
              <Column style={cardValue}>{formaPagamento}</Column>
            </Row>
          )}
          <Hr style={hrInner} />
          {valorTotal && (
            <Row style={cardRow}>
              <Column style={totalLabel}>Total pago</Column>
              <Column style={totalValue}>R$ {valorTotal}</Column>
            </Row>
          )}
        </Section>

        <Text style={footer}>
          Guarde este e-mail como comprovante. Em caso de dúvida sobre o
          pagamento, entre em contato com a oficina.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentReceiptEmail,
  subject: (data) =>
    data?.numeroOS
      ? `Recibo do pagamento — OS #${data.numeroOS}`
      : 'Recibo de pagamento',
  displayName: 'Recibo de pagamento',
  previewData: {
    clienteNome: 'Maria Souza',
    oficinaNome: 'Auto Center Silva',
    numeroOS: 1042,
    dataPagamento: '18/04/2026',
    formaPagamento: 'PIX',
    valorTotal: '1.450,00',
    veiculo: 'Honda Civic 2020',
    placa: 'ABC-1D23',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: 'hsl(25, 95%, 53%)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  margin: '0 0 24px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  letterSpacing: '-0.025em',
  margin: '0 0 20px',
}
const text = { fontSize: '15px', color: '#525252', lineHeight: '1.6', margin: '0 0 20px' }
const card = {
  backgroundColor: '#fafafa',
  border: '1px solid #ededed',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '0 0 24px',
}
const cardRow = { margin: '6px 0' }
const cardLabel = {
  fontSize: '13px',
  color: '#737373',
  width: '40%',
  padding: '6px 0',
}
const cardValue = {
  fontSize: '14px',
  color: '#262626',
  fontWeight: '600' as const,
  padding: '6px 0',
  textAlign: 'right' as const,
}
const hrInner = { borderColor: '#ededed', margin: '12px 0' }
const totalLabel = {
  fontSize: '14px',
  color: '#0a0a0a',
  fontWeight: 'bold' as const,
  width: '40%',
  padding: '6px 0',
}
const totalValue = {
  fontSize: '18px',
  color: 'hsl(25, 95%, 53%)',
  fontWeight: 'bold' as const,
  padding: '6px 0',
  textAlign: 'right' as const,
}
const footer = { fontSize: '13px', color: '#999999', margin: '24px 0 0', lineHeight: '1.5' }
