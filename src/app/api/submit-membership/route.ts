import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateMembershipEmail } from '@/lib/email';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_MEMBERSHIPS_TABLE_ID;

export async function POST(request: NextRequest) {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
      throw new Error('Airtable configuration is missing');
    }

    const formData = await request.json();

    // Transform form data to Airtable fields
    const airtableFields = {
      // Record Identifier
      'Name': `${formData.member1FirstName} ${formData.member1LastName} - ${formData.membershipStatus} ${formData.membershipTier}`,
      
      // Membership Details
      'Membership Status': formData.membershipStatus === 'new' ? 'New' : 'Renewal',
      'Membership Tier': formData.membershipTier === 'single' ? 'Single' : 'Dual',
      
      // Member 1
      'Member 1 Name': `${formData.member1FirstName} ${formData.member1LastName}`,
      'Member 1 First Name': formData.member1FirstName,
      'Member 1 Last Name': formData.member1LastName,
      'Member 1 Birthdate': formData.member1Birthdate,
      
      // Member 2 (if dual)
      'Member 2 Name': formData.member2FirstName ? `${formData.member2FirstName} ${formData.member2LastName}` : '',
      'Member 2 First Name': formData.member2FirstName || '',
      'Member 2 Last Name': formData.member2LastName || '',
      'Member 2 Birthdate': formData.member2Birthdate || '',
      
      // Contact Information
      'Address Street': formData.addressStreet,
      'Address City': formData.addressCity,
      'Address State': formData.addressState,
      'Address ZIP': formData.addressZip,
      'Phone Home': formData.phone1Type === 'home' ? formData.phone1Number : (formData.phone2Type === 'home' ? formData.phone2Number : ''),
      'Phone Cell': formData.phone1Type === 'cell' ? formData.phone1Number : (formData.phone2Type === 'cell' ? formData.phone2Number : ''),
      'Email': formData.email,
      
      // Preferences
      'Newsletter Preference': formData.newsletterPreference === 'email' ? 'Email' : 'Mail',
      
      // Areas of Interest (concatenate selected interests)
      'Areas of Interest': [
        formData.interestActivities && 'Activities',
        formData.interestLunch && 'Daily Lunch Program',
        formData.interestLunchBunch && 'Lunch Bunch',
        formData.interestTransportation && 'Transportation Services',
        formData.interestOutreach && 'Outreach Services',
        formData.interestVolunteering && 'Volunteering',
      ].filter(Boolean).join(', '),
      
      // Payment Information
      'Payment Method': formData.paymentMethod === 'check' ? 'Check' 
        : formData.paymentMethod === 'cash' ? 'Cash' 
        : formData.paymentMethod === 'over_90_no_dues' ? 'Over 90 - No Dues Required'
        : 'Credit Card',
      'Payment Reference': formData.paymentReference || '',
      'Payment Amount': parseFloat(formData.paymentAmount || '0'),
      'Entered By Staff': formData.enteredByStaff,
      
      // Metadata
      'Submission Date': new Date().toISOString(),
      'Status': 'Todo',
      'Notes': `Submitted via online form on ${new Date().toLocaleDateString()}`,
    };

    // Create record in Airtable
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: airtableFields,
        typecast: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();

    // Send email notification
    try {
      const emailHtml = generateMembershipEmail({
        member1FirstName: formData.member1FirstName,
        member1LastName: formData.member1LastName,
        email: formData.email,
        membershipTier: formData.membershipTier,
        membershipStatus: formData.membershipStatus,
        paymentAmount: formData.paymentAmount,
      });

      await sendEmail({
        to: 'sam@samuelholley.com',
        subject: `✅ New Membership: ${formData.member1FirstName} ${formData.member1LastName} - ${formData.membershipStatus === 'new' ? 'New' : 'Renewal'} ${formData.membershipTier === 'single' ? 'Single' : 'Dual'}`,
        html: emailHtml,
      });

      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      recordId: result.id,
      message: 'Membership application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting membership form:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit membership application',
      },
      { status: 500 }
    );
  }
}
