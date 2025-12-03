'use client'

import { useState, useEffect } from 'react'

// Type definitions
interface VolunteerFormData {
  // Personal Information
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  apt: string
  city: string
  zip: string
  dateOfBirth: string
  
  // Demographics
  physicalLimitations: 'yes' | 'no' | ''
  physicalLimitationsDetails: string
  ethnicity: string[]
  ethnicityOther: string
  sex: 'female' | 'male' | ''
  pronouns: 'she/her' | 'he/him' | 'they/them' | ''
  militaryStatus: 'veteran' | 'spouse' | 'family' | 'no' | ''
  shirtSize: string
  
  // Referral Source
  referralSource: string[]
  referralAgencyStaff: string
  referralFriend: string
  referralNewspaper: string
  referralBrochure: string
  
  // Skills and Interests (checkboxes)
  skillAccounting: boolean
  skillAdultEducation: boolean
  skillAdultAdvocate: boolean
  skillChildEducation: boolean
  skillChildAdvocate: boolean
  skillComputer: boolean
  skillCounseling: boolean
  skillDisaster: boolean
  skillEnvironment: boolean
  skillFoodBank: boolean
  skillFriendlyVisits: boolean
  skillGiftShop: boolean
  skillHomeless: boolean
  skillHospice: boolean
  skillInstructor: boolean
  skillInfoReferral: boolean
  skillMaintenance: boolean
  skillMentor: boolean
  skillMoneyManagement: boolean
  skillOfficeAssistant: boolean
  skillPublicRelations: boolean
  skillReadingAloud: boolean
  skillReceptionist: boolean
  skillRecreation: boolean
  skillSeniorMeal: boolean
  skillShopping: boolean
  skillTransportation: boolean
  skillVolunteerCoordinator: boolean
  skillOther: boolean
  skillOtherDetails: string
  languagesSpoken: string
  
  // Emergency Contact & Beneficiary
  beneficiaryFirstName: string
  beneficiaryLastName: string
  beneficiaryRelationship: string
  beneficiaryAddress: string
  beneficiaryPhone: string
  beneficiaryEmail: string
  
  emergencyFirstName: string
  emergencyLastName: string
  emergencyRelationship: string
  emergencyAddress: string
  emergencyPhone: string
  emergencyEmail: string
  
  // Legal Declarations & Signatures
  insuranceConsentSignature: string
  insuranceConsentDate: string
  mediaReleaseInitials: string
  mediaReleaseDate: string
  driverDeclarationSignature: string
  willingToDrive: boolean
  truthfulnessSignature: string
  truthfulnessDate: string
  
  // Minor Volunteer
  isMinor: boolean
  parentGuardianSignature: string
  parentGuardianMediaInitials: string
  parentGuardianTruthSignature: string
  
  // Staff Entry
  enteredByStaff: boolean
  formFilledOutDate: string
}

interface FormStep {
  id: number
  title: string
  description: string
}

const FORM_STEPS: FormStep[] = [
  { id: 1, title: 'Personal Information', description: 'Basic contact information' },
  { id: 2, title: 'Demographics', description: 'Personal details for RSVP records' },
  { id: 3, title: 'Referral Source', description: 'How did you hear about us?' },
  { id: 4, title: 'Skills & Interests', description: 'Volunteer preferences and abilities' },
  { id: 5, title: 'Emergency Contacts', description: 'Beneficiary and emergency contact' },
  { id: 6, title: 'Legal & Insurance', description: 'Required declarations and consent' },
  { id: 7, title: 'Review & Submit', description: 'Confirm all information' },
]

// Error message component
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <p className="text-red-600 text-sm font-['Bitter',serif] mt-1" style={{ lineHeight: '1.4' }}>
      {message}
    </p>
  )
}

// Input field component
const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
}) => {
  // Generate unique ID for accessibility
  const id = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <label htmlFor={id} className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
        style={{ padding: '12px 16px', fontSize: '1rem' }}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <ErrorMessage message={error} />
    </div>
  );
};

// Dev mode helper - pre-filled test data
const TEST_DATA: VolunteerFormData = {
  firstName: 'Test',
  lastName: 'Volunteer',
  phone: '7075551234',
  email: 'test@example.com',
  address: '123 Main St',
  apt: '',
  city: 'Ukiah',
  zip: '95482',
  dateOfBirth: '1980-01-01',
  physicalLimitations: 'no',
  physicalLimitationsDetails: '',
  ethnicity: ['white'],
  ethnicityOther: '',
  sex: 'female',
  pronouns: 'she/her',
  militaryStatus: 'no',
  shirtSize: 'M',
  referralSource: ['website'],
  referralAgencyStaff: '',
  referralFriend: '',
  referralNewspaper: '',
  referralBrochure: '',
  skillAccounting: false,
  skillAdultEducation: false,
  skillAdultAdvocate: false,
  skillChildEducation: false,
  skillChildAdvocate: false,
  skillComputer: false,
  skillCounseling: false,
  skillDisaster: false,
  skillEnvironment: false,
  skillFoodBank: false,
  skillFriendlyVisits: true,
  skillGiftShop: false,
  skillHomeless: false,
  skillHospice: false,
  skillInstructor: false,
  skillInfoReferral: false,
  skillMaintenance: false,
  skillMentor: false,
  skillMoneyManagement: false,
  skillOfficeAssistant: false,
  skillPublicRelations: false,
  skillReadingAloud: false,
  skillReceptionist: false,
  skillRecreation: false,
  skillSeniorMeal: true,
  skillShopping: false,
  skillTransportation: false,
  skillVolunteerCoordinator: false,
  skillOther: false,
  skillOtherDetails: '',
  languagesSpoken: 'English',
  beneficiaryFirstName: 'Jane',
  beneficiaryLastName: 'Doe',
  beneficiaryRelationship: 'Sister',
  beneficiaryPhone: '7075555678',
  beneficiaryEmail: 'jane@example.com',
  beneficiaryAddress: '123 Main St, Ukiah',
  emergencyFirstName: 'John',
  emergencyLastName: 'Doe',
  emergencyRelationship: 'Brother',
  emergencyPhone: '7075559999',
  emergencyEmail: 'john@example.com',
  emergencyAddress: '123 Main St, Ukiah',
  insuranceConsentSignature: 'Test Volunteer',
  insuranceConsentDate: new Date().toISOString().split('T')[0],
  mediaReleaseInitials: 'TV',
  mediaReleaseDate: new Date().toISOString().split('T')[0],
  driverDeclarationSignature: 'C0000000',
  willingToDrive: true,
  truthfulnessSignature: 'Test Volunteer',
  truthfulnessDate: new Date().toISOString().split('T')[0],
  enteredByStaff: false,
  formFilledOutDate: '',
  isMinor: false,
  parentGuardianSignature: '',
  parentGuardianMediaInitials: '',
  parentGuardianTruthSignature: '',
}

