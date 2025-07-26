// app/api/redeem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redeemOnAptos } from "@/lib/aptosClient"; // move your function to lib/aptos.ts

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { hashlock, receiver, amount, expiry } = body;

  try {
    const txHash = await redeemOnAptos({ hashlock, receiver, amount, expiry });
    return NextResponse.json({ success: true, txHash });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
