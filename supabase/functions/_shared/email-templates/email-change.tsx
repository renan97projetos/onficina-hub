/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme a alteração de e-mail na ONficina</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>ONficina</Heading>
        <Heading style={h1}>Confirme a alteração de e-mail</Heading>
        <Text style={text}>
          Você pediu para alterar o e-mail da sua conta na ONficina de{' '}
          <Link href={`mailto:${email}`} style={link}>
            {email}
          </Link>{' '}
          para{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Clique no botão abaixo para confirmar a mudança:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar alteração
        </Button>
        <Text style={fallback}>
          Se o botão não funcionar, copie e cole este link no navegador:
          <br />
          <a href={confirmationUrl} style={linkBreak}>{confirmationUrl}</a>
        </Text>
        <Text style={footer}>
          Se não foi você quem pediu essa alteração, proteja sua conta imediatamente
          alterando sua senha.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
const text = {
  fontSize: '15px',
  color: '#525252',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#F97316', textDecoration: 'underline' }
const linkBreak = { color: '#F97316', textDecoration: 'underline', wordBreak: 'break-all' as const }
const button = {
  backgroundColor: '#F97316',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
  border: '1px solid #F97316',
}
const fallback = { fontSize: '13px', color: '#525252', lineHeight: '1.5', margin: '0 0 20px' }
const footer = { fontSize: '13px', color: '#999999', margin: '24px 0 0', lineHeight: '1.5' }
