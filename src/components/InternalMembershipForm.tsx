'use client'

import { useState } from 'react'

// Type definitions
interface MembershipFormData {
  // Membership type
  membershipStatus: 'new' | 'renewal' | ''
  membershipTier: 'single' | 'dual' | ''
  
  // Member 1 (always required)
  member1FirstName: string
  member1LastName: string
  member1Birthdate: string
  
  // Member 2 (only for dual)
  member2FirstName: string
  member2LastName: string
  member2Birthdate: string
  
  // Contact information
  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string
  phone1Type: 'cell' | 'home' | ''
  phone1Number: string
  phone2Type: 'cell' | 'home' | ''
  phone2Number: string
  email: string
  
  // Preferences
  newsletterPreference: 'mail' | 'email' | ''
  
  // Areas of interest (all optional checkboxes)
  interestActivities: boolean
  interestLunch: boolean
  interestLunchBunch: boolean
  interestTransportation: boolean
  interestOutreach: boolean
  interestVolunteering: boolean
  
  // Payment info (staff entry)
  paymentMethod: 'check' | 'cash' | 'credit_card' | 'over_90_no_dues' | ''
  paymentReference: string
  paymentAmount: string
  enteredByStaff: string
}

interface FormStep {
  id: number
  title: string
  description: string
}

const FORM_STEPS: FormStep[] = [
  { id: 1, title: 'Membership Type', description: 'New or renewal, single or dual' },
  { id: 2, title: 'Personal Information', description: 'Member name(s) and birthdate(s)' },
  { id: 3, title: 'Contact Information', description: 'Address, phone, and email' },
  { id: 4, title: 'Preferences', description: 'Newsletter and areas of interest' },
  { id: 5, title: 'Payment Details', description: 'Payment method and staff information' },
  { id: 6, title: 'Review & Submit', description: 'Confirm all information' },
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
}) => (
  <div style={{ marginBottom: 'var(--space-3)' }}>
    <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-1" style={{ fontSize: '1rem' }}>
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
      style={{ padding: '12px 16px', fontSize: '1rem' }}
      required={required}
    />
    <ErrorMessage message={error} />
  </div>
)

