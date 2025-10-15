// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize S3 Client for Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

// Helper function to upload file to R2 and return the public URL
async function uploadFileToR2(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `registration-screenshots/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Construct the public URL for R2 using your custom domain
  // Ensure your CDN (cdn.eloquence.in.net) is configured to serve files from the 'registration-screenshots/' path in your R2 bucket
  return `https://cdn.eloquence.in.net/registration-screenshots/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const mainRegistrantData = JSON.parse(formData.get('mainRegistrantData') as string);
    const eventRegistrationsData = JSON.parse(formData.get('eventRegistrationsData') as string);
    const totalAmount = parseFloat(formData.get('totalAmount') as string);
    const submittedAt = formData.get('submittedAt') as string;
    const paymentScreenshotFile = formData.get('paymentScreenshot') as File | null;

    if (!paymentScreenshotFile) {
      return NextResponse.json({ error: "Payment screenshot is required." }, { status: 400 });
    }
    if (!paymentScreenshotFile.type.startsWith('image/')) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
    }

    const bytes = await paymentScreenshotFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = paymentScreenshotFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const r2Url = await uploadFileToR2(buffer, fileName, paymentScreenshotFile.type);

    // 1. Insert into 'registrations' table
    const { data: registrationData, error: registrationError } = await supabase
      .from('registrations')
      .insert([{
        main_registrant_title: mainRegistrantData.title,
        main_registrant_name: mainRegistrantData.name,
        main_registrant_email: mainRegistrantData.email,
        main_registrant_phone: mainRegistrantData.phone,
        main_registrant_roll_no: mainRegistrantData.rollNo,
        main_registrant_college_name: mainRegistrantData.collegeName,
        main_registrant_year: mainRegistrantData.year,
        main_registrant_degree: mainRegistrantData.degree,
        main_registrant_department: mainRegistrantData.department,
        total_amount: totalAmount,
        payment_screenshot_url: r2Url,
        submitted_at: submittedAt,
      }])
      .select()
      .single();

    if (registrationError) {
      console.error('Supabase registration insertion error:', registrationError);
      return NextResponse.json({ error: "Failed to save main registration data." }, { status: 500 });
    }

    // 2. Loop through each event registration
    for (const reg of eventRegistrationsData) {
      
      // --- FIX: Find the event's UUID based on its title ---
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('title', reg.eventId) // 'reg.eventId' is the string like 'coding-debugging'
        .single();

      if (eventError || !eventData) {
        console.error(`Could not find event with title: ${reg.eventId}`, eventError);
        return NextResponse.json({ error: `Event '${reg.eventId}' not found.` }, { status: 404 });
      }
      const eventUUID = eventData.id;
      // --- END OF FIX ---

      // Insert into 'event_registrations' using the correct UUID
      const { data: eventRegData, error: eventRegError } = await supabase
        .from('event_registrations')
        .insert([{
          registration_id: registrationData.id,
          event_id: eventUUID, // Use the fetched UUID
          team_size: reg.teamSize,
        }])
        .select()
        .single();
      
      if (eventRegError) {
        console.error('Supabase event registration error:', eventRegError);
        return NextResponse.json({ error: "Failed to save event registration data." }, { status: 500 });
      }

      // 3. Insert into 'team_members' table for each team member
      for (const member of reg.teamMembers) {
        const { error: teamMemberError } = await supabase
          .from('team_members')
          .insert([{
            event_registration_id: eventRegData.id,
            title: member.title,
            name: member.name,
            email: member.email,
            phone: member.phone,
            roll_no: member.rollNo,
            college_name: member.collegeName || mainRegistrantData.collegeName,
            year: member.year,
            degree: member.degree,
            department: member.department || mainRegistrantData.department,
            is_team_lead: member.isTeamLead,
            is_alternate_contact: member.isAlternateContact,
          }]);

        if (teamMemberError) {
          console.error('Supabase team member error:', teamMemberError);
          return NextResponse.json({ error: "Failed to save team member data." }, { status: 500 });
        }
      }
    }

    return NextResponse.json({
      message: "Registration submitted successfully!",
      registrationId: registrationData.id,
    });

  } catch (error) {
    console.error('Unexpected error during submission:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}