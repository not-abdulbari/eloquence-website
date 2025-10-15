// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures the route is treated as dynamic

// --- Main API Handler for POST Requests (Simplified for Debugging) ---
export async function POST(request: NextRequest) {
  try {
    // We try to read the form data to make sure the request body is being received.
    const formData = await request.formData();
    const mainRegistrantData = formData.get('mainRegistrantData');

    console.log("Simplified API route was hit successfully!");
    console.log("Main Registrant Data:", mainRegistrantData);

    // If we get here, it means the POST request is being handled correctly.
    return NextResponse.json({
      message: "DEBUG: API route is working!",
      receivedData: true,
    });

  } catch (error) {
    console.error('Error in simplified POST route:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: "An error occurred in the simplified route.", details: errorMessage }, { status: 500 });
  }
}

