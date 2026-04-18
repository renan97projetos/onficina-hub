/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ONficina'

interface BookingProps {
  clienteNome?: string
  oficinaNome?: string
  dataAgendamento?: string
  veiculo?: string
  placa?: string
  observacao?: string
  acompanharUrl?: string
  oficinaTelefone?: string
  oficinaEndereco?: string
}

const BookingConfirmationEmail = ({
  clienteNome,
  oficinaNome,
  dataAgendamento,
  veiculo,
  placa,
  observacao,
  acompanharUrl,
  oficinaTelefone,
  oficinaEndereco,
}: BookingProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu agendamento foi confirmado</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{oficinaNome || SITE_NAME}</Heading>
        <Heading style={h1}>Agendamento confirmado ✓</Heading>
        <Text style={text}>
          {clienteNome ? `Olá, ${clienteNome}! ` : 'Olá! '}
          Recebemos seu agendamento e está tudo certo.
        </Text>

        <Section style={card}>
          {dataAgendamento && (
            <Text style={cardRow}>
              <strong>📅 Data:</strong> {dataAgendamento}
            </Text>
          )}
          {(veiculo || placa) && (
            <Text style={cardRow}>
              <strong>🚗 Veículo:</strong> {[veiculo, placa].filter(Boolean).join(' · ')}
            </Text>
          )}
          {observacao && (
            <Text style={cardRow}>
              <strong>📝 Observação:</strong> {observacao}
            </Text>
          )}
        </Section>

        {acompanharUrl && (
          <Button style={button} href={acompanharUrl}>
            Acompanhar serviço
          </Button>
        )}

        <Hr style={hr} />

        {(oficinaEndereco || oficinaTelefone) && (
          <>
            <Text style={smallTitle}>Onde nos encontrar</Text>
            {oficinaEndereco && <Text style={smallText}>{oficinaEndereco}</Text>}
            {oficinaTelefone && <Text style={smallText}>📞 {oficinaTelefone}</Text>}
          </>
        )}

        <Text style={footer}>
          Se precisar reagendar ou cancelar, entre em contato com a oficina.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingConfirmationEmail,
  subject: (data) =>
    data?.oficinaNome
      ? `Agendamento confirmado — ${data.oficinaNome}`
      : 'Seu agendamento foi confirmado',
  displayName: 'Confirmação de agendamento',
  previewData: {
    clienteNome: 'Maria Souza',
    oficinaNome: 'Auto Center Silva',
    dataAgendamento: 'Quinta, 25 de abril às 09:00',
    veiculo: 'Honda Civic 2020 prata',
    placa: 'ABC-1D23',
    observacao: 'Revisão dos freios',
    acompanharUrl: 'https://onficina.com/acompanhar/exemplo',
    oficinaTelefone: '(11) 99999-9999',
    oficinaEndereco: 'Av. Paulista, 1000 — São Paulo/SP',
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
const cardRow = { fontSize: '14px', color: '#262626', lineHeight: '1.6', margin: '6px 0' }
const button = {
  backgroundColor: 'hsl(25, 95%, 53%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
}
const hr = { borderColor: '#ededed', margin: '24px 0' }
const smallTitle = {
  fontSize: '13px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 8px',
}
const smallText = { fontSize: '14px', color: '#525252', lineHeight: '1.5', margin: '0 0 6px' }
const footer = { fontSize: '13px', color: '#999999', margin: '24px 0 0', lineHeight: '1.5' }
