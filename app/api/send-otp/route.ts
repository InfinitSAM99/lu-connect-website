import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      // CHANGED: Using a generic sender name, but the actual email will still be yours
      from: `"LU Connect Security" <${process.env.BREVO_SMTP_USER}>`,
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

    console.log('Email sent:', info.messageId)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Email error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
