import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function parseJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const payload = parts[1]
      .replaceAll('-', '+')
      .replaceAll('_', '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')
    return JSON.parse(atob(payload)) as Record<string, unknown>
  } catch {
    return null
  }
}

const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

interface DigestStats {
  abertasHoje: number
  finalizadasHoje: number
  emAtraso: number
  faturamentoHoje: number
}

function buildInsight(stats: DigestStats): string {
  if (stats.emAtraso > 2) {
    return `⚠️ ${stats.emAtraso} OS em atraso — vale priorizar hoje.`
  }
  if (stats.faturamentoHoje > 0) {
    return `💰 ${formatBRL(stats.faturamentoHoje)} faturados hoje.`
  }
  return 'Bom trabalho hoje! 💪'
}

function buildHtml(opts: {
  oficinaNome: string
  dataLabel: string
  stats: DigestStats
  insight: string
}): string {
  const { oficinaNome, dataLabel, stats, insight } = opts
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resumo diário — ${oficinaNome}</title>
</head>
<body style="margin:0;padding:0;background:#0F172A;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#F8FAFC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1E293B;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <p style="margin:0;font-size:13px;color:#F97316;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">ONficina · Resumo diário</p>
              <h1 style="margin:8px 0 4px 0;font-size:22px;color:#F8FAFC;">${oficinaNome}</h1>
              <p style="margin:0;font-size:13px;color:#94A3B8;">${dataLabel}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px;">
              <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:16px;">
                <p style="margin:0;font-size:15px;color:#F8FAFC;line-height:1.5;">${insight}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:6px;">
                    <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:14px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:.04em;">OS abertas hoje</p>
                      <p style="margin:6px 0 0 0;font-size:24px;font-weight:700;color:#F8FAFC;">${stats.abertasHoje}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:6px;">
                    <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:14px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:.04em;">Finalizadas hoje</p>
                      <p style="margin:6px 0 0 0;font-size:24px;font-weight:700;color:#F8FAFC;">${stats.finalizadasHoje}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:6px;">
                    <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:14px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:.04em;">Em atraso</p>
                      <p style="margin:6px 0 0 0;font-size:24px;font-weight:700;color:${stats.emAtraso > 0 ? '#F97316' : '#F8FAFC'};">${stats.emAtraso}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:6px;">
                    <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:14px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:.04em;">Faturamento confirmado</p>
                      <p style="margin:6px 0 0 0;font-size:20px;font-weight:700;color:#F8FAFC;">${formatBRL(stats.faturamentoHoje)}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px 32px;">
              <p style="margin:0;font-size:12px;color:#64748B;line-height:1.5;">
                Você recebe este resumo porque ativou as notificações em
                <strong style="color:#94A3B8;">Configurações → Notificações</strong>.
                Para desativar, acesse seu painel ONficina.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0 0;font-size:11px;color:#475569;">© ${new Date().getFullYear()} ONficina</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Only service-role can trigger this (cron uses service-role key)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const token = authHeader.slice('Bearer '.length).trim()
  const claims = parseJwtClaims(token)
  if (claims?.role !== 'service_role') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Day window in São Paulo timezone (UTC-3, no DST since 2019)
  const now = new Date()
  const tzOffsetMs = 3 * 60 * 60 * 1000
  const localNow = new Date(now.getTime() - tzOffsetMs)
  const y = localNow.getUTCFullYear()
  const m = localNow.getUTCMonth()
  const d = localNow.getUTCDate()
  const startLocal = new Date(Date.UTC(y, m, d, 0, 0, 0))
  const endLocal = new Date(Date.UTC(y, m, d, 23, 59, 59, 999))
  const startIso = new Date(startLocal.getTime() + tzOffsetMs).toISOString()
  const endIso = new Date(endLocal.getTime() + tzOffsetMs).toISOString()
  const dataLabel = localNow.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  // Fetch oficinas with digest enabled and a destination email
  const { data: oficinas, error: ofErr } = await supabase
    .from('oficinas')
    .select('id, nome, email_digest, email_digest_ativo')
    .eq('email_digest_ativo', true)
    .not('email_digest', 'is', null)

  if (ofErr) {
    console.error('Failed to load oficinas', ofErr)
    return new Response(JSON.stringify({ error: 'Failed to load oficinas' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let sent = 0
  let failed = 0

  for (const of of oficinas ?? []) {
    const destino = (of.email_digest ?? '').trim()
    if (!destino) continue

    try {
      // 1) OS abertas hoje (criadas hoje, ainda não finalizadas)
      const { count: abertasHoje } = await supabase
        .from('ordens_servico')
        .select('id', { count: 'exact', head: true })
        .eq('oficina_id', of.id)
        .gte('created_at', startIso)
        .lte('created_at', endIso)
        .neq('stage', 'finalizado')

      // 2) Finalizadas hoje
      const { count: finalizadasHoje } = await supabase
        .from('ordens_servico')
        .select('id', { count: 'exact', head: true })
        .eq('oficina_id', of.id)
        .eq('stage', 'finalizado')
        .gte('updated_at', startIso)
        .lte('updated_at', endIso)

      // 3) Em atraso (prazo_estimado < agora e ainda não finalizada)
      const { count: emAtraso } = await supabase
        .from('ordens_servico')
        .select('id', { count: 'exact', head: true })
        .eq('oficina_id', of.id)
        .neq('stage', 'finalizado')
        .lt('prazo_estimado', now.toISOString())

      // 4) Faturamento confirmado hoje
      const { data: pagas } = await supabase
        .from('ordens_servico')
        .select('valor_total')
        .eq('oficina_id', of.id)
        .eq('pagamento_confirmado', true)
        .gte('pagamento_confirmado_em', startIso)
        .lte('pagamento_confirmado_em', endIso)

      const faturamentoHoje = (pagas ?? []).reduce(
        (sum, row) => sum + Number(row.valor_total ?? 0),
        0,
      )

      const stats: DigestStats = {
        abertasHoje: abertasHoje ?? 0,
        finalizadasHoje: finalizadasHoje ?? 0,
        emAtraso: emAtraso ?? 0,
        faturamentoHoje,
      }

      const insight = buildInsight(stats)
      const subject = `Resumo do dia · ${of.nome}`
      const html = buildHtml({
        oficinaNome: of.nome,
        dataLabel,
        stats,
        insight,
      })

      // Send via the existing transactional pipeline (queue + retries)
      const { error: sendErr } = await supabase.functions.invoke(
        'send-transactional-email',
        {
          body: {
            to: destino,
            subject,
            html,
            label: 'daily_digest',
            purpose: 'transactional',
            idempotency_key: `daily-digest-${of.id}-${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          },
        },
      )

      if (sendErr) {
        console.error('daily-digest send failed', { oficina_id: of.id, error: sendErr })
        failed++
      } else {
        sent++
      }
    } catch (e) {
      console.error('daily-digest unexpected error', { oficina_id: of.id, error: e })
      failed++
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      total: oficinas?.length ?? 0,
      sent,
      failed,
      window: { start: startIso, end: endIso },
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
