import { NextRequest, NextResponse } from 'next/server';
import { submitMedicineWheelData, type MedicineWheelSubmission } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body: MedicineWheelSubmission = await request.json();
    
    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName || !body.fullName || !body.birthDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Submit to Airtable
    const result = await submitMedicineWheelData(body);
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error submitting medicine wheel data:', error);
    return NextResponse.json(
      { error: 'Failed to submit data' },
      { status: 500 }
    );
  }
}
