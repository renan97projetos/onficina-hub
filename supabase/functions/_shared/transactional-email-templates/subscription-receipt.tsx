/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Column, Container, Head, Heading, Hr, Html, Preview, Row, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ONficina'
const SITE_URL = 'https://onficina.com'

interface SubscriptionReceiptProps {
  clienteNome?: string
  oficinaNome?: string
  planoNome?: string
  valor?: string
  dataPagamento?: string
  proximaCobranca?: string
  numeroFatura?: string
  formaPagamento?: string
  invoiceUrl?: string
  isRenovacao?: boolean
}

const SubscriptionReceiptEmail = ({
  clienteNome,
  oficinaNome,
  planoNome,
  valor,
  dataPagamento,
  proximaCobranca,
  numeroFatura,
  formaPagamento,
  invoiceUrl,
  isRenovacao,
}: SubscriptionReceiptProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>
      {isRenovacao
        ? `Renovação confirmada — ${planoNome || 'Plano'} ${SITE_NAME}`
        : `Assinatura ativada — bem-vindo ao ${planoNome || 'plano'} ${SITE_NAME}`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{SITE_NAME}</Heading>

        <Heading style={h1}>
          {isRenovacao ? 'Renovação confirmada ✓' : 'Assinatura ativada ✓'}
        </Heading>

        <Text style={text}>
          {clienteNome ? `Olá, ${clienteNome}. ` : 'Olá. '}
          {isRenovacao
            ? `Recebemos o pagamento da renovação${oficinaNome ? ` da oficina "${oficinaNome}"` : ''}. Obrigado por continuar com a gente!`
            : `Sua assinatura${oficinaNome ? ` para a oficina "${oficinaNome}"` : ''} está ativa. Bem-vindo(a) ao ${SITE_NAME}!`}
        </Text>

        <Section style={card}>
          {planoNome && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Plano</Column>
              <Column style={cardValue}>{planoNome}</Column>
            </Row>
          )}
          {numeroFatura && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Fatura</Column>
              <Column style={cardValue}>{numeroFatura}</Column>
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
          {proximaCobranca && (
            <Row style={cardRow}>
              <Column style={cardLabel}>Próxima cobrança</Column>
              <Column style={cardValue}>{proximaCobranca}</Column>
            </Row>
          )}
          <Hr style={hrInner} />
          {valor && (
            <Row style={cardRow}>
              <Column style={totalLabel}>Total pago</Column>
              <Column style={totalValue}>R$ {valor}</Column>
            </Row>
          )}
        </Section>

        {invoiceUrl && (
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={invoiceUrl} style={button}>
              Ver recibo completo
            </Button>
          </Section>
        )}

        <Text style={text}>
          Você pode gerenciar sua assinatura, atualizar dados de pagamento ou
          baixar faturas anteriores acessando o painel:
        </Text>
        <Text style={text}>
          <a href={`${SITE_URL}/painel/assinatura`} style={link}>
            Acessar painel de assinatura →
          </a>
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Guarde este e-mail como comprovante. Em caso de dúvida sobre cobrança,
          responda este e-mail que a gente te ajuda.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SubscriptionReceiptEmail,
  subject: (data) =>
    data?.isRenovacao
      ? `Renovação confirmada — ${data?.planoNome || 'Plano'} ${SITE_NAME}`
      : `Assinatura ativada — ${data?.planoNome || 'Plano'} ${SITE_NAME}`,
  displayName: 'Recibo de assinatura',
  previewData: {
    clienteNome: 'João Silva',
    oficinaNome: 'Auto Center Silva',
    planoNome: 'Pro',
    valor: '197,00',
    dataPagamento: '30/04/2026',
    proximaCobranca: '30/05/2026',
    numeroFatura: 'INV-001',
    formaPagamento: 'Cartão final 4242',
    invoiceUrl: 'https://invoice.stripe.com/example',
    isRenovacao: false,
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
const text = { fontSize: '15px', color: '#525252', lineHeight: '1.6', margin: '0 0 16px' }
const link = { color: 'hsl(25, 95%, 53%)', fontWeight: '600' as const, textDecoration: 'none' }
const card = {
  backgroundColor: '#fafafa',
  border: '1px solid #ededed',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '16px 0 24px',
}
const cardRow = { margin: '6px 0' }
const cardLabel = { fontSize: '13px', color: '#737373', width: '45%', padding: '6px 0' }
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
  width: '45%',
  padding: '6px 0',
}
const totalValue = {
  fontSize: '18px',
  color: 'hsl(25, 95%, 53%)',
  fontWeight: 'bold' as const,
  padding: '6px 0',
  textAlign: 'right' as const,
}
const button = {
  backgroundColor: 'hsl(25, 95%, 53%)',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  fontSize: '14px',
  display: 'inline-block',
}
const hr = { borderColor: '#ededed', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '12px 0 0', lineHeight: '1.5' }
