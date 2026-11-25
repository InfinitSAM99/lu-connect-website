import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// Upgraded Parser to grab exact device models & OS versions
function parseUA(ua: string) {
  let device = 'Desktop', os = 'Unknown', browser = 'Unknown', model = 'Unknown PC';

  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
  else if (/SmartWatch|Watch/i.test(ua)) device = 'Smartwatch';

  if (/iPhone/.test(ua)) { os = 'iOS'; model = 'Apple iPhone'; }
  else if (/iPad/.test(ua)) { os = 'iOS'; model = 'Apple iPad'; }
  else if (/Android/.test(ua)) {
    os = 'Android';
    // Extract Android device model
    const match = ua.match(/Android\s+[^;]+;\s+([^)]+)\)/);
    if (match && match[1]) {
      model = match[1].replace(/Build\/.*/, '').trim(); // e.g. SM-G991B (Samsung Galaxy S21)
    }
  } else if (/Windows/.test(ua)) { os = 'Windows'; model = 'Windows PC'; }
  else if (/Mac OS/.test(ua)) { os = 'macOS'; model = 'Apple Mac'; }
  else if (/Linux/.test(ua)) { os = 'Linux'; model = 'Linux PC'; }

  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';

  return { device, browser, os, model }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body?.session_id || !body?.path) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 })

    const ua = req.headers.get('user-agent') || ''
    // Get IP from headers (works in production, localhost will be 127.0.0.1)
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1')

    let country = null, city = null, region = null, isp = null, isVpn = false, isHosting = false;
    
    // Fallback for localhost testing
    if (ip === '127.0.0.1' || ip === '::1') {
      country = 'Local'; city = 'Localhost'; isp = 'Local Network';
    } else {
      try {
        // Using ip-api.com for ISP & Proxy/VPN flags
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,isp,proxy,hosting,query`, { signal: AbortSignal.timeout(2000) }).then(r => r.json())
        if (geo.status === 'success') {
          country = geo.country; city = geo.city; region = geo.regionName;
          isp = geo.isp; isVpn = geo.proxy; isHosting = geo.hosting;
        }
      } catch {}
    }

    const { device, browser, os, model } = parseUA(ua)

    const { error } = await supabaseAdmin.from('visits').insert({
      session_id: body.session_id, 
      user_id: body.user_id ?? null,
      ip, country, city, region, 
      isp, is_vpn: isVpn, is_hosting: isHosting,
      device, browser, os, model,
      path: body.path, 
      referrer: body.referrer || null, 
      user_agent: ua,
      screen: body.screen || null
    })
    
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

export async function GET() { return NextResponse.json({ ok: false, error: 'method not allowed' }, { status: 405 }) }
