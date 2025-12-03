// Airtable API helper functions

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
  console.warn('Airtable environment variables are not set');
}

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

interface AirtableRecord {
  fields: Record<string, unknown>;
}

export async function createAirtableRecord(fields: Record<string, unknown>): Promise<{ id: string; fields: Record<string, unknown> }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    throw new Error('Airtable configuration is missing');
  }

  const response = await fetch(AIRTABLE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields,
      typecast: true, // Automatically convert types
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Airtable API error:', errorData);
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function listAirtableRecords(params?: {
  maxRecords?: number;
  filterByFormula?: string;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
}): Promise<AirtableRecord[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    throw new Error('Airtable configuration is missing');
  }

  const searchParams = new URLSearchParams();
  
  if (params?.maxRecords) {
    searchParams.append('maxRecords', params.maxRecords.toString());
  }
  
  if (params?.filterByFormula) {
    searchParams.append('filterByFormula', params.filterByFormula);
  }
  
  if (params?.sort) {
    params.sort.forEach((s, index) => {
      searchParams.append(`sort[${index}][field]`, s.field);
      searchParams.append(`sort[${index}][direction]`, s.direction);
    });
  }

  const url = `${AIRTABLE_API_URL}?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Airtable API error:', errorData);
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.records || [];
}
