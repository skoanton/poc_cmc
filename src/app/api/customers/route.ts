import { getAllCustomers } from "@/db/server.db";
import { NextResponse } from "next/server";

// GET: Hämta alla kunder
export async function GET() {
  try {
    const customers = await getAllCustomers();
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
