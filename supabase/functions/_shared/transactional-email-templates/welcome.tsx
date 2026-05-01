/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ONficina'
const SITE_URL = 'https://onficina.com'
const WHATSAPP_NUMERO = '5527997750964' // Renan
const WHATSAPP_MENSAGEM = encodeURIComponent(
  'Oi Renan! Acabei de cadastrar minha oficina no ONficina e preciso de uma ajuda.'
)
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${WHATSAPP_MENSAGEM}`

interface WelcomeProps {
  nome?: string
  oficinaNome?: string
}

const WelcomeEmail = ({ nome, oficinaNome }: WelcomeProps) => {
  const saudacao = nome ? `Oi, ${nome}!` : 'Oi!'
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head />
      <Preview>Sou o Renan do ONficina — estou aqui se precisar de ajuda</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>{SITE_NAME}</Heading>

          <Heading style={h1}>{saudacao}</Heading>

          <Text style={text}>
            Sou o <strong>Renan</strong>, do ONficina. Vi que você acabou de cadastrar
            {oficinaNome ? <> a <strong>{oficinaNome}</strong></> : ' sua oficina'} —
            seja muito bem-vindo(a)! 👋
          </Text>

          <Text style={text}>
            Estou passando aqui só pra dizer que, se precisar de qualquer ajuda
            pra configurar o sistema (cadastrar serviços, colaboradores, criar
            sua primeira OS, gerar orçamento…), é só me chamar. Respondo rápido
            no WhatsApp.
          </Text>

          <Section style={{ textAlign: 'center' as const, margin: '8px 0 24px' }}>
            <Button style={whatsappButton} href={WHATSAPP_LINK}>
              💬 Falar com o Renan no WhatsApp
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Você tem <strong>14 dias grátis</strong> pra testar tudo, sem cartão
            de crédito. Pra começar, é só acessar seu painel:
          </Text>

          <Section style={{ textAlign: 'center' as const, margin: '8px 0 24px' }}>
            <Button style={primaryButton} href={`${SITE_URL}/admin`}>
              Acessar meu painel
            </Button>
          </Section>

          <Text style={footer}>
            Um abraço,
            <br />
            <strong>Renan</strong> — Equipe ONficina
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: WelcomeEmail,
  subject: 'Bem-vindo ao ONficina — sou o Renan, posso te ajudar?',
  displayName: 'Boas-vindas (Renan)',
  previewData: { nome: 'João', oficinaNome: 'Auto Center Silva' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#F97316',
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
const primaryButton = {
  backgroundColor: '#F97316',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '1px solid #F97316',
}
const whatsappButton = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '1px solid #25D366',
}
const link = { color: '#25D366', textDecoration: 'underline', wordBreak: 'break-all' as const }
const fallback = { fontSize: '13px', color: '#737373', lineHeight: '1.5', margin: '0 0 20px' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '14px', color: '#525252', margin: '24px 0 0', lineHeight: '1.6' }