export default function VolunteerForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [devMode, setDevMode] = useState(false)
  
  // Load saved form data from localStorage on mount
  const [formData, setFormData] = useState<VolunteerFormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('volunteerFormData')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load saved form data:', e)
        }
      }
    }
    return {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    apt: '',
    city: 'Ukiah',
    zip: '',
    dateOfBirth: '',
    physicalLimitations: '',
    physicalLimitationsDetails: '',
    ethnicity: [],
    ethnicityOther: '',
    sex: '',
    pronouns: '',
    militaryStatus: '',
    shirtSize: '',
    referralSource: [],
    referralAgencyStaff: '',
    referralFriend: '',
    referralNewspaper: '',
    referralBrochure: '',
    skillAccounting: false,
    skillAdultEducation: false,
    skillAdultAdvocate: false,
    skillChildEducation: false,
    skillChildAdvocate: false,
    skillComputer: false,
    skillCounseling: false,
    skillDisaster: false,
    skillEnvironment: false,
    skillFoodBank: false,
    skillFriendlyVisits: false,
    skillGiftShop: false,
    skillHomeless: false,
    skillHospice: false,
    skillInstructor: false,
    skillInfoReferral: false,
    skillMaintenance: false,
    skillMentor: false,
    skillMoneyManagement: false,
    skillOfficeAssistant: false,
    skillPublicRelations: false,
    skillReadingAloud: false,
    skillReceptionist: false,
    skillRecreation: false,
    skillSeniorMeal: false,
    skillShopping: false,
    skillTransportation: false,
    skillVolunteerCoordinator: false,
    skillOther: false,
    skillOtherDetails: '',
    languagesSpoken: '',
    beneficiaryFirstName: '',
    beneficiaryLastName: '',
    beneficiaryRelationship: '',
    beneficiaryAddress: '',
    beneficiaryPhone: '',
    beneficiaryEmail: '',
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyRelationship: '',
    emergencyAddress: '',
    emergencyPhone: '',
    emergencyEmail: '',
    insuranceConsentSignature: '',
    insuranceConsentDate: '',
    mediaReleaseInitials: '',
    mediaReleaseDate: '',
    driverDeclarationSignature: '',
    willingToDrive: false,
    truthfulnessSignature: '',
    truthfulnessDate: '',
    enteredByStaff: false,
    formFilledOutDate: '',
    isMinor: false,
    parentGuardianSignature: '',
    parentGuardianMediaInitials: '',
    parentGuardianTruthSignature: '',
    }
  })

  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Auto-save form data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('volunteerFormData', JSON.stringify(formData))
    }
  }, [formData])

  // Clear saved data on successful submit
  useEffect(() => {
    if (submitSuccess && typeof window !== 'undefined') {
      localStorage.removeItem('volunteerFormData')
    }
  }, [submitSuccess])

  // Update form field
  const updateField = (field: keyof VolunteerFormData, value: string | boolean | string[]) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-fill ZIP code based on city
      if (field === 'city' && typeof value === 'string') {
        const cityLower = value.toLowerCase().trim()
        if (cityLower === 'ukiah') {
          updated.zip = '95482'
        } else if (cityLower === 'redwood valley') {
          updated.zip = '95470'
        }
      }
      
      return updated
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Autofill sample data for current step
  const autofillCurrentStep = () => {
    // Use setTimeout to avoid React hydration errors during rapid state updates
    setTimeout(() => {
      const updates: Partial<VolunteerFormData> = {}
      
      switch (currentStep) {
      case 1: // Personal Information
        updates.firstName = 'John'
        updates.lastName = 'Smith'
        updates.phone = '7075551234'
        updates.email = 'john.smith@example.com'
        updates.address = '456 Oak Street'
        updates.apt = 'Unit B'
        updates.city = 'Ukiah'
        updates.zip = '95482'
        updates.dateOfBirth = '1960-05-15'
        break
      
      case 2: // Demographics
        updates.physicalLimitations = 'no'
        updates.ethnicity = ['caucasian']
        updates.sex = 'male'
        updates.pronouns = 'he/him'
        updates.militaryStatus = 'no'
        updates.shirtSize = 'L'
        break
      
      case 3: // Referral Source
        updates.referralSource = ['friend']
        updates.referralFriend = 'Jane Doe'
        break
      
      case 4: // Skills and Interests
        updates.skillFriendlyVisits = true
        updates.skillSeniorMeal = true
        updates.skillOfficeAssistant = true
        updates.languagesSpoken = 'English, Spanish'
        break
      
      case 5: // Emergency Contacts
        updates.beneficiaryFirstName = 'Mary'
        updates.beneficiaryLastName = 'Smith'
        updates.beneficiaryRelationship = 'Spouse'
        updates.beneficiaryPhone = '7075555678'
        updates.beneficiaryEmail = 'mary.smith@example.com'
        updates.beneficiaryAddress = '456 Oak Street, Ukiah, CA 95482'
        updates.emergencyFirstName = 'Robert'
        updates.emergencyLastName = 'Johnson'
        updates.emergencyRelationship = 'Brother'
        updates.emergencyPhone = '7075559999'
        updates.emergencyEmail = 'robert.j@example.com'
        updates.emergencyAddress = '789 Pine Ave, Ukiah, CA 95482'
        break
      
      case 6: // Legal Declarations
        const today = new Date().toISOString().split('T')[0]
        updates.insuranceConsentSignature = 'John Smith'
        updates.insuranceConsentDate = today
        updates.mediaReleaseInitials = 'JS'
        updates.mediaReleaseDate = today
        updates.willingToDrive = true
        updates.driverDeclarationSignature = 'D1234567'
        updates.truthfulnessSignature = 'John Smith'
        updates.truthfulnessDate = today
        break
      }
      
      setFormData(prev => ({ ...prev, ...updates }))
    }, 0)
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof VolunteerFormData, string>> = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        // Phone validation: must have exactly 10 digits
        const phoneDigits = formData.phone.replace(/\D/g, '')
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required'
        } else if (phoneDigits.length !== 10) {
          newErrors.phone = 'Phone number must have exactly 10 digits'
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required'
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.zip.match(/^[0-9]{5}$/)) newErrors.zip = 'Valid 5-digit ZIP code is required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (formData.enteredByStaff && !formData.formFilledOutDate) newErrors.formFilledOutDate = 'Form filled out date is required'
        break

      case 2:
        if (!formData.physicalLimitations) newErrors.physicalLimitations = 'Please indicate if you have physical limitations'
        if (formData.physicalLimitations === 'yes' && !formData.physicalLimitationsDetails.trim()) {
          newErrors.physicalLimitationsDetails = 'Please describe your physical limitations'
        }
        if (formData.ethnicity.length === 0) newErrors.ethnicity = 'Please select at least one ethnicity'
        if (formData.ethnicity.includes('other') && !formData.ethnicityOther.trim()) {
          newErrors.ethnicityOther = 'Please specify your ethnicity'
        }
        if (!formData.sex) newErrors.sex = 'Please select your sex'
        if (!formData.pronouns) newErrors.pronouns = 'Please select your pronouns'
        if (!formData.militaryStatus) newErrors.militaryStatus = 'Please select your military status'
        if (!formData.shirtSize) newErrors.shirtSize = 'Please select your shirt size'
        break

      case 3:
        if (formData.referralSource.length === 0) {
          newErrors.referralSource = 'Please select at least one referral source'
        }
        break

      case 4:
        // At least one skill must be selected
        const hasSkill = formData.skillOfficeAssistant || formData.skillReceptionist || 
                        formData.skillComputer || formData.skillAccounting ||
                        formData.skillFriendlyVisits || formData.skillTransportation ||
                        formData.skillShopping || formData.skillSeniorMeal ||
                        formData.skillRecreation || formData.skillInstructor ||
                        formData.skillGiftShop || formData.skillFoodBank ||
                        formData.skillMaintenance || formData.skillPublicRelations ||
                        formData.skillOther
        if (!hasSkill) {
          newErrors.skillOther = 'Please select at least one skill or interest'
        }
        if (formData.skillOther && !formData.skillOtherDetails.trim()) {
          newErrors.skillOtherDetails = 'Please describe your other skills'
        }
        break

      case 5:
        if (!formData.beneficiaryFirstName.trim()) newErrors.beneficiaryFirstName = 'Beneficiary first name is required'
        if (!formData.beneficiaryLastName.trim()) newErrors.beneficiaryLastName = 'Beneficiary last name is required'
        if (!formData.beneficiaryRelationship.trim()) newErrors.beneficiaryRelationship = 'Relationship is required'
        // Beneficiary phone validation: must have exactly 10 digits
        const beneficiaryPhoneDigits = formData.beneficiaryPhone.replace(/\D/g, '')
        if (!formData.beneficiaryPhone.trim()) {
          newErrors.beneficiaryPhone = 'Phone number is required'
        } else if (beneficiaryPhoneDigits.length !== 10) {
          newErrors.beneficiaryPhone = 'Phone number must have exactly 10 digits'
        }
        
        if (!formData.emergencyFirstName.trim()) newErrors.emergencyFirstName = 'Emergency contact first name is required'
        if (!formData.emergencyLastName.trim()) newErrors.emergencyLastName = 'Emergency contact last name is required'
        if (!formData.emergencyRelationship.trim()) newErrors.emergencyRelationship = 'Relationship is required'
        // Emergency phone validation: must have exactly 10 digits
        const emergencyPhoneDigits = formData.emergencyPhone.replace(/\D/g, '')
        if (!formData.emergencyPhone.trim()) {
          newErrors.emergencyPhone = 'Phone number is required'
        } else if (emergencyPhoneDigits.length !== 10) {
          newErrors.emergencyPhone = 'Phone number must have exactly 10 digits'
        }
        break

      case 6:
        if (!formData.insuranceConsentSignature.trim()) newErrors.insuranceConsentSignature = 'Signature is required'
        if (!formData.insuranceConsentDate) newErrors.insuranceConsentDate = 'Date is required'
        if (formData.isMinor && !formData.parentGuardianSignature.trim()) newErrors.parentGuardianSignature = 'Parent/Guardian signature is required for minors'
        if (!formData.mediaReleaseInitials.trim()) newErrors.mediaReleaseInitials = 'Initials are required'
        if (!formData.mediaReleaseDate) newErrors.mediaReleaseDate = 'Date is required'
        if (formData.isMinor && !formData.parentGuardianMediaInitials.trim()) newErrors.parentGuardianMediaInitials = 'Parent/Guardian initials are required for minors'
        if (formData.willingToDrive && !formData.driverDeclarationSignature.trim()) {
          newErrors.driverDeclarationSignature = 'Driver signature is required'
        }
        if (!formData.truthfulnessSignature.trim()) newErrors.truthfulnessSignature = 'Signature is required'
        if (!formData.truthfulnessDate) newErrors.truthfulnessDate = 'Date is required'
        if (formData.isMinor && !formData.parentGuardianTruthSignature.trim()) newErrors.parentGuardianTruthSignature = 'Parent/Guardian signature is required for minors'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigate to next step
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Navigate to previous step
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(6)) return

    setIsSubmitting(true)

    try {
      // Submit form data to Airtable
      const response = await fetch('/api/submit-volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit volunteer application')
      }

      const result = await response.json()
      console.log('Volunteer application submitted:', result.recordId)

      // Clear saved form data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('volunteerFormData')
      }

      // Show success message
      setSubmitSuccess(true)
      setCurrentStep(FORM_STEPS.length)
    } catch (error) {
      console.error('Submission error:', error)
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render progress indicator
  const ProgressIndicator = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2 overflow-x-auto pb-1">
        {FORM_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div
              className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full font-['Jost',sans-serif] font-bold text-xs md:text-sm shrink-0 transition-all duration-300 ${
                currentStep >= step.id
                  ? 'bg-[#427d78] text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.id}
            </div>
            {index < FORM_STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1.5 rounded-full transition-all duration-300 ${
                  currentStep > step.id ? 'bg-[#427d78]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-lg md:text-xl mb-1">
          {FORM_STEPS[currentStep - 1].title}
        </h2>
        <p className="font-['Bitter',serif] text-gray-600 text-sm md:text-base leading-snug">
          {FORM_STEPS[currentStep - 1].description}
        </p>
      </div>
    </div>
  )

  // Render Step 1: Personal Information
  const renderStep1 = () => (
    <div>
      {/* Staff Entry Checkbox */}
      <div className="bg-[#f0f7f6] border-2 border-[#427d78] rounded-lg p-4 mb-4" style={{ marginBottom: 'var(--space-3)' }}>
        <label className="flex items-start cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5 mr-2">
            <input
              type="checkbox"
              checked={formData.enteredByStaff}
              onChange={(e) => updateField('enteredByStaff', e.target.checked)}
              className="peer appearance-none w-5 h-5 border-2 border-[#427d78] rounded cursor-pointer checked:bg-[#427d78] checked:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#5eb3a1] focus:ring-offset-2 transition-all duration-200"
            />
            <svg
              className="absolute w-3.5 h-3.5 text-white pointer-events-none hidden peer-checked:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-['Jost',sans-serif] font-semibold text-gray-900 text-base block">
              Staff Entry
            </span>
            <span className="font-['Bitter',serif] text-gray-700 text-sm mt-0.5 block leading-snug">
              Check this box if you are a staff member entering a paper form on behalf of a volunteer
            </span>
          </div>
        </label>
        {formData.enteredByStaff && (
          <div className="mt-5 pt-5 border-t-2 border-[#5eb3a1]">
            <label htmlFor="formFilledOutDate" className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2">
              Date Volunteer Completed Form <span className="text-[#427d78]">*</span>
            </label>
            <input
              id="formFilledOutDate"
              type="date"
              value={formData.formFilledOutDate}
              onChange={(e) => updateField('formFilledOutDate', e.target.value)}
              className="w-full max-w-xs border-2 border-gray-300 rounded-lg px-4 py-3 font-['Bitter',serif] focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20 transition-all duration-200"
              required={formData.enteredByStaff}
            />
            <p className="text-sm text-gray-600 font-['Bitter',serif] mt-2 leading-relaxed">
              This date will be recorded as the official submission date
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          value={formData.firstName}
          onChange={(value) => updateField('firstName', value)}
          error={errors.firstName}
          required
          placeholder="Jane"
        />
        <InputField
          label="Last Name"
          value={formData.lastName}
          onChange={(value) => updateField('lastName', value)}
          error={errors.lastName}
          required
          placeholder="Doe"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
          required
          placeholder="(707) 555-1234"
        />
        <div>
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            error={errors.email}
            required
            placeholder="jane.doe@example.com"
          />
          <p className="text-sm text-gray-600 font-['Bitter',serif] mt-1" style={{ fontSize: '0.875rem' }}>
            Note: Capital and lowercase letters work the same (JaneDoe@email.com is the same as janedoe@email.com)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <InputField
          label="Street Address"
          value={formData.address}
          onChange={(value) => updateField('address', value)}
          error={errors.address}
          required
          placeholder="123 Main Street"
        />
        </div>
        <InputField
          label="Apt #"
          value={formData.apt}
          onChange={(value) => updateField('apt', value)}
          error={errors.apt}
          placeholder="Apt 4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="City"
          value={formData.city}
          onChange={(value) => updateField('city', value)}
          error={errors.city}
          required
          placeholder="Ukiah"
        />
        <InputField
          label="ZIP Code"
          value={formData.zip}
          onChange={(value) => updateField('zip', value)}
          error={errors.zip}
          required
          placeholder="95482"
        />
      </div>

      <InputField
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(value) => updateField('dateOfBirth', value)}
          error={errors.dateOfBirth}
          required
        />
    </div>
  )

  // Render Step 2: Demographics
  const renderStep2 = () => (
    <div>
      {/* Physical Limitations */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Physical Limitations <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['yes', 'no'] as const).map((option) => (
            <label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.physicalLimitations === option
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="radio"
                name="physicalLimitations"
                value={option}
                checked={formData.physicalLimitations === option}
                onChange={(e) => updateField('physicalLimitations', e.target.value)}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78]"
              />
              <span className="ml-3 font-['Jost',sans-serif] font-semibold text-gray-900 capitalize" style={{ fontSize: '1rem' }}>
                {option}
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.physicalLimitations} />
      </div>

      {formData.physicalLimitations === 'yes' && (
        <InputField
          label="Please describe your physical limitations"
          value={formData.physicalLimitationsDetails}
          onChange={(value) => updateField('physicalLimitationsDetails', value)}
          error={errors.physicalLimitationsDetails}
          required
          placeholder="Describe any physical limitations..."
        />
      )}

      {/* Ethnicity */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1rem' }}>
          Ethnicity <span className="text-red-600">*</span> <span className="text-gray-600 font-normal text-sm">(Select all that apply)</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'asian', label: 'Asian' },
            { value: 'hispanic', label: 'Hispanic' },
            { value: 'african_american', label: 'African American' },
            { value: 'native_american', label: 'Native American' },
            { value: 'caucasian', label: 'Caucasian' },
            { value: 'white', label: 'White' },
            { value: 'other', label: 'Other' },
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ethnicity.includes(option.value)}
                onChange={(e) => {
                  const newEthnicities = e.target.checked
                    ? [...formData.ethnicity, option.value]
                    : formData.ethnicity.filter((eth) => eth !== option.value)
                  updateField('ethnicity', newEthnicities)
                }}
                className="w-4 h-4 text-[#427d78] border-gray-300 rounded focus:ring-[#427d78] cursor-pointer"
              />
              <span className="ml-2 font-['Bitter',serif]" style={{ fontSize: '1rem' }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.ethnicity} />
      </div>

      {formData.ethnicity.includes('other') && (
        <InputField
          label="Please specify"
          value={formData.ethnicityOther}
          onChange={(value) => updateField('ethnicityOther', value)}
          error={errors.ethnicityOther}
          required
          placeholder="Your ethnicity..."
        />
      )}

      {/* Sex */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
          Sex <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.sex}
          onChange={(e) => updateField('sex', e.target.value)}
          className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
            errors.sex ? 'border-red-500' : 'border-gray-300'
          } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
          style={{ padding: '12px 16px', fontSize: '1rem' }}
        >
          <option value="">Select...</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <ErrorMessage message={errors.sex} />
      </div>

      {/* Pronouns */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
          Pronouns <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.pronouns}
          onChange={(e) => updateField('pronouns', e.target.value)}
          className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
            errors.pronouns ? 'border-red-500' : 'border-gray-300'
          } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
          style={{ padding: '12px 16px', fontSize: '1rem' }}
        >
          <option value="">Select...</option>
          <option value="she/her">She/Her</option>
          <option value="he/him">He/Him</option>
          <option value="they/them">They/Them</option>
        </select>
        <ErrorMessage message={errors.pronouns} />
      </div>

      {/* Military Status */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
          Military Status <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.militaryStatus}
          onChange={(e) => updateField('militaryStatus', e.target.value)}
          className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
            errors.militaryStatus ? 'border-red-500' : 'border-gray-300'
          } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
          style={{ padding: '12px 16px', fontSize: '1rem' }}
        >
          <option value="">Select...</option>
          <option value="veteran">Military Veteran</option>
          <option value="spouse">Military Veteran Spouse</option>
          <option value="family">Military Veteran Family</option>
          <option value="no">No Military Affiliation</option>
        </select>
        <ErrorMessage message={errors.militaryStatus} />
      </div>

      {/* Shirt Size */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
          T-Shirt/Sweatshirt Size <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.shirtSize}
          onChange={(e) => updateField('shirtSize', e.target.value)}
          className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
            errors.shirtSize ? 'border-red-500' : 'border-gray-300'
          } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
          style={{ padding: '12px 16px', fontSize: '1rem' }}
        >
          <option value="">Select...</option>
          <option value="xs">X-Small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
          <option value="xl">X-Large</option>
          <option value="2xl">2XL</option>
          <option value="3xl">3XL</option>
          <option value="4xl">4XL</option>
        </select>
        <ErrorMessage message={errors.shirtSize} />
      </div>
    </div>
  )

  // Render Step 3: Referral Source
  const renderStep3 = () => (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          How did you hear about our volunteer program? <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'friend_family', label: 'Friend or Family Member' },
            { value: 'social_media', label: 'Social Media' },
            { value: 'website', label: 'Website' },
            { value: 'newspaper', label: 'Newspaper' },
            { value: 'community_event', label: 'Community Event' },
            { value: 'other', label: 'Other' },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.referralSource.includes(option.value)
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.referralSource.includes(option.value)}
                onChange={(e) => {
                  const newSources = e.target.checked
                    ? [...formData.referralSource, option.value]
                    : formData.referralSource.filter(s => s !== option.value)
                  updateField('referralSource', newSources)
                }}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] rounded"
              />
              <span className="ml-3 font-['Jost',sans-serif] font-semibold text-gray-900" style={{ fontSize: '1rem' }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.referralSource} />
      </div>
    </div>
  )
  // Render Step 4: Skills & Interests
  const renderStep4 = () => (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Volunteer Skills & Interests <span className="text-red-600">*</span>
        </label>
        <p className="text-gray-600 mb-3 font-['Bitter',serif]" style={{ fontSize: '0.95rem' }}>
          Select all areas where you would like to volunteer
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'skillOfficeAssistant', label: 'Office Assistant' },
            { key: 'skillReceptionist', label: 'Receptionist' },
            { key: 'skillComputer', label: 'Computer/Technology Support' },
            { key: 'skillAccounting', label: 'Accounting/Finance' },
            { key: 'skillFriendlyVisits', label: 'Friendly Visits' },
            { key: 'skillTransportation', label: 'Transportation' },
            { key: 'skillShopping', label: 'Shopping Assistance' },
            { key: 'skillSeniorMeal', label: 'Senior Meal Program' },
            { key: 'skillRecreation', label: 'Recreation/Activities' },
            { key: 'skillInstructor', label: 'Class Instructor' },
            { key: 'skillGiftShop', label: 'Gift Shop' },
            { key: 'skillFoodBank', label: 'Food Bank' },
            { key: 'skillMaintenance', label: 'Maintenance/Repairs' },
            { key: 'skillPublicRelations', label: 'Public Relations/Marketing' },
            { key: 'skillOther', label: 'Other' },
          ].map((skill) => (
            <label
              key={skill.key}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData[skill.key as keyof VolunteerFormData]
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="checkbox"
                checked={!!formData[skill.key as keyof VolunteerFormData]}
                onChange={(e) => updateField(skill.key as keyof VolunteerFormData, e.target.checked)}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] rounded"
              />
              <span className="ml-3 font-['Jost',sans-serif] text-gray-900" style={{ fontSize: '0.95rem' }}>
                {skill.label}
              </span>
            </label>
          ))}
        </div>
        {formData.skillOther && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <InputField
              label="Please specify other skills/interests"
              value={formData.skillOtherDetails}
              onChange={(value) => updateField('skillOtherDetails', value)}
              error={errors.skillOtherDetails}
              required
              placeholder="Describe your other skills or interests..."
            />
          </div>
        )}
      </div>

      <InputField
        label="Languages Spoken (besides English)"
        value={formData.languagesSpoken}
        onChange={(value) => updateField('languagesSpoken', value)}
        placeholder="e.g., Spanish, Tagalog, Mandarin..."
      />
    </div>
  )
  // Render Step 5: Emergency Contacts
  const renderStep5 = () => (
    <div>
      {/* Beneficiary Information */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Beneficiary Information
        </h3>
        <p className="text-gray-600 mb-4 font-['Bitter',serif]" style={{ fontSize: '0.95rem' }}>
          Person to be notified in case of emergency
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={formData.beneficiaryFirstName}
            onChange={(value) => updateField('beneficiaryFirstName', value)}
            error={errors.beneficiaryFirstName}
            required
          />
          <InputField
            label="Last Name"
            value={formData.beneficiaryLastName}
            onChange={(value) => updateField('beneficiaryLastName', value)}
            error={errors.beneficiaryLastName}
            required
          />
        </div>

        <InputField
          label="Relationship"
          value={formData.beneficiaryRelationship}
          onChange={(value) => updateField('beneficiaryRelationship', value)}
          error={errors.beneficiaryRelationship}
          required
          placeholder="e.g., Spouse, Child, Parent..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            type="tel"
            value={formData.beneficiaryPhone}
            onChange={(value) => updateField('beneficiaryPhone', value)}
            error={errors.beneficiaryPhone}
            required
            placeholder="(707) 555-0123"
          />
          <InputField
            label="Email"
            type="email"
            value={formData.beneficiaryEmail}
            onChange={(value) => updateField('beneficiaryEmail', value)}
            error={errors.beneficiaryEmail}
            placeholder="email@example.com"
          />
        </div>

        <InputField
          label="Address"
          value={formData.beneficiaryAddress}
          onChange={(value) => updateField('beneficiaryAddress', value)}
          error={errors.beneficiaryAddress}
          required
          placeholder="Street address"
        />
      </div>

      {/* Emergency Contact Information */}
      <div>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Emergency Contact
        </h3>
        <p className="text-gray-600 mb-4 font-['Bitter',serif]" style={{ fontSize: '0.95rem' }}>
          Alternate person to contact in an emergency
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={formData.emergencyFirstName}
            onChange={(value) => updateField('emergencyFirstName', value)}
            error={errors.emergencyFirstName}
            required
          />
          <InputField
            label="Last Name"
            value={formData.emergencyLastName}
            onChange={(value) => updateField('emergencyLastName', value)}
            error={errors.emergencyLastName}
            required
          />
        </div>

        <InputField
          label="Relationship"
          value={formData.emergencyRelationship}
          onChange={(value) => updateField('emergencyRelationship', value)}
          error={errors.emergencyRelationship}
          required
          placeholder="e.g., Sibling, Friend, Neighbor..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            type="tel"
            value={formData.emergencyPhone}
            onChange={(value) => updateField('emergencyPhone', value)}
            error={errors.emergencyPhone}
            required
            placeholder="(707) 555-0123"
          />
          <InputField
            label="Email"
            type="email"
            value={formData.emergencyEmail}
            onChange={(value) => updateField('emergencyEmail', value)}
            error={errors.emergencyEmail}
            placeholder="email@example.com"
          />
        </div>

        <InputField
          label="Address"
          value={formData.emergencyAddress}
          onChange={(value) => updateField('emergencyAddress', value)}
          error={errors.emergencyAddress}
          required
          placeholder="Street address"
        />
      </div>
    </div>
  )
  // Render Step 6: Legal & Insurance
  const renderStep6 = () => (
    <div>
      {/* Driver Information */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Transportation & Driving
        </h3>
        
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-300 hover:border-[#427d78]">
            <input
              type="checkbox"
              checked={formData.willingToDrive}
              onChange={(e) => updateField('willingToDrive', e.target.checked)}
              className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] rounded mt-1"
            />
            <span className="ml-3 font-['Jost',sans-serif] text-gray-900" style={{ fontSize: '1rem' }}>
              I am willing and able to drive my personal vehicle for volunteer activities
            </span>
          </label>
        </div>

        {formData.willingToDrive && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4" style={{ marginBottom: 'var(--space-3)' }}>
            <p className="text-gray-700 mb-3 font-['Bitter',serif]" style={{ fontSize: '0.95rem' }}>
              <strong>Driver&apos;s Certification:</strong> I certify that I have a valid California driver&apos;s license, 
              current vehicle registration, and maintain automobile liability insurance as required by California law.
            </p>
            <InputField
              label="Driver's License Number"
              value={formData.driverDeclarationSignature}
              onChange={(value) => updateField('driverDeclarationSignature', value)}
              error={errors.driverDeclarationSignature}
              required={formData.willingToDrive}
              placeholder="D1234567"
            />
          </div>
        )}
      </div>

      {/* Minor Volunteer Checkbox - First signature instance */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isMinor}
              onChange={(e) => updateField('isMinor', e.target.checked)}
              className="w-5 h-5 text-[#427d78] border-gray-300 rounded focus:ring-[#427d78] mt-1 cursor-pointer"
            />
            <span className="ml-3 font-['Jost',sans-serif] font-semibold text-gray-900" style={{ fontSize: '1rem' }}>
              Volunteer is a minor (under 18 years old)
            </span>
          </label>
          {formData.isMinor && (
            <p className="text-sm text-blue-800 font-['Bitter',serif] mt-2 ml-8">
              Parent or guardian signatures will be required for all legal declarations below.
            </p>
          )}
        </div>
      </div>

      {/* Insurance Consent */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Insurance & Liability Consent
        </h3>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-700 mb-2 font-['Bitter',serif]" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            I understand that the Ukiah Senior Center does not provide liability, medical, or accident insurance 
            for volunteers. I accept full responsibility for my own actions while volunteering and agree to hold 
            harmless the Ukiah Senior Center, its officers, employees, and agents from any claims arising from 
            my volunteer service.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Your Full Name (Electronic Signature)"
            value={formData.insuranceConsentSignature}
            onChange={(value) => updateField('insuranceConsentSignature', value)}
            error={errors.insuranceConsentSignature}
            required
            placeholder="Type your full legal name"
          />
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Date"
            type="date"
            value={formData.insuranceConsentDate}
            onChange={(value) => updateField('insuranceConsentDate', value)}
            error={errors.insuranceConsentDate}
            required
          />
        </div>

        {formData.isMinor && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
            <p className="text-amber-900 font-['Jost',sans-serif] font-semibold mb-3" style={{ fontSize: '1rem' }}>
              Parent/Guardian Signature Required
            </p>
            <InputField
              label="Parent/Guardian Full Name (Electronic Signature)"
              value={formData.parentGuardianSignature}
              onChange={(value) => updateField('parentGuardianSignature', value)}
              error={errors.parentGuardianSignature}
              required
              placeholder="Type parent/guardian full legal name"
            />
          </div>
        )}
      </div>

      {/* Media Release */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Media Release Authorization
        </h3>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-700 mb-2 font-['Bitter',serif]" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            I grant permission to the Ukiah Senior Center to use photographs, video recordings, or other media 
            featuring my likeness for promotional, educational, or archival purposes. I understand this includes 
            use on the website, social media, newsletters, and other marketing materials.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Your Initials (to consent)"
            value={formData.mediaReleaseInitials}
            onChange={(value) => updateField('mediaReleaseInitials', value)}
            error={errors.mediaReleaseInitials}
            required
            placeholder="Type your initials"
          />
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Date"
            type="date"
            value={formData.mediaReleaseDate}
            onChange={(value) => updateField('mediaReleaseDate', value)}
            error={errors.mediaReleaseDate}
            required
          />
        </div>

        {formData.isMinor && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
            <p className="text-amber-900 font-['Jost',sans-serif] font-semibold mb-3" style={{ fontSize: '1rem' }}>
              Parent/Guardian Consent Required
            </p>
            <InputField
              label="Parent/Guardian Initials (to consent)"
              value={formData.parentGuardianMediaInitials}
              onChange={(value) => updateField('parentGuardianMediaInitials', value)}
              error={errors.parentGuardianMediaInitials}
              required
              placeholder="Type parent/guardian initials"
            />
          </div>
        )}
      </div>

      {/* Truthfulness Declaration */}
      <div>
        <h3 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3" style={{ fontSize: '1.25rem' }}>
          Declaration of Truthfulness
        </h3>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-gray-700 mb-2 font-['Bitter',serif]" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            I certify that all information provided in this volunteer application is true, complete, and accurate 
            to the best of my knowledge. I understand that any false information or significant omissions may 
            result in dismissal from the volunteer program.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Your Full Name (Electronic Signature)"
            value={formData.truthfulnessSignature}
            onChange={(value) => updateField('truthfulnessSignature', value)}
            error={errors.truthfulnessSignature}
            required
            placeholder="Type your full legal name"
          />
        </div>

        <div style={{ marginBottom: 'var(--space-3)' }}>
          <InputField
            label="Date"
            type="date"
            value={formData.truthfulnessDate}
            onChange={(value) => updateField('truthfulnessDate', value)}
            error={errors.truthfulnessDate}
            required
          />
        </div>

        {formData.isMinor && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
            <p className="text-amber-900 font-['Jost',sans-serif] font-semibold mb-3" style={{ fontSize: '1rem' }}>
              Parent/Guardian Signature Required
            </p>
            <InputField
              label="Parent/Guardian Full Name (Electronic Signature)"
              value={formData.parentGuardianTruthSignature}
              onChange={(value) => updateField('parentGuardianTruthSignature', value)}
              error={errors.parentGuardianTruthSignature}
              required
              placeholder="Type parent/guardian full legal name"
            />
          </div>
        )}
      </div>
    </div>
  )
  // Render Step 7: Review & Submit
  const renderStep7 = () => (
    <div>
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
        <h3 className="font-['Jost',sans-serif] font-semibold text-green-900 mb-2" style={{ fontSize: '1.25rem' }}>
          📋 Review Your Application
        </h3>
        <p className="text-green-800 font-['Bitter',serif]" style={{ fontSize: '0.95rem' }}>
          Please review all information below before submitting. You can go back to any step to make changes.
        </p>
      </div>

      {/* Personal Information Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Personal Information
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-['Bitter',serif]">
          <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
          <div><strong>DOB:</strong> {formData.dateOfBirth}</div>
          <div><strong>Phone:</strong> {formData.phone}</div>
          <div><strong>Email:</strong> {formData.email}</div>
          <div className="md:col-span-2"><strong>Address:</strong> {formData.address}, {formData.city} {formData.zip}</div>
        </div>
      </div>

      {/* Demographics Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Demographics
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-['Bitter',serif]">
          <div><strong>Physical Limitations:</strong> {formData.physicalLimitations === 'yes' ? 'Yes' : 'No'}</div>
          <div><strong>Ethnicity:</strong> {formData.ethnicity.map(eth => 
            eth === 'african_american' ? 'African American' :
            eth === 'native_american' ? 'Native American' :
            eth === 'asian' ? 'Asian' :
            eth === 'hispanic' ? 'Hispanic' :
            eth === 'caucasian' ? 'Caucasian' :
            eth === 'white' ? 'White' :
            eth === 'other' ? formData.ethnicityOther :
            eth
          ).join(', ')}</div>
          <div><strong>Sex:</strong> {formData.sex}</div>
          <div><strong>Pronouns:</strong> {formData.pronouns}</div>
          <div><strong>Military Status:</strong> {formData.militaryStatus}</div>
          <div><strong>Shirt Size:</strong> {formData.shirtSize}</div>
        </div>
      </div>

      {/* Referral Source Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Referral Source
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="text-sm font-['Bitter',serif]">
          <strong>How you heard about us:</strong> {formData.referralSource.length > 0 ? formData.referralSource.join(', ') : 'Not specified'}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Skills & Interests
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="text-sm font-['Bitter',serif]">
          <strong>Selected skills:</strong>{' '}
          {[
            formData.skillOfficeAssistant && 'Office Assistant',
            formData.skillReceptionist && 'Receptionist',
            formData.skillComputer && 'Computer Support',
            formData.skillAccounting && 'Accounting',
            formData.skillFriendlyVisits && 'Friendly Visits',
            formData.skillTransportation && 'Transportation',
            formData.skillShopping && 'Shopping',
            formData.skillSeniorMeal && 'Senior Meals',
            formData.skillRecreation && 'Recreation',
            formData.skillInstructor && 'Instructor',
            formData.skillGiftShop && 'Gift Shop',
            formData.skillFoodBank && 'Food Bank',
            formData.skillMaintenance && 'Maintenance',
            formData.skillPublicRelations && 'Public Relations',
            formData.skillOther && `Other: ${formData.skillOtherDetails}`,
          ].filter(Boolean).join(', ') || 'None selected'}
          {formData.languagesSpoken && (
            <div className="mt-2"><strong>Languages:</strong> {formData.languagesSpoken}</div>
          )}
        </div>
      </div>

      {/* Emergency Contacts Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Emergency Contacts
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="text-sm font-['Bitter',serif] space-y-3">
          <div>
            <strong>Beneficiary:</strong> {formData.beneficiaryFirstName} {formData.beneficiaryLastName} ({formData.beneficiaryRelationship})
            <div className="ml-4 text-gray-600">Phone: {formData.beneficiaryPhone}</div>
          </div>
          <div>
            <strong>Emergency Contact:</strong> {formData.emergencyFirstName} {formData.emergencyLastName} ({formData.emergencyRelationship})
            <div className="ml-4 text-gray-600">Phone: {formData.emergencyPhone}</div>
          </div>
        </div>
      </div>

      {/* Legal Declarations Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-6">
        <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
          Legal Declarations
          <button
            type="button"
            onClick={() => setCurrentStep(6)}
            className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
          >
            Edit
          </button>
        </h4>
        <div className="text-sm font-['Bitter',serif] space-y-2">
          <div>✓ Insurance & Liability Consent signed: {formData.insuranceConsentSignature} on {formData.insuranceConsentDate}</div>
          <div>✓ Media Release authorized: {formData.mediaReleaseInitials} on {formData.mediaReleaseDate}</div>
          <div>✓ Truthfulness Declaration signed: {formData.truthfulnessSignature} on {formData.truthfulnessDate}</div>
          {formData.willingToDrive && (
            <div>✓ Willing to drive - License #: {formData.driverDeclarationSignature}</div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
        <p className="text-blue-900 font-['Bitter',serif] text-center" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          By clicking <strong>&quot;Submit Enrollment&quot;</strong> below, you confirm that all information provided is accurate 
          and you agree to abide by the Ukiah Senior Center volunteer policies.
        </p>
      </div>
    </div>
  )

  // Render utility buttons (autofill and review)
  const renderUtilityButtons = () => {
    if (submitSuccess || currentStep === FORM_STEPS.length) return null

    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4 justify-center">
        {formData.enteredByStaff && (
          <button
            type="button"
            onClick={autofillCurrentStep}
            className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            📝 Autofill Sample Data
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowReviewModal(true)}
          className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          👁️ Review All Entries
        </button>
      </div>
    )
  }

  // Render navigation buttons
  const renderNavigationButtons = () => {
    if (submitSuccess) return null

    return (
      <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
        {currentStep > 1 && currentStep < FORM_STEPS.length ? (
          <button
            onClick={goToPreviousStep}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-['Jost',sans-serif] font-semibold text-base px-6 py-3 transition-all duration-300"
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}

        {currentStep < FORM_STEPS.length ? (
          <button
            onClick={goToNextStep}
            className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-6 py-3 transition-all duration-300 ml-auto"
          >
            Next →
          </button>
        ) : currentStep === FORM_STEPS.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-8 py-3 transition-all duration-300 ml-auto ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Volunteer Application'}
          </button>
        ) : null}
      </div>
    )
  }

  // Main render
  return (
    <div>
      {/* Dev Mode Controls - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-['Jost',sans-serif] font-bold text-yellow-900">🛠️ Dev Mode</h3>
            <button
              type="button"
              onClick={() => setDevMode(!devMode)}
              className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm font-['Jost',sans-serif] font-semibold"
            >
              {devMode ? 'Disable' : 'Enable'}
            </button>
          </div>
          {devMode && (
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setFormData(TEST_DATA)
                  alert('Form pre-filled with test data!')
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-['Jost',sans-serif]"
              >
                Fill Test Data
              </button>
              {FORM_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`px-3 py-1 rounded text-sm font-['Jost',sans-serif] ${
                    currentStep === step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Jump to Step {step.id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto-save notification and clear button */}
      {!submitSuccess && typeof window !== 'undefined' && localStorage.getItem('volunteerFormData') && (
        <div className="bg-[#f0f7f6] border-2 border-[#5eb3a1] rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#427d78] shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[#427d78] font-['Bitter',serif] text-base font-semibold">
              Your progress is automatically saved
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to clear all saved form data? This cannot be undone.')) {
                localStorage.removeItem('volunteerFormData')
                window.location.reload()
              }
            }}
            className="text-gray-600 hover:text-gray-800 text-sm font-['Jost',sans-serif] font-medium underline transition-colors duration-200"
          >
            Clear Saved Data
          </button>
        </div>
      )}

      {!submitSuccess && <ProgressIndicator />}
      
      {!submitSuccess && renderUtilityButtons()}
      
      <div style={{ minHeight: '400px' }}>
        {submitSuccess ? (
          <div className="text-center py-12 px-4">
            <div className="mb-8">
              <svg className="w-28 h-28 mx-auto text-[#427d78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-['Jost',sans-serif] font-bold text-4xl md:text-5xl text-gray-900 mb-6">
              Submission Received!
            </h1>
            <p className="font-['Bitter',serif] text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Thank you for your volunteer application. We have received your information and will be in contact with you soon.
            </p>
            <div className="bg-[#f0f7f6] border-2 border-[#427d78] rounded-lg p-8 max-w-2xl mx-auto mb-10">
              <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-2xl mb-5">
                What Happens Next?
              </h2>
              <ul className="font-['Bitter',serif] text-gray-700 text-left space-y-4 text-lg">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#427d78] mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Our volunteer coordinator will review your application</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#427d78] mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You will receive a confirmation email within 2-3 business days</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#427d78] mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>We may contact you to schedule an orientation session</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#427d78] mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Questions? Call us at <strong>(707) 462-4343</strong></span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-xl px-10 py-4 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
            {currentStep === 7 && renderStep7()}
          </>
        )}
      </div>

      {renderNavigationButtons()}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
              <h2 className="font-['Jost',sans-serif] font-bold text-2xl text-gray-900">
                Review All Entries
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Personal Information
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif] space-y-1">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Address:</strong> {formData.address} {formData.apt && `${formData.apt}, `}{formData.city}, CA {formData.zip}</div>
                  <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
                </div>
              </div>

              {/* Demographics */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Demographics
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif] space-y-1">
                  <div><strong>Physical Limitations:</strong> {formData.physicalLimitations === 'yes' ? 'Yes' : 'No'}</div>
                  {formData.physicalLimitationsDetails && <div className="ml-4 text-gray-600">Details: {formData.physicalLimitationsDetails}</div>}
                  <div><strong>Ethnicity:</strong> {formData.ethnicity.join(', ') || 'Not specified'}</div>
                  <div><strong>Sex:</strong> {formData.sex}</div>
                  <div><strong>Pronouns:</strong> {formData.pronouns}</div>
                  <div><strong>Military Status:</strong> {formData.militaryStatus}</div>
                  <div><strong>Shirt Size:</strong> {formData.shirtSize}</div>
                </div>
              </div>

              {/* Referral Source */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Referral Source
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif]">
                  <strong>How did you hear about us?</strong> {formData.referralSource.join(', ') || 'Not specified'}
                  {formData.referralAgencyStaff && <div className="ml-4">Agency: {formData.referralAgencyStaff}</div>}
                  {formData.referralFriend && <div className="ml-4">Friend: {formData.referralFriend}</div>}
                  {formData.referralNewspaper && <div className="ml-4">Newspaper: {formData.referralNewspaper}</div>}
                  {formData.referralBrochure && <div className="ml-4">Brochure: {formData.referralBrochure}</div>}
                </div>
              </div>

              {/* Skills and Interests */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Skills and Interests
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(4)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif]">
                  <strong>Selected skills:</strong>{' '}
                  {[
                    formData.skillOfficeAssistant && 'Office Assistant',
                    formData.skillReceptionist && 'Receptionist',
                    formData.skillComputer && 'Computer Support',
                    formData.skillAccounting && 'Accounting',
                    formData.skillFriendlyVisits && 'Friendly Visits',
                    formData.skillTransportation && 'Transportation',
                    formData.skillShopping && 'Shopping',
                    formData.skillSeniorMeal && 'Senior Meals',
                    formData.skillRecreation && 'Recreation',
                    formData.skillInstructor && 'Instructor',
                    formData.skillGiftShop && 'Gift Shop',
                    formData.skillFoodBank && 'Food Bank',
                    formData.skillMaintenance && 'Maintenance',
                    formData.skillPublicRelations && 'Public Relations',
                    formData.skillOther && `Other: ${formData.skillOtherDetails}`,
                  ].filter(Boolean).join(', ') || 'None selected'}
                  {formData.languagesSpoken && (
                    <div className="mt-2"><strong>Languages:</strong> {formData.languagesSpoken}</div>
                  )}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Emergency Contacts
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(5)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif] space-y-3">
                  <div>
                    <strong>Beneficiary:</strong> {formData.beneficiaryFirstName} {formData.beneficiaryLastName} ({formData.beneficiaryRelationship})
                    <div className="ml-4 text-gray-600">Phone: {formData.beneficiaryPhone}</div>
                  </div>
                  <div>
                    <strong>Emergency Contact:</strong> {formData.emergencyFirstName} {formData.emergencyLastName} ({formData.emergencyRelationship})
                    <div className="ml-4 text-gray-600">Phone: {formData.emergencyPhone}</div>
                  </div>
                </div>
              </div>

              {/* Legal Declarations */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-4">
                <h4 className="font-['Jost',sans-serif] font-semibold text-gray-900 mb-3 flex items-center justify-between" style={{ fontSize: '1.1rem' }}>
                  Legal Declarations
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(6)
                      setShowReviewModal(false)
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] text-sm font-normal underline"
                  >
                    Edit
                  </button>
                </h4>
                <div className="text-sm font-['Bitter',serif] space-y-2">
                  {formData.insuranceConsentSignature && (
                    <div>✓ Insurance & Liability Consent signed: {formData.insuranceConsentSignature} on {formData.insuranceConsentDate}</div>
                  )}
                  {formData.mediaReleaseInitials && (
                    <div>✓ Media Release authorized: {formData.mediaReleaseInitials} on {formData.mediaReleaseDate}</div>
                  )}
                  {formData.truthfulnessSignature && (
                    <div>✓ Truthfulness Declaration signed: {formData.truthfulnessSignature} on {formData.truthfulnessDate}</div>
                  )}
                  {formData.willingToDrive && (
                    <div>✓ Willing to drive - License #: {formData.driverDeclarationSignature}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold px-6 py-3 transition-all duration-300"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
