# Deployment Checklist

## Pre-Deployment

- [x] Remove all Ukiah Senior Center branding
- [x] Update metadata for Soul Cultivation
- [x] Clean up debug console.log statements
- [x] Remove TODO comments
- [x] Create README.md
- [x] Create AIRTABLE_SCHEMA.md
- [x] Configure Airtable environment variables
- [x] Test Medicine Wheel quiz functionality end-to-end
- [x] Test all pathway card interactions (same-page pattern)
- [x] Verify email collection works (both quiz + contact form)
- [x] Mobile responsive testing
- [x] Cross-browser testing (Chrome, Firefox, Safari)
- [x] Contact form CTA in global header
- [ ] SEO optimization (meta descriptions, Open Graph tags)
- [ ] Analytics setup (Google Analytics 4)
- [ ] Error tracking (Sentry)

## Environment Setup

### Airtable Configuration
1. ✅ Airtable base created: `appnf33rbeqzbMMex`
2. ✅ Tables created:
   - DagaraMedicineWheel (`tblgpw1VHNgR9RBhs`) - 15 active fields
   - Contact (`tblnxV1FeMexChbIs`) - 6 fields
3. ✅ Personal Access Token generated with 9 scopes
4. Environment variables in `.env.local`:
   ```bash
   AIRTABLE_ACCESS_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appnf33rbeqzbMMex
   AIRTABLE_TABLE_MEDICINE_WHEEL=tblgpw1VHNgR9RBhs
   AIRTABLE_TABLE_CONTACT=tblnxV1FeMexChbIs
   ```
5. See [AIRTABLE_SCHEMA.md](./AIRTABLE_SCHEMA.md) for complete schema documentation

## Deployment Platforms

### Option 1: Vercel (Recommended) ✅ CURRENT
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

**Vercel Environment Variables (Production):**
```bash
AIRTABLE_ACCESS_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appnf33rbeqzbMMex
AIRTABLE_TABLE_MEDICINE_WHEEL=tblgpw1VHNgR9RBhs
AIRTABLE_TABLE_CONTACT=tblnxV1FeMexChbIs
```

**Deployment Status:**
- ✅ Connected to GitHub repository
- ✅ Auto-deploy on push to `main` branch
- ✅ SSL certificate configured
- ✅ Edge network distribution enabled

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Post-Deployment

- [ ] Verify homepage loads correctly
- [ ] Test quiz flow with email submission
- [ ] Check Airtable data collection
- [ ] Verify all links work
- [ ] Test contact forms
- [ ] Confirm SEO metadata appears correctly
- [ ] Set up custom domain (soulcultivationnow.com)
- [ ] Configure SSL certificate
- [ ] Set up analytics (optional)
- [ ] Test performance (Lighthouse score)

## Future Enhancements

- [ ] Complete Airtable integration for quiz results
- [ ] Add email automation workflows
- [ ] Implement pathway detail pages
- [ ] Add booking/scheduling system
- [ ] Create admin dashboard
- [ ] Add blog/content section
- [ ] Implement user accounts
- [ ] Add payment processing for premium content

## Maintenance

- Keep dependencies updated: `yarn upgrade-interactive`
- Monitor Airtable API usage
- Review error logs regularly
- Backup Airtable data monthly
