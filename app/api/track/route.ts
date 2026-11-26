export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UAParser } from 'ua-parser-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body?.session_id || !body?.path) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 })

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const ua = req.headers.get('user-agent') || ''
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1')

    let country = null, city = null, region = null, isp = null, isVpn = false, isHosting = false;
    if (ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,isp,proxy,hosting,query`, { signal: AbortSignal.timeout(2000) }).then(r => r.json())
        if (geo.status === 'success') {
          country = geo.country; city = geo.city; region = geo.regionName;
          isp = geo.isp; isVpn = geo.proxy; isHosting = geo.hosting;
        }
      } catch {}
    }

    // USE THE PARSER INSTEAD OF REGEX
    const parser = new UAParser(ua);
    const result = parser.getResult();

    const deviceType = result.device.type ? result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1) : 'Desktop';
    const deviceModel = result.device.model || result.device.vendor || deviceType;
    const browser = result.browser.name || 'Other';
    const os = result.os.name || 'Unknown';

    const { error } = await supabaseAdmin.from('visits').insert({
      session_id: body.session_id, user_id: body.user_id ?? null,
      ip, country, city, region, isp, is_vpn: isVpn, is_hosting: isHosting,
      device: deviceModel, // We are now saving the real model here
      browser, os, path: body.path, referrer: body.referrer || null, user_agent: ua, screen: body.screen || null
    })

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

export async function GET() { return NextResponse.json({ ok: false, error: 'method not allowed' }, { status: 405 }) }
