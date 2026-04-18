/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu link de acesso à ONficina</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>ONficina</Heading>
        <Heading style={h1}>Seu link de acesso</Heading>
        <Text style={text}>
          Clique no botão abaixo para entrar na ONficina. Este link expira em
          poucos minutos.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Entrar na ONficina
        </Button>
        <Text style={footer}>
          Se você não pediu este link, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

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
const text = {
  fontSize: '15px',
  color: '#525252',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
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
