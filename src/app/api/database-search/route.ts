import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = 'appZ6HE5luAFV0Ot2'

const TABLE_IDS = {
  members: 'tblkyPNkAqzo5IEq7',
  volunteers: 'tblBfH8TqiQzSQjsV',
}

export async function POST(request: NextRequest) {
  try {
    const { database, query } = await request.json()

    if (!database || !query) {
      return NextResponse.json(
        { error: 'Database and query are required' },
        { status: 400 }
      )
    }

    if (!TABLE_IDS[database as keyof typeof TABLE_IDS]) {
      return NextResponse.json(
        { error: 'Invalid database selection' },
        { status: 400 }
      )
    }

    const tableId = TABLE_IDS[database as keyof typeof TABLE_IDS]
    
    // Clean the query - remove all non-digit characters for phone search
    const phoneDigits = query.replace(/\D/g, '')
    
    // Build filter formula - search by name (first/last) or phone
    // Search in First Name, Last Name, Email, or Phone fields
    let filterFormula = ''
    
    if (phoneDigits.length >= 3) {
      // If query contains digits, search phone numbers
      filterFormula = `OR(
        FIND("${phoneDigits}", SUBSTITUTE(SUBSTITUTE(SUBSTITUTE({Phone}, "-", ""), "(", ""), ")", "")) > 0,
        FIND(LOWER("${query}"), LOWER({First Name})) > 0,
        FIND(LOWER("${query}"), LOWER({Last Name})) > 0,
        FIND(LOWER("${query}"), LOWER({Email})) > 0
      )`
    } else {
      // Text-only search in name and email
      filterFormula = `OR(
        FIND(LOWER("${query}"), LOWER({First Name})) > 0,
        FIND(LOWER("${query}"), LOWER({Last Name})) > 0,
        FIND(LOWER("${query}"), LOWER({Email})) > 0
      )`
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?filterByFormula=${encodeURIComponent(filterFormula)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Airtable API error:', errorData)
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      records: data.records || [],
    })
  } catch (error) {
    console.error('Database search error:', error)
    return NextResponse.json(
      { error: 'Failed to search database' },
      { status: 500 }
    )
  }
}
