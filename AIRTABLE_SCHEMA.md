# Airtable Schema Documentation

This document describes the Airtable base structure for soulcultivationnow.com. Use this as a reference for all API calls and integrations.

## Base Information

- **Base Name**: soulcultivationnow.com
- **Base ID**: `appnf33rbeqzbMMex`
- **Access Token**: Stored in `AIRTABLE_ACCESS_TOKEN` environment variable

### API Scopes & Permissions

The Personal Access Token has the following scopes:
- `data.records:read` - See the data in records
- `data.records:write` - Create, edit, and delete records
- `data.recordComments:read` - See comments in records
- `data.recordComments:write` - Create, edit, and delete record comments
- `schema.bases:read` - See the structure of a base (table names, field types)
- `schema.bases:write` - Edit the structure of a base (add/edit fields, tables)
- `webhook:manage` - View, create, delete webhooks
- `block:manage` - Create releases for custom extensions
- `user.email:read` - See the user's email address

## Tables

### 1. DagaraMedicineWheel

**Table ID**: `tblgpw1VHNgR9RBhs`

**Purpose**: Store user submissions from the Dagara Medicine Wheel calculator, including their name, contact info, birth data, and calculated elemental energies.

#### Fields

| Field Name | Field Type | Description | Required | Example |
|---|---|---|---|---|
| `Name` | Single Line Text | Full name (primary field) | Yes | "John Michael Smith" |
| `Email` | Email | User's email address | Yes | "john@example.com" |
| `FirstName` | Single Line Text | User's first name | Yes | "John" |
| `LastName` | Single Line Text | User's last name | Yes | "Smith" |
| `BirthDate` | Single Line Text | Birth date in MM/DD/YYYY format | Yes | "07/23/1985" |
| `WaterCount` | Number (Integer) | Count of Water element (1,6) | Yes | 5 |
| `NatureCount` | Number (Integer) | Count of Nature element (3,8) | Yes | 3 |
| `FireCount` | Number (Integer) | Count of Fire element (2,7) | Yes | 4 |
| `MineralCount` | Number (Integer) | Count of Mineral element (4,9) | Yes | 2 |
| `EarthCount` | Number (Integer) | Count of Earth element (0,5) | Yes | 6 |
| `DominantElement` | Single Line Text | The element with highest count | Yes | "Water" |
| `SpiritBird` | Single Line Text | Spirit bird based on dominant element | Yes | "Blue Heron" |
| `MasculineEnergy` | Number (Integer) | Total count of digits 0-4 | Yes | 8 |
| `FeminineEnergy` | Number (Integer) | Total count of digits 5-9 | Yes | 12 |
| `SubmittedAt` | Date Time | ISO timestamp of submission | Yes | "2026-01-03T14:30:00Z" |

#### Legacy Fields (ignore these)

**Note**: These fields were auto-created by Airtable's default template and are not used by the application. They can be manually deleted via the Airtable web UI if desired (field deletion is not supported via API as of January 2026).

- `Notes` (fld4YajUaTcQlURcB) - Multiline text field
- `Assignee` (fldSZjiAaLETRPvfq) - Single collaborator
- `Status` (fldw7rm20oDQlKUM8) - Single select (Todo/In progress/Done)
- `Attachments` (fldPIbNJsxwyaxBWd) - Multiple attachments
- `Attachment Summary` (fldvlKySbwFhowgP8) - AI-generated text

---

### 2. Contact

**Table ID**: `tblnxV1FeMexChbIs`

**Purpose**: Store contact form submissions from the website header modal.

#### Fields

| Field Name | Field Type | Description | Required | Example |
|---|---|---|---|---|
| `FirstName` | Single Line Text | Contact's first name (primary field) | Yes | "John" |
| `LastName` | Single Line Text | Contact's last name | Yes | "Smith" |
| `Email` | Email | Contact's email address | Yes | "john@example.com" |
| `Phone` | Phone Number | Contact's phone number | No | "+1 (555) 123-4567" |
| `Motivation` | Multiline Text | Why they want to work with Scott | Yes | "I'm seeking guidance on..." |
| `SubmittedAt` | Date Time | ISO timestamp of submission | Yes | "2026-01-03T16:45:00Z" |

