// Airtable API helper functions

const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_DAGARA = process.env.AIRTABLE_TABLE_DAGARA;

if (!AIRTABLE_ACCESS_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_DAGARA) {
  console.warn('Airtable environment variables are not set');
}

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_DAGARA}`;

interface AirtableRecord {
  fields: Record<string, unknown>;
}

// Medicine Wheel submission interface
export interface MedicineWheelSubmission {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  waterCount: number;
  natureCount: number;
  fireCount: number;
  mineralCount: number;
  earthCount: number;
  dominantElement: string;
  spiritBird: string;
  masculineEnergy: number;
  feminineEnergy: number;
}

export async function submitMedicineWheelData(data: MedicineWheelSubmission): Promise<{ id: string; fields: Record<string, unknown> }> {
  if (!AIRTABLE_ACCESS_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_DAGARA) {
    throw new Error('Airtable configuration is missing');
  }

  const response = await fetch(AIRTABLE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        Name: data.fullName,
        Email: data.email,
        FirstName: data.firstName,
        LastName: data.lastName,
        BirthDate: data.birthDate,
        WaterCount: data.waterCount,
        NatureCount: data.natureCount,
        FireCount: data.fireCount,
        MineralCount: data.mineralCount,
        EarthCount: data.earthCount,
        DominantElement: data.dominantElement,
        SpiritBird: data.spiritBird,
        MasculineEnergy: data.masculineEnergy,
        FeminineEnergy: data.feminineEnergy,
        SubmittedAt: new Date().toISOString(),
      },
      typecast: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Airtable API error:', errorData);
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }

  const result = await response.json();
  return result;
}

export async function createAirtableRecord(fields: Record<string, unknown>): Promise<{ id: string; fields: Record<string, unknown> }> {
  if (!AIRTABLE_ACCESS_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_DAGARA) {
    throw new Error('Airtable configuration is missing');
  }

  const response = await fetch(AIRTABLE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
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
  if (!AIRTABLE_ACCESS_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_DAGARA) {
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
      'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
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
