# Deployment Checklist

## Pre-Deployment

- [x] Remove all Ukiah Senior Center branding
- [x] Update metadata for Soul Cultivation
- [x] Clean up debug console.log statements
- [x] Remove TODO comments
- [x] Create README.md
- [x] Create .env.example
- [ ] Configure Airtable environment variables
- [ ] Test quiz functionality end-to-end
- [ ] Test all pathway card links
- [ ] Verify email collection works
- [ ] Mobile responsive testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

## Environment Setup

### Airtable Configuration
1. Create Airtable base for Soul Cultivation
2. Set up table with fields: Email, Element, Birth Year, Timestamp
3. Get API key from Airtable account settings
4. Copy base ID and table ID
5. Add to `.env.local`:
   ```
   AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   AIRTABLE_TABLE_ID=tblXXXXXXXXXXXXXX
   ```

## Deployment Platforms

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

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
