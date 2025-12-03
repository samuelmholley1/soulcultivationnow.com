import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateVolunteerEmail } from '@/lib/email';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_VOLUNTEERS_TABLE_ID;

export async function POST(request: NextRequest) {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
      throw new Error('Airtable configuration is missing');
    }

    const formData = await request.json();

    // Helper function to format phone numbers (digits only)
    const formatPhone = (phone: string) => phone.replace(/\D/g, '')

    // Transform form data to Airtable fields
    const airtableFields = {
      // Personal Information
      'First Name': formData.firstName,
      'Last Name': formData.lastName,
      'Phone': formatPhone(formData.phone),
      'Email': formData.email,
      'Address Street': formData.address,
      'Apt': formData.apt || '',
      'City': formData.city,
      'ZIP': formData.zip,
      'Date of Birth': formData.dateOfBirth,
      
      // Demographics
      'Physical Limitations': formData.physicalLimitations === 'yes' ? `Yes - ${formData.physicalLimitationsDetails}` : 'No',
      'Ethnicity': formData.ethnicity.map((eth: string) => 
        eth === 'african_american' ? 'African American' :
        eth === 'native_american' ? 'Native American' :
        eth === 'asian' ? 'Asian' :
        eth === 'hispanic' ? 'Hispanic' :
        eth === 'caucasian' ? 'Caucasian' :
        eth === 'white' ? 'White' :
        eth === 'other' ? formData.ethnicityOther :
        eth
      ).join(', '),
      'Sex': formData.sex === 'female' ? 'Female' : 'Male',
      'Pronouns': formData.pronouns === 'she/her' ? 'She/Her' : formData.pronouns === 'he/him' ? 'He/Him' : 'They/Them',
      'Military Status': formData.militaryStatus === 'veteran' ? 'Veteran' : formData.militaryStatus === 'spouse' ? 'Spouse' : formData.militaryStatus === 'family' ? 'Family' : 'No',
      'Shirt Size': formData.shirtSize.toUpperCase(),
      
      // Referral Source
      'Referral Source': [
        formData.referralAgencyStaff && `Agency Staff: ${formData.referralAgencyStaff}`,
        formData.referralFriend && `Friend/Family: ${formData.referralFriend}`,
        formData.referralNewspaper && `Newspaper: ${formData.referralNewspaper}`,
        formData.referralBrochure && `Brochure: ${formData.referralBrochure}`,
        ...formData.referralSource,
      ].filter(Boolean).join('\n'),
      
      // Skills and Interests
      'Skills and Interests': [
        formData.skillAccounting && 'Accounting/Bookkeeping',
        formData.skillAdultEducation && 'Adult Education',
        formData.skillAdultAdvocate && 'Adult Advocate',
        formData.skillChildEducation && 'Child Education',
        formData.skillChildAdvocate && 'Child Advocate',
        formData.skillComputer && 'Computer Skills',
        formData.skillCounseling && 'Counseling',
        formData.skillDisaster && 'Disaster Services',
        formData.skillEnvironment && 'Environmental',
        formData.skillFoodBank && 'Food Bank',
        formData.skillFriendlyVisits && 'Friendly Visits',
        formData.skillGiftShop && 'Gift Shop/Thrift Store',
        formData.skillHomeless && 'Homeless Services',
        formData.skillHospice && 'Hospice',
        formData.skillInstructor && 'Instructor',
        formData.skillInfoReferral && 'Info & Referral',
        formData.skillMaintenance && 'Building Maintenance',
        formData.skillMentor && 'Mentor',
        formData.skillMoneyManagement && 'Money Management',
        formData.skillOfficeAssistant && 'Office Assistant',
        formData.skillPublicRelations && 'Public Relations',
        formData.skillReadingAloud && 'Reading Aloud',
        formData.skillReceptionist && 'Receptionist',
        formData.skillRecreation && 'Recreation/Activities',
        formData.skillSeniorMeal && 'Senior Meal Service',
        formData.skillShopping && 'Shopping Assistance',
        formData.skillTransportation && 'Transportation',
        formData.skillVolunteerCoordinator && 'Volunteer Coordinator',
        formData.skillOther && `Other: ${formData.skillOtherDetails}`,
      ].filter(Boolean).join(', '),
      'Languages Spoken': formData.languagesSpoken || '',
      
      // Beneficiary Information
      'Beneficiary Name': `${formData.beneficiaryFirstName} ${formData.beneficiaryLastName}`,
      'Beneficiary Relationship': formData.beneficiaryRelationship,
      'Beneficiary Phone': formatPhone(formData.beneficiaryPhone),
      'Beneficiary Email': formData.beneficiaryEmail || '',
      
      // Emergency Contact
      'Emergency Contact Name': `${formData.emergencyFirstName} ${formData.emergencyLastName}`,
      'Emergency Contact Relationship': formData.emergencyRelationship,
      'Emergency Contact Phone': formatPhone(formData.emergencyPhone),
      'Emergency Contact Email': formData.emergencyEmail || '',
      
      // Legal & Insurance
      'Willing to Drive': formData.willingToDrive,
      'Driver License Number': formData.willingToDrive && formData.driverDeclarationSignature !== 'C0000000' ? formData.driverDeclarationSignature : '',
      
      // Metadata
      'Submission Date': formData.enteredByStaff && formData.formFilledOutDate 
        ? formData.formFilledOutDate 
        : new Date().toISOString().split('T')[0],
      'Status': 'New Application',
      'Notes': `Volunteer application ${formData.enteredByStaff ? `entered by staff (original date: ${formData.formFilledOutDate})` : 'submitted via online form'} on ${formData.enteredByStaff && formData.formFilledOutDate ? formData.formFilledOutDate : new Date().toLocaleDateString()}\n\nInsurance Consent: Signed ${formData.insuranceConsentSignature} on ${formData.insuranceConsentDate}\nMedia Release: Initialed ${formData.mediaReleaseInitials} on ${formData.mediaReleaseDate}\nDriver Declaration: ${formData.willingToDrive ? (formData.driverDeclarationSignature !== 'C0000000' ? `License #${formData.driverDeclarationSignature}` : 'No license provided') : 'N/A'}\nTruthfulness: Signed ${formData.truthfulnessSignature} on ${formData.truthfulnessDate}`,
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

    // Send email notification with full form data
    try {
      const emailHtml = generateVolunteerEmail(formData);

      await sendEmail({
        to: ['sam@samuelholley.com', 'activities@ukiahseniorcenter.org'],
        subject: `✅ New Volunteer Application: ${formData.firstName} ${formData.lastName}`,
        html: emailHtml,
      });

      console.log('Email notification sent successfully to both recipients');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      recordId: result.id,
      message: 'Volunteer application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit volunteer application',
      },
      { status: 500 }
    );
  }
}
