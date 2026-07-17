import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Call the PostgreSQL Security Definer RPC function to securely verify the OTP
    const { data: verified, error: rpcError } = await supabase.rpc("verify_user_otp", {
      p_email: email,
      p_code: code.trim(),
    });

    if (rpcError) {
      console.error("RPC error during OTP verification:", rpcError);
      return NextResponse.json(
        { error: "Verification process encountered database error" },
        { status: 500 }
      );
    }

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err: any) {
    console.error("Error in verify route:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
