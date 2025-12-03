import { NextRequest, NextResponse } from 'next/server';
import { generateRSVPEnrollmentPDF, getVolunteerPDFFilename } from '@/lib/volunteerPDF';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, and email are required' },
        { status: 400 }
      );
    }
    
    // Add submission timestamp
    formData.submissionDate = new Date().toISOString();
    
    // Generate PDF
    const doc = generateRSVPEnrollmentPDF(formData);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const fileName = getVolunteerPDFFilename(formData.lastName);
    
    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating volunteer PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
