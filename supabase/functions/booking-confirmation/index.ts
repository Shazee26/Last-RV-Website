
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Fix: Use process.env to access environment variables, consistent with the project's standards and avoiding "Cannot find name 'Deno'" errors
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_placeholder_key';

serve(async (req) => {
  try {
    const { record } = await req.json()

    // 1. Construct the Vibrant Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0c; color: #ffffff; padding: 40px; }
            .card { background: #111114; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 40px; padding: 60px; max-width: 600px; margin: 0 auto; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
            .header { text-align: center; margin-bottom: 60px; }
            .title { font-size: 42px; font-weight: 800; letter-spacing: -0.05em; margin-bottom: 10px; background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5em; color: #10b981; font-weight: 800; }
            .details { background: rgba(255,255,255,0.03); border-radius: 30px; padding: 40px; margin-bottom: 40px; }
            .detail-item { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
            .label { color: #575757; font-size: 10px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.2em; }
            .value { color: #ffffff; font-weight: 700; font-size: 16px; }
            .footer { text-align: center; color: #575757; font-size: 12px; margin-top: 40px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981, #3b82f6); color: #ffffff; padding: 20px 40px; border-radius: 20px; text-decoration: none; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3); }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="subtitle">Mission Confirmed</span>
              <h1 class="title">Desert Outpost Locked.</h1>
            </div>
            
            <div class="details">
              <div class="detail-item">
                <span class="label">Guest Pioneer</span>
                <span class="value">${record.name}</span>
              </div>
              <div class="detail-item">
                <span class="label">Arrival</span>
                <span class="value">${record.check_in}</span>
              </div>
              <div class="detail-item">
                <span class="label">Departure</span>
                <span class="value">${record.check_out}</span>
              </div>
              <div class="detail-item">
                <span class="label">Site Class</span>
                <span class="value">${record.rv_size.toUpperCase()}</span>
              </div>
              <div class="detail-item">
                <span class="label">Payload</span>
                <span class="value">${record.guests} Travelers</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="https://mtnviewrv.com/#/login" class="button">Access Guest Portal</a>
            </div>

            <div class="footer">
              <p>810 Frontage Rd, Van Horn, TX 79855</p>
              <p>&copy; ${new Date().getFullYear()} Mountain View RV Park. Crafted for Pioneers.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Send via Resend (or preferred provider)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mountain View RV <concierge@mtnviewrv.com>',
        to: record.email,
        subject: `Confirmed: Your High-Desert Stay (${record.check_in})`,
        html: htmlContent,
      }),
    })

    const result = await res.json()

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
