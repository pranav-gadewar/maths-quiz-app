import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save to database using RPC
    const { error: rpcError } = await supabase.rpc("create_verification_code", {
      p_email: email,
      p_code: code,
    });

    if (rpcError) {
      console.error("RPC error creating code:", rpcError);
      return NextResponse.json(
        { error: "Failed to generate verification code in database" },
        { status: 500 }
      );
    }

    // 3. Send email using nodemailer
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || "MathsQuiz <no-reply@mathsquiz.com>";

    if (!host || !user || !pass) {
      console.warn("SMTP environment variables are not fully configured. Using fallback console log verification.");
      console.log("================================================");
      console.log(`[VERIFICATION EMAIL FALLBACK] Email: ${email}`);
      console.log(`OTP Verification Code: ${code}`);
      console.log("================================================");
      return NextResponse.json({
        success: true,
        message: "SMTP is not configured on the server, but code has been generated in database.",
        fallback: true
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify Your MathsQuiz Account 🧩",
      text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #6366f1; text-align: center;">Welcome to MathsQuiz!</h2>
          <p>Thank you for signing up. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is valid for 15 minutes. If you did not sign up for MathsQuiz, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Verification email sent successfully" });
  } catch (err: any) {
    console.error("Error in send-verification route:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