---

## API Usage Examples

### Environment Variables

```env
AIRTABLE_ACCESS_TOKEN=your_personal_access_token_here
AIRTABLE_BASE_ID=appnf33rbeqzbMMex
AIRTABLE_TABLE_DAGARA=tblgpw1VHNgR9RBhs
AIRTABLE_TABLE_CONTACT=tblnxV1FeMexChbIs
```

**For Vercel Deployment**, paste this into your environment variables:
```
AIRTABLE_ACCESS_TOKEN=your_personal_access_token_here
AIRTABLE_BASE_ID=appnf33rbeqzbMMex
AIRTABLE_TABLE_DAGARA=tblgpw1VHNgR9RBhs
AIRTABLE_TABLE_CONTACT=tblnxV1FeMexChbIs
```

### Create a Record (PowerShell)

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
    'Content-Type' = 'application/json'
}

$body = @{
    fields = @{
        Name = "John Michael Smith"
        Email = "john@example.com"
        FirstName = "John"
        LastName = "Smith"
        BirthDate = "07/23/1985"
        WaterCount = 5
        NatureCount = 3
        FireCount = 4
        MineralCount = 2
        EarthCount = 6
        DominantElement = "Earth"
        SpiritBird = "Owl"
        MasculineEnergy = 8
        FeminineEnergy = 12
        SubmittedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    typecast = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/$env:AIRTABLE_BASE_ID/$env:AIRTABLE_TABLE_DAGARA" `
    -Headers $headers `
    -Method Post `
    -Body $body
```

### Create a Record (cURL)

```bash
curl -X POST "https://api.airtable.com/v0/appnf33rbeqzbMMex/tblgpw1VHNgR9RBhs" \
  -H "Authorization: Bearer $AIRTABLE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "fields": {
      "Name": "John Michael Smith",
      "Email": "john@example.com",
      "FirstName": "John",
      "LastName": "Smith",
      "BirthDate": "07/23/1985",
      "WaterCount": 5,
      "NatureCount": 3,
      "FireCount": 4,
      "MineralCount": 2,
      "EarthCount": 6,
      "DominantElement": "Earth",
      "SpiritBird": "Owl",
      "MasculineEnergy": 8,
      "FeminineEnergy": 12,
      "SubmittedAt": "2026-01-03T14:30:00Z"
    },
    "typecast": true
  }'
```

### List Records (PowerShell)

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
}

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/$env:AIRTABLE_BASE_ID/$env:AIRTABLE_TABLE_DAGARA?maxRecords=10" `
    -Headers $headers `
    -Method Get
```

### List Records (cURL)

```bash
curl "https://api.airtable.com/v0/appnf33rbeqzbMMex/tblgpw1VHNgR9RBhs?maxRecords=10" \
  -H "Authorization: Bearer $AIRTABLE_ACCESS_TOKEN"
```

### Filter by Email (PowerShell)

```powershell
$email = "john@example.com"
$filter = "SEARCH('$email', {Email})"
$encodedFilter = [System.Web.HttpUtility]::UrlEncode($filter)

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/$env:AIRTABLE_BASE_ID/$env:AIRTABLE_TABLE_DAGARA?filterByFormula=$encodedFilter" `
    -Headers $headers `
    -Method Get
```

### Contact Table - Create Record (PowerShell)

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
    'Content-Type' = 'application/json'
}

