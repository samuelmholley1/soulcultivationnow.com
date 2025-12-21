# Soul Cultivation Now

A Next.js-powered spiritual growth platform offering guided pathways for personal transformation through healing, spiritual awakening, ancestral wisdom, and holistic health.

## Features

- **Dagara Element Quiz**: Interactive birth year calculator for discovering your Dagara element
- **Pathway Cards**: Choose-your-own-adventure style guided spiritual journeys
- **Modern Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Airtable Integration**: Ready for data collection and CRM workflows

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

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── quiz/        # Dagara element quiz
│   └── page.tsx     # Homepage with pathway cards
├── components/      # Reusable React components
├── lib/            # Utilities and helpers
│   ├── airtable.ts # Airtable API integration
│   └── dagara.ts   # Dagara element calculation
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
