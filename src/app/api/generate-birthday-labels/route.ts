import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

interface AddressData {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

// Avery 5160 label dimensions (in inches, converted to points: 1 inch = 72 points)
const LABEL_CONFIG = {
  pageWidth: 8.5 * 72,        // 612 points
  pageHeight: 11 * 72,        // 792 points
  labelWidth: 2.625 * 72,     // 189 points
  labelHeight: 1 * 72,        // 72 points
  leftMargin: 0.1875 * 72,    // 13.5 points
  topMargin: 0.5 * 72,        // 36 points
  horizontalGap: 0.125 * 72,  // 9 points
  verticalGap: 0,             // 0 points
  columns: 3,
  rows: 10,
};

function parseExcelFile(): AddressData[] {
  const filePath = path.join(process.cwd(), 'data', '2025.12 Birthdays.xlsx');
  
  if (!fs.existsSync(filePath)) {
    throw new Error('Birthday data file not found');
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet) as any[];

  // Parse the data - adjust field names based on actual Excel headers
  const addresses: AddressData[] = data.map((row) => {
    // Try to identify common header variations
    const name = row['Name'] || row['name'] || row['Full Name'] || 
                 `${row['First Name'] || row['FirstName'] || ''} ${row['Last Name'] || row['LastName'] || ''}`.trim();
    
    const address1 = row['Address'] || row['address'] || row['Address 1'] || row['Street'] || '';
    const address2 = row['Address 2'] || row['Apt'] || row['Unit'] || '';
    const city = row['City'] || row['city'] || '';
    const state = row['State'] || row['state'] || 'CA'; // Default to CA
    const zip = String(row['Zip'] || row['ZIP'] || row['zip'] || row['Postal Code'] || '');

    return {
      name,
      address1,
      address2,
      city,
      state,
      zip,
    };
  }).filter(addr => addr.name && addr.address1); // Only include records with name and address

  return addresses;
}

function generateLabelsPDF(addresses: AddressData[]): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  let currentLabel = 0;

  addresses.forEach((address, index) => {
    const page = Math.floor(currentLabel / (LABEL_CONFIG.columns * LABEL_CONFIG.rows));
    const labelOnPage = currentLabel % (LABEL_CONFIG.columns * LABEL_CONFIG.rows);
    const col = labelOnPage % LABEL_CONFIG.columns;
    const row = Math.floor(labelOnPage / LABEL_CONFIG.columns);

    // Add new page if needed
    if (index > 0 && labelOnPage === 0) {
      doc.addPage();
    }

    // Calculate position
    const x = LABEL_CONFIG.leftMargin + 
              col * (LABEL_CONFIG.labelWidth + LABEL_CONFIG.horizontalGap);
    const y = LABEL_CONFIG.topMargin + 
              row * (LABEL_CONFIG.labelHeight + LABEL_CONFIG.verticalGap);

    // Set font
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Format address lines
    const lines: string[] = [];
    lines.push(address.name);
    lines.push(address.address1);
    if (address.address2) {
      lines.push(address.address2);
    }
    lines.push(`${address.city}, ${address.state} ${address.zip}`);

    // Center text vertically in label
    const lineHeight = 12;
    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (LABEL_CONFIG.labelHeight - totalTextHeight) / 2 + lineHeight;

    // Draw text with left margin
    const textLeftMargin = 8;
    lines.forEach((line, lineIndex) => {
      doc.text(line, x + textLeftMargin, startY + lineIndex * lineHeight);
    });

    currentLabel++;
  });

  return Buffer.from(doc.output('arraybuffer'));
}

export async function GET(request: NextRequest) {
  try {
    // Parse Excel file
    const addresses = parseExcelFile();

    if (addresses.length === 0) {
      return NextResponse.json(
        { error: 'No valid addresses found in the file' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = generateLabelsPDF(addresses);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="birthday-labels.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating birthday labels:', error);
    return NextResponse.json(
      { error: 'Failed to generate labels', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