$body = @{
    fields = @{
        FirstName = "Jane"
        LastName = "Doe"
        Email = "jane@example.com"
        Phone = "+1 (555) 987-6543"
        Motivation = "I'm interested in exploring my medicine wheel and learning about Soul Cultivation practices."
        SubmittedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    typecast = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/$env:AIRTABLE_BASE_ID/$env:AIRTABLE_TABLE_CONTACT" `
    -Headers $headers `
    -Method Post `
    -Body $body
```

---

## Schema Management

### Creating New Tables

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
    'Content-Type' = 'application/json'
}

$body = @{
    name = "TableName"
    description = "Table description"
    fields = @(
        @{ name = "FieldName"; type = "singleLineText" }
        @{ name = "Email"; type = "email" }
        @{ name = "CreatedAt"; type = "dateTime"; options = @{ 
            dateFormat = @{ name = "iso" }
            timeFormat = @{ name = "24hour" }
            timeZone = "utc"
        }}
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/meta/bases/$env:AIRTABLE_BASE_ID/tables" `
    -Headers $headers `
    -Method Post `
    -Body $body
```

### Adding Fields to Existing Table

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
    'Content-Type' = 'application/json'
}

$body = @{
    name = "NewFieldName"
    type = "singleLineText"
    description = "Optional field description"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/meta/bases/$env:AIRTABLE_BASE_ID/tables/TABLE_ID/fields" `
    -Headers $headers `
    -Method Post `
    -Body $body
```

### Updating Field Properties

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
    'Content-Type' = 'application/json'
}

$body = '{"description":"Updated description"}'

Invoke-RestMethod `
    -Uri "https://api.airtable.com/v0/meta/bases/$env:AIRTABLE_BASE_ID/tables/TABLE_ID/fields/FIELD_ID" `
    -Headers $headers `
    -Method PATCH `
    -Body $body
```

### Viewing Table Schema

```powershell
$headers = @{
    Authorization = "Bearer $env:AIRTABLE_ACCESS_TOKEN"
}

# Get all tables in base
(Invoke-RestMethod -Uri "https://api.airtable.com/v0/meta/bases/$env:AIRTABLE_BASE_ID/tables" -Headers $headers).tables | 
    Select-Object id, name, description

# Get specific table's fields
(Invoke-RestMethod -Uri "https://api.airtable.com/v0/meta/bases/$env:AIRTABLE_BASE_ID/tables" -Headers $headers).tables | 
    Where-Object { $_.name -eq 'DagaraMedicineWheel' } | 
    Select-Object -ExpandProperty fields | 
    Select-Object id, name, type, description | 
    Format-Table
```

**Note on Field Deletion**: As of January 2026, the Airtable Metadata API does not support deleting fields via API. Fields must be deleted manually through the Airtable web interface. PATCH and DELETE operations on individual field endpoints return `NOT_FOUND` errors.

---

## Element Mappings

The Dagara Medicine Wheel uses numerology to map names and birth dates to five elements:

| Element | Digit Values | Spirit Bird | Medicine |
|---|---|---|---|
| **Water** | 1, 6 | Blue Heron | Reconciliation, healing, emotional cleansing |
| **Nature** | 3, 8 | Flicker (Woodpecker) | Growth, transformation, renewal |
| **Fire** | 2, 7 | Red-Tailed Hawk | Vision, ancestral wisdom, truth |
| **Mineral** | 4, 9 | Raven | Memory, structure, foundation |
| **Earth** | 0, 5 | Owl | Home, sanctuary, grounded wisdom |

### Energy Types

- **Masculine Energy**: Sum of digits 0-4
- **Feminine Energy**: Sum of digits 5-9

---

## Integration Flow

### Medicine Wheel Submission

1. User fills out form on `/quiz` page with:
   - Email
   - First Name
   - Last Name
   - Full Birth Name
   - Birth Date

2. Frontend calculates medicine wheel in real-time using numerology

3. User clicks "Save My Results"

4. POST request to `/api/medicine-wheel` endpoint

5. Backend validates data and submits to Airtable `DagaraMedicineWheel` table

6. Success response triggers confirmation UI

### Contact Form Submission

1. User clicks "Contact" in global header

2. Modal opens with contact form

3. User fills out:
   - First Name
   - Last Name
   - Email
   - Phone (optional)
   - Motivation message

4. POST request to `/api/contact` endpoint

5. Backend submits to Airtable `Contact` table

6. Success message displayed, modal closes after 2 seconds

---

## Future Tables

This document will be updated as new tables are added to the base.

### Planned Tables
- User profiles
- Session bookings
- Course enrollments
- Ritual participation
- Community forum posts

---

**Last Updated**: January 3, 2026  
**Maintained By**: Soul Cultivation Development Team
