# Soul Cultivation Now

A Next.js-powered spiritual growth platform offering guided pathways for personal transformation through healing, spiritual awakening, ancestral wisdom, and holistic health.

## Features

- **Medicine Wheel Calculator**: Interactive numerology-based quiz calculating your Dagara element profile from name and birthdate
- **Pathway Cards**: Three spiritual pathways (Material, Bridge, Soul) with same-page card selection pattern
- **Contact Form**: Global header CTA for lead capture with motivation field
- **Airtable CRM**: Automated lead collection with 2 tables (Medicine Wheel submissions + Contact form)
- **Modern Stack**: Next.js 15.0.5, React 18.3.1, TypeScript 5.5.4, Tailwind CSS 3.4.7

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn 4.0.2 (included via packageManager)

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
yarn build
yarn start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
AIRTABLE_ACCESS_TOKEN=your_personal_access_token
AIRTABLE_BASE_ID=appnf33rbeqzbMMex
AIRTABLE_TABLE_MEDICINE_WHEEL=tblgpw1VHNgR9RBhs
AIRTABLE_TABLE_CONTACT=tblnxV1FeMexChbIs
```

See [AIRTABLE_SCHEMA.md](./AIRTABLE_SCHEMA.md) for detailed schema documentation.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── medicine-wheel/route.ts  # Medicine Wheel submission endpoint
│   │   └── contact/route.ts          # Contact form endpoint
│   ├── quiz/page.tsx                 # Medicine Wheel calculator page
│   ├── layout.tsx                    # Root layout with navigation
│   ├── globals.css                   # Global styles
│   └── page.tsx                      # Homepage with pathway cards
├── components/
│   ├── ContactModal.tsx              # Contact form modal
│   ├── MedicineWheel.tsx             # SVG wheel visualization
│   ├── InfluenceTable.tsx            # Energy balance table
│   ├── SiteNavigation.tsx            # Global header
│   ├── Modal.tsx                     # Base modal component
│   └── Button.tsx                    # Reusable button
├── lib/
│   ├── airtable.ts                   # Airtable API integration
│   ├── medicineWheel.ts              # Numerology calculations
│   └── dagara.ts                     # Legacy Dagara utilities
└── styles/         # Global styles (unused, using globals.css)
```

## Environment Variables

Create a `.env.local` file for Airtable integration:

```env
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
```

## Design System

- **Primary Color**: Teal (#427d78)
- **Accent Colors**: 
  - Lavender (#967BB6) - Spiritual
  - Ocean Blue (#4682B4) - Secondary
  - Forest Green (#2E8B57) - Grounding
  - Sunrise Gold (#FFD700) - Manifestation
- **Typography**: 
  - Headings: Jost (sans-serif)
  - Body: Bitter (serif)
  - Accent: Montserrat

## Tech Stack

- **Framework**: Next.js 15.0.5
- **Runtime**: React 18.3.1
- **Language**: TypeScript 5.5.4
- **Styling**: Tailwind CSS 3.4.7
- **Testing**: Playwright 1.56.1
- **Email**: Nodemailer 7.0.10
- **Data**: Airtable 0.12.2

## License

Private - All rights reserved

## Author

Built for Soul Cultivation Now
