/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ONficina'
const SITE_URL = 'https://onficina.com'

interface WelcomeProps {
  nome?: string
  oficinaNome?: string
}

const WelcomeEmail = ({ nome, oficinaNome }: WelcomeProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Bem-vindo à {SITE_NAME} — sua oficina mais organizada começa agora</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{SITE_NAME}</Heading>
        <Heading style={h1}>
          {nome ? `Olá, ${nome}!` : 'Boas-vindas!'}
        </Heading>
        <Text style={text}>
          {oficinaNome
            ? `A ${oficinaNome} está pronta para usar a ${SITE_NAME}.`
            : `Sua conta na ${SITE_NAME} foi criada com sucesso.`}
        </Text>
        <Text style={text}>
          Você ganhou <strong>14 dias grátis</strong> para testar tudo:
          pipeline de OS, orçamentos digitais, controle financeiro,
          agendamento online e muito mais.
        </Text>
        <Button style={button} href={`${SITE_URL}/admin`}>
          Acessar o painel
        </Button>
        <Text style={text}>
          Dica: comece cadastrando seus serviços e colaboradores. Em poucos
          minutos sua oficina estará organizada.
        </Text>
        <Text style={footer}>
          Qualquer dúvida, é só responder este e-mail. Estamos aqui para ajudar.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Bem-vindo à ONficina 🚗',
  displayName: 'Boas-vindas',
  previewData: { nome: 'João', oficinaNome: 'Auto Center Silva' },
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
const footer = { fontSize: '13px', color: '#999999', margin: '24px 0 0', lineHeight: '1.5' }
