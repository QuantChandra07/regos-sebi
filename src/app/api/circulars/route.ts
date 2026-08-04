import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "This local route is not configured. Use the RegOS backend circulars service." },
    { status: 501 }
  );
}
