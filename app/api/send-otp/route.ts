import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Configure Brevo SMTP (Put your actual Brevo SMTP details here)
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER, // Your Brevo login email
        pass: process.env.BREVO_SMTP_PASS, // Your Brevo SMTP Key
      },
    })

    await transporter.sendMail({
      from: '"LU Connect Security" <your-brevo-email@gmail.com>',
      to: email,
      subject: 'Your LU Connect Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>New Device Login Request</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #ef4444; letter-spacing: 5px;">${code}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
