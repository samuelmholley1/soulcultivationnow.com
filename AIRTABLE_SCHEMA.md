# Airtable Schema Documentation

This document describes the Airtable base structure for soulcultivationnow.com. Use this as a reference for all API calls and integrations.

## Base Information

- **Base Name**: soulcultivationnow.com
- **Base ID**: `appnf33rbeqzbMMex`
- **Access Token**: Stored in `AIRTABLE_ACCESS_TOKEN` environment variable

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

#### Legacy Fields (can be ignored)

- `Notes` - Multiline text field
- `Assignee` - Single collaborator
- `Status` - Single select (Todo/In progress/Done)
- `Attachments` - Multiple attachments
- `Attachment Summary` - AI-generated text

---

## API Usage Examples

### Environment Variables

```env
AIRTABLE_ACCESS_TOKEN=your_personal_access_token_here
AIRTABLE_BASE_ID=appnf33rbeqzbMMex
AIRTABLE_TABLE_DAGARA=tblgpw1VHNgR9RBhs
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

1. User fills out form on `/quiz` page with:
   - Email
   - First Name
   - Last Name
   - Full Birth Name
   - Birth Date

2. Frontend calculates medicine wheel in real-time

3. User clicks "Save My Results"

4. POST request to `/api/medicine-wheel` endpoint

5. Backend validates data and submits to Airtable

6. Success response triggers confirmation UI

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
