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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme seu e-mail para começar a usar a ONficina</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>ONficina</Heading>
        <Heading style={h1}>Confirme seu e-mail</Heading>
        <Text style={text}>
          Boas-vindas à{' '}
          <Link href={siteUrl} style={link}>
            <strong>ONficina</strong>
          </Link>
          ! Sua conta foi criada com sucesso.
        </Text>
        <Text style={text}>
          Para começar seu teste grátis de 14 dias, confirme seu endereço (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) clicando no botão abaixo:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar e-mail
        </Button>
        <Text style={footer}>
          Se você não criou esta conta, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
const link = { color: 'hsl(25, 95%, 53%)', textDecoration: 'underline' }
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
