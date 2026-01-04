import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_CONTACT = process.env.AIRTABLE_TABLE_CONTACT;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, motivation } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Submit to Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_CONTACT}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone || '',
            Motivation: motivation,
            SubmittedAt: new Date().toISOString(),
          },
          typecast: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      throw new Error('Failed to submit to Airtable');
    }

    const result = await response.json();
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