export default function InternalMembershipForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<MembershipFormData>({
    membershipStatus: '',
    membershipTier: '',
    member1FirstName: '',
    member1LastName: '',
    member1Birthdate: '',
    member2FirstName: '',
    member2LastName: '',
    member2Birthdate: '',
    addressStreet: '',
    addressCity: 'Ukiah',
    addressState: 'CA',
    addressZip: '',
    phone1Type: '',
    phone1Number: '',
    phone2Type: '',
    phone2Number: '',
    email: '',
    newsletterPreference: '',
    interestActivities: false,
    interestLunch: false,
    interestLunchBunch: false,
    interestTransportation: false,
    interestOutreach: false,
    interestVolunteering: false,
    paymentMethod: '',
    paymentReference: '',
    paymentAmount: '',
    enteredByStaff: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof MembershipFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Update form field
  const updateField = (field: keyof MembershipFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Auto-populate payment amount based on tier
  const handleTierChange = (tier: 'single' | 'dual') => {
    updateField('membershipTier', tier)
    updateField('paymentAmount', tier === 'single' ? '40' : '65')
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof MembershipFormData, string>> = {}

    switch (step) {
      case 1:
        if (!formData.membershipStatus) newErrors.membershipStatus = 'Please select membership status'
        if (!formData.membershipTier) newErrors.membershipTier = 'Please select membership tier'
        break

      case 2:
        if (!formData.member1FirstName.trim()) newErrors.member1FirstName = 'Member 1 first name is required'
        if (!formData.member1LastName.trim()) newErrors.member1LastName = 'Member 1 last name is required'
        if (!formData.member1Birthdate) newErrors.member1Birthdate = 'Member 1 birthdate is required'
        
        if (formData.membershipTier === 'dual') {
          if (!formData.member2FirstName.trim()) newErrors.member2FirstName = 'Member 2 first name is required for dual membership'
          if (!formData.member2LastName.trim()) newErrors.member2LastName = 'Member 2 last name is required for dual membership'
          if (!formData.member2Birthdate) newErrors.member2Birthdate = 'Member 2 birthdate is required for dual membership'
        }
        break

      case 3:
        if (!formData.addressStreet.trim()) newErrors.addressStreet = 'Street address is required'
        if (!formData.addressCity.trim()) newErrors.addressCity = 'City is required'
        if (!formData.addressState.trim()) newErrors.addressState = 'State is required'
        if (!formData.addressZip.match(/^[0-9]{5}$/)) newErrors.addressZip = 'Valid 5-digit ZIP code is required'
        if (!formData.phone1Type) newErrors.phone1Type = 'Phone type is required'
        if (!formData.phone1Number.trim()) newErrors.phone1Number = 'Phone number is required'
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email address is required'
        break

      case 4:
        if (!formData.newsletterPreference) newErrors.newsletterPreference = 'Please select newsletter preference'
        break

      case 5:
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required'
        // Only require payment amount if not "over 90 no dues"
        if (formData.paymentMethod !== 'over_90_no_dues' && (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0)) {
          newErrors.paymentAmount = 'Payment amount is required'
        }
        if (!formData.enteredByStaff.trim()) newErrors.enteredByStaff = 'Staff member name is required'
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
    if (!validateStep(5)) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit membership application')
      }
      
      console.log('Form submitted successfully:', result)
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
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div className="flex justify-between items-center mb-2 gap-1">
        {FORM_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div
              className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-['Jost',sans-serif] font-bold text-sm md:text-base shrink-0 ${
                currentStep >= step.id
                  ? 'bg-[#427d78] text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.id}
            </div>
            {index < FORM_STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 md:mx-2 ${
                  currentStep > step.id ? 'bg-[#427d78]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-xl md:text-2xl" style={{ marginBottom: 'var(--space-1)' }}>
          {FORM_STEPS[currentStep - 1].title}
        </h2>
        <p className="font-['Bitter',serif] text-gray-600 text-sm md:text-base">
          {FORM_STEPS[currentStep - 1].description}
        </p>
      </div>
    </div>
  )

  // Render Step 1: Membership Type
  const renderStep1 = () => (
    <div>
      {/* Membership Status */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Membership Status <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['new', 'renewal'] as const).map((status) => (
            <label
              key={status}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.membershipStatus === status
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="radio"
                name="membershipStatus"
                value={status}
                checked={formData.membershipStatus === status}
                onChange={(e) => updateField('membershipStatus', e.target.value)}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] shrink-0"
              />
              <span className="ml-3 font-['Jost',sans-serif] font-semibold text-gray-900 capitalize flex-1" style={{ fontSize: '1rem' }}>
                {status} Membership
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.membershipStatus} />
      </div>

      {/* Membership Tier */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Membership Tier <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'single' as const, label: 'Single Membership', price: '$40', subtitle: '1 person/year' },
            { value: 'dual' as const, label: 'Dual Membership', price: '$65', subtitle: '2 people/year' },
          ].map((tier) => (
            <label
              key={tier.value}
              className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.membershipTier === tier.value
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="membershipTier"
                  value={tier.value}
                  checked={formData.membershipTier === tier.value}
                  onChange={() => handleTierChange(tier.value)}
                  className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] shrink-0"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-['Jost',sans-serif] font-bold text-gray-900" style={{ fontSize: '1.125rem' }}>
                      {tier.label}
                    </span>
                    <span className="font-['Jost',sans-serif] font-bold text-[#427d78] shrink-0 ml-2" style={{ fontSize: '1.5rem' }}>
                      {tier.price}
                    </span>
                  </div>
                  <p className="font-['Bitter',serif] text-gray-600 text-sm mt-1">
                    {tier.subtitle}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.membershipTier} />
      </div>
    </div>
  )

  // Render Step 2: Personal Information
  const renderStep2 = () => (
    <div>
      {/* Member 1 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
        <h3 className="font-['Jost',sans-serif] font-bold text-gray-900 mb-3" style={{ fontSize: '1.125rem' }}>
          Member 1 Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={formData.member1FirstName}
            onChange={(value) => updateField('member1FirstName', value)}
            error={errors.member1FirstName}
            required
            placeholder="Jane"
          />
          <InputField
            label="Last Name"
            value={formData.member1LastName}
            onChange={(value) => updateField('member1LastName', value)}
            error={errors.member1LastName}
            required
            placeholder="Doe"
          />
        </div>
        <InputField
          label="Birth Date"
          type="date"
          value={formData.member1Birthdate}
          onChange={(value) => updateField('member1Birthdate', value)}
          error={errors.member1Birthdate}
          required
        />
      </div>

      {/* Member 2 (only for dual) */}
      {formData.membershipTier === 'dual' && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-['Jost',sans-serif] font-bold text-gray-900 mb-3" style={{ fontSize: '1.125rem' }}>
            Member 2 Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              value={formData.member2FirstName}
              onChange={(value) => updateField('member2FirstName', value)}
              error={errors.member2FirstName}
              required
              placeholder="John"
            />
            <InputField
              label="Last Name"
              value={formData.member2LastName}
              onChange={(value) => updateField('member2LastName', value)}
              error={errors.member2LastName}
              required
              placeholder="Doe"
            />
          </div>
          <InputField
            label="Birth Date"
            type="date"
            value={formData.member2Birthdate}
            onChange={(value) => updateField('member2Birthdate', value)}
            error={errors.member2Birthdate}
            required
          />
        </div>
      )}
    </div>
  )

  // Render Step 3: Contact Information
  const renderStep3 = () => (
    <div>
      <InputField
        label="Street Address"
        value={formData.addressStreet}
        onChange={(value) => updateField('addressStreet', value)}
        error={errors.addressStreet}
        required
        placeholder="123 Main Street"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="City"
          value={formData.addressCity}
          onChange={(value) => updateField('addressCity', value)}
          error={errors.addressCity}
          required
          placeholder="Ukiah"
        />
        <InputField
          label="State"
          value={formData.addressState}
          onChange={(value) => updateField('addressState', value)}
          error={errors.addressState}
          required
          placeholder="CA"
        />
      </div>
      <InputField
        label="ZIP Code"
        value={formData.addressZip}
        onChange={(value) => updateField('addressZip', value)}
        error={errors.addressZip}
        required
        placeholder="95482"
      />
      
      {/* Phone Number 1 (Required) */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1rem' }}>
          Phone Number 1 <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-['Jost',sans-serif] text-gray-700 mb-1" style={{ fontSize: '0.875rem' }}>
              Type <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phone1Type"
                  value="cell"
                  checked={formData.phone1Type === 'cell'}
                  onChange={(e) => updateField('phone1Type', e.target.value)}
                  className="mr-2"
                />
                <span className="font-['Bitter',serif]">Cell</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phone1Type"
                  value="home"
                  checked={formData.phone1Type === 'home'}
                  onChange={(e) => updateField('phone1Type', e.target.value)}
                  className="mr-2"
                />
                <span className="font-['Bitter',serif]">Home</span>
              </label>
            </div>
            <ErrorMessage message={errors.phone1Type} />
          </div>
          <div>
            <label className="block font-['Jost',sans-serif] text-gray-700 mb-1" style={{ fontSize: '0.875rem' }}>
              Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone1Number}
              onChange={(e) => updateField('phone1Number', e.target.value)}
              placeholder="(707) 555-1234"
              className={`w-full border-2 rounded-lg font-['Bitter',serif] ${
                errors.phone1Number ? 'border-red-500' : 'border-gray-300'
              } focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
              style={{ padding: '12px 16px', fontSize: '1rem' }}
              required
            />
            <ErrorMessage message={errors.phone1Number} />
          </div>
        </div>
      </div>

      {/* Phone Number 2 (Optional) */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1rem' }}>
          Phone Number 2 (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-['Jost',sans-serif] text-gray-700 mb-1" style={{ fontSize: '0.875rem' }}>
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phone2Type"
                  value="cell"
                  checked={formData.phone2Type === 'cell'}
                  onChange={(e) => updateField('phone2Type', e.target.value)}
                  className="mr-2"
                />
                <span className="font-['Bitter',serif]">Cell</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phone2Type"
                  value="home"
                  checked={formData.phone2Type === 'home'}
                  onChange={(e) => updateField('phone2Type', e.target.value)}
                  className="mr-2"
                />
                <span className="font-['Bitter',serif]">Home</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block font-['Jost',sans-serif] text-gray-700 mb-1" style={{ fontSize: '0.875rem' }}>
              Number
            </label>
            <input
              type="tel"
              value={formData.phone2Number}
              onChange={(e) => updateField('phone2Number', e.target.value)}
              placeholder="(707) 555-5678"
              className={`w-full border-2 rounded-lg font-['Bitter',serif] border-gray-300 focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20`}
              style={{ padding: '12px 16px', fontSize: '1rem' }}
            />
          </div>
        </div>
      </div>

      <InputField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
        error={errors.email}
        required
        placeholder="member@example.com"
      />
    </div>
  )

  // Render Step 4: Preferences
  const renderStep4 = () => (
    <div>
      {/* Newsletter Preference */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Newsletter Delivery Preference <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'email' as const, label: 'Email', icon: '📧', subtitle: 'Recommended - eco-friendly!' },
            { value: 'mail' as const, label: 'Mail', icon: '📬', subtitle: 'Physical newsletter' },
          ].map((pref) => (
            <label
              key={pref.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.newsletterPreference === pref.value
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="radio"
                name="newsletterPreference"
                value={pref.value}
                checked={formData.newsletterPreference === pref.value}
                onChange={(e) => updateField('newsletterPreference', e.target.value)}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] shrink-0"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-2xl mr-2">{pref.icon}</span>
                  <span className="font-['Jost',sans-serif] font-semibold text-gray-900" style={{ fontSize: '1rem' }}>
                    {pref.label}
                  </span>
                </div>
                <p className="font-['Bitter',serif] text-gray-600 text-sm">
                  {pref.subtitle}
                </p>
              </div>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.newsletterPreference} />
      </div>

      {/* Areas of Interest */}
      <div>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Areas of Interest <span className="text-gray-600 font-normal text-sm">(Select all that apply)</span>
        </label>
        <p className="font-['Bitter',serif] text-gray-600 text-sm mb-3">
          Help us provide you with relevant information about programs and services.
        </p>
        <div className="space-y-3">
          {[
            {
              field: 'interestActivities' as const,
              label: 'Activities',
              description: 'Bingo, Bunko, Dances, Exercise classes, Crafts, Card groups, Movie Matinee',
            },
            {
              field: 'interestLunch' as const,
              label: 'Daily Lunch Program',
              description: 'Meal in Bartlett Hall at 11:30 a.m.',
            },
            {
              field: 'interestLunchBunch' as const,
              label: 'Lunch Bunch',
              description: 'Program for seniors with impairments / caregiver respite',
            },
            {
              field: 'interestTransportation' as const,
              label: 'Transportation Services',
              description: 'Local bus transportation with wheelchair accessibility',
            },
            {
              field: 'interestOutreach' as const,
              label: 'Outreach Services',
              description: 'Money management, information & referral, CalFRESH, caregiver support',
            },
            {
              field: 'interestVolunteering' as const,
              label: 'Volunteering',
              description: 'Opportunities in Thrift Store, Dining Room, Kitchen, Special Events',
            },
          ].map((interest) => (
            <label
              key={interest.field}
              className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-[#427d78] cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                checked={formData[interest.field] as boolean}
                onChange={(e) => updateField(interest.field, e.target.checked)}
                className="w-5 h-5 text-[#427d78] focus:ring-[#427d78] rounded mt-1 shrink-0"
              />
              <div className="ml-3 flex-1">
                <span className="font-['Jost',sans-serif] font-semibold text-gray-900 block" style={{ fontSize: '1rem' }}>
                  {interest.label}
                </span>
                <p className="font-['Bitter',serif] text-gray-600 text-sm mt-0.5">
                  {interest.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  // Render Step 5: Payment Details
  const renderStep5 = () => (
    <div>
      {/* Payment Method */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>
          Payment Method <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'check' as const, label: 'Check', icon: '✅' },
            { value: 'cash' as const, label: 'Cash', icon: '💵' },
            { value: 'over_90_no_dues' as const, label: 'Over 90 - No Dues Required', icon: '🎂' },
          ].map((method) => (
            <label
              key={method.value}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === method.value
                  ? 'border-[#427d78] bg-[#427d78] bg-opacity-5'
                  : 'border-gray-300 hover:border-[#427d78]'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={formData.paymentMethod === method.value}
                onChange={(e) => updateField('paymentMethod', e.target.value)}
                className="sr-only"
              />
              <span className="text-3xl mb-2">{method.icon}</span>
              <span className="font-['Jost',sans-serif] font-semibold text-gray-900 text-center" style={{ fontSize: '1rem' }}>
                {method.label}
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.paymentMethod} />
        
        {/* Credit Card Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-3 mt-3">
          <p className="font-['Bitter',serif] text-blue-900 text-sm">
            <strong>Note:</strong> If member paid by credit card, please direct them to complete the form at{' '}
            <a 
              href="https://memberships.ukiahseniorcenter.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-700 font-semibold"
            >
              memberships.ukiahseniorcenter.org
            </a>
            {' '}instead of using this internal form.
          </p>
        </div>
      </div>

      {/* Payment Reference */}
      {formData.paymentMethod === 'check' && (
        <InputField
          label="Check Number"
          value={formData.paymentReference}
          onChange={(value) => updateField('paymentReference', value)}
          error={errors.paymentReference}
          placeholder="1234"
        />
      )}

      {/* Payment Amount */}
      <InputField
        label={formData.paymentMethod === 'over_90_no_dues' ? 'Payment Amount (Optional)' : 'Payment Amount'}
        type="number"
        value={formData.paymentAmount}
        onChange={(value) => updateField('paymentAmount', value)}
        error={errors.paymentAmount}
        required={formData.paymentMethod !== 'over_90_no_dues'}
        placeholder={formData.paymentMethod === 'over_90_no_dues' ? '0.00' : '40.00'}
      />

      {/* Staff Member Name */}
      <InputField
        label="Staff Member Name"
        value={formData.enteredByStaff}
        onChange={(value) => updateField('enteredByStaff', value)}
        error={errors.enteredByStaff}
        required
        placeholder="Your name"
      />

      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mt-4">
        <p className="font-['Bitter',serif] text-blue-900 text-sm">
          <strong>Note:</strong> Your name and today&apos;s date will be recorded with this submission for record-keeping purposes.
        </p>
      </div>
    </div>
  )

  // Render Step 6: Review & Submit
  const renderStep6 = () => {
    if (submitSuccess) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-2xl mb-3">
            Membership Application Submitted!
          </h3>
          <p className="font-['Bitter',serif] text-gray-700 text-lg mb-4">
            The membership application has been successfully recorded.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
            <p className="font-['Bitter',serif] text-gray-700 text-sm">
              <strong>Next Steps:</strong>
            </p>
            <ul className="font-['Bitter',serif] text-gray-700 text-sm list-disc ml-5 mt-2 space-y-1">
              <li>Record entry in office log</li>
              <li>Prepare welcome letter for mailing</li>
              <li>Issue membership card when ready</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setFormData({
                membershipStatus: '',
                membershipTier: '',
                member1FirstName: '',
                member1LastName: '',
                member1Birthdate: '',
                member2FirstName: '',
                member2LastName: '',
                member2Birthdate: '',
                addressStreet: '',
                addressCity: 'Ukiah',
                addressState: 'CA',
                addressZip: '',
                phone1Type: '',
                phone1Number: '',
                phone2Type: '',
                phone2Number: '',
                email: '',
                newsletterPreference: '',
                interestActivities: false,
                interestLunch: false,
                interestLunchBunch: false,
                interestTransportation: false,
                interestOutreach: false,
                interestVolunteering: false,
                paymentMethod: '',
                paymentReference: '',
                paymentAmount: '',
                enteredByStaff: '',
              })
              setCurrentStep(1)
              setSubmitSuccess(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-8 py-3 transition-all duration-300"
          >
            Enter Another Membership
          </button>
        </div>
      )
    }

    return (
      <div>
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
          <p className="font-['Bitter',serif] text-yellow-900 text-sm">
            <strong>⚠️ Please review all information carefully before submitting.</strong> Make sure all details match the paper application.
          </p>
        </div>

        {/* Summary sections */}
        <div className="space-y-4">
          {/* Membership Type */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-['Jost',sans-serif] font-bold text-gray-900">Membership Type</h4>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#427d78] hover:underline text-sm font-['Jost',sans-serif] font-semibold shrink-0 ml-3"
              >
                Edit
              </button>
            </div>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Status:</strong> {formData.membershipStatus === 'new' ? 'New' : 'Renewal'} Membership
            </p>
            <p className="font-['Bitter',serif] text-gray-700 mb-0">
              <strong>Tier:</strong> {formData.membershipTier === 'single' ? 'Single ($40)' : 'Dual ($65)'}
            </p>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-['Jost',sans-serif] font-bold text-gray-900">Personal Information</h4>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-[#427d78] hover:underline text-sm font-['Jost',sans-serif] font-semibold shrink-0 ml-3"
              >
                Edit
              </button>
            </div>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Member 1:</strong> {formData.member1FirstName} {formData.member1LastName} (DOB: {formData.member1Birthdate})
            </p>
            {formData.membershipTier === 'dual' && formData.member2FirstName && (
              <p className="font-['Bitter',serif] text-gray-700 mb-0">
                <strong>Member 2:</strong> {formData.member2FirstName} {formData.member2LastName} (DOB: {formData.member2Birthdate})
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-['Jost',sans-serif] font-bold text-gray-900">Contact Information</h4>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-[#427d78] hover:underline text-sm font-['Jost',sans-serif] font-semibold shrink-0 ml-3"
              >
                Edit
              </button>
            </div>
            <p className="font-['Bitter',serif] text-gray-700 mb-2">
              {formData.addressStreet}<br />
              {formData.addressCity}, {formData.addressState} {formData.addressZip}
            </p>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Phone 1 ({formData.phone1Type === 'cell' ? 'Cell' : 'Home'}):</strong> {formData.phone1Number}
              {formData.phone2Number && <><br /><strong>Phone 2 ({formData.phone2Type === 'cell' ? 'Cell' : 'Home'}):</strong> {formData.phone2Number}</>}
            </p>
            <p className="font-['Bitter',serif] text-gray-700 mb-0">
              <strong>Email:</strong> {formData.email}
            </p>
          </div>

          {/* Preferences */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-['Jost',sans-serif] font-bold text-gray-900">Preferences</h4>
              <button
                onClick={() => setCurrentStep(4)}
                className="text-[#427d78] hover:underline text-sm font-['Jost',sans-serif] font-semibold shrink-0 ml-3"
              >
                Edit
              </button>
            </div>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Newsletter:</strong> {formData.newsletterPreference === 'email' ? 'Email' : 'Mail'}
            </p>
            {(formData.interestActivities || formData.interestLunch || formData.interestLunchBunch || 
              formData.interestTransportation || formData.interestOutreach || formData.interestVolunteering) && (
              <>
                <p className="font-['Bitter',serif] text-gray-700 mt-3 mb-1"><strong>Interested in:</strong></p>
                <ul className="font-['Bitter',serif] text-gray-700 list-disc ml-5 space-y-0.5">
                  {formData.interestActivities && <li>Activities</li>}
                  {formData.interestLunch && <li>Daily Lunch Program</li>}
                  {formData.interestLunchBunch && <li>Lunch Bunch</li>}
                  {formData.interestTransportation && <li>Transportation Services</li>}
                  {formData.interestOutreach && <li>Outreach Services</li>}
                  {formData.interestVolunteering && <li>Volunteering</li>}
                </ul>
              </>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-['Jost',sans-serif] font-bold text-gray-900">Payment Details</h4>
              <button
                onClick={() => setCurrentStep(5)}
                className="text-[#427d78] hover:underline text-sm font-['Jost',sans-serif] font-semibold shrink-0 ml-3"
              >
                Edit
              </button>
            </div>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Method:</strong> {
                formData.paymentMethod === 'check' ? 'Check' :
                formData.paymentMethod === 'cash' ? 'Cash' : 'N/A'
              }
              {formData.paymentReference && ` (${formData.paymentReference})`}
            </p>
            <p className="font-['Bitter',serif] text-gray-700 mb-1">
              <strong>Amount:</strong> ${formData.paymentAmount}
            </p>
            <p className="font-['Bitter',serif] text-gray-700 mb-0">
              <strong>Entered by:</strong> {formData.enteredByStaff}
            </p>
          </div>
        </div>
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

        {currentStep < FORM_STEPS.length - 1 ? (
          <button
            onClick={goToNextStep}
            className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-6 py-3 transition-all duration-300 ml-auto"
          >
            Next →
          </button>
        ) : currentStep === FORM_STEPS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-base px-8 py-3 transition-all duration-300 ml-auto ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        ) : null}
      </div>
    )
  }

  // Main render
  return (
    <div>
      <ProgressIndicator />
      
      <div style={{ minHeight: '400px' }}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </div>

      {renderNavigationButtons()}
    </div>
  )
}
