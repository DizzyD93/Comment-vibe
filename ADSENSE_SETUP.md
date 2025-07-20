# Google AdSense Setup Instructions

## Steps to Enable Monetization

### 1. Get Google AdSense Publisher ID
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up or log in with your Google account
3. Add your website URL
4. Get approved (may take 1-3 days)
5. Copy your Publisher ID (format: ca-pub-XXXXXXXXXXXXXXXX)

### 2. Update the Code
Replace `ca-pub-XXXXXXXXXXXXXXXX` in these files with your actual Publisher ID:

**client/index.html** (line 39):
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID" crossorigin="anonymous"></script>
```

**client/src/components/GoogleAds.tsx** (line 25):
```typescript
data-ad-client="ca-pub-YOUR_ACTUAL_ID"
```

### 3. Create Ad Units in AdSense
1. In your AdSense dashboard, go to "Ads" > "By ad unit"
2. Create these ad units:
   - **Banner Ad**: 728x90 or responsive banner
   - **In-Content Ad**: 300x250 rectangle
   - **Sidebar Ad**: 300x600 or 160x600

3. Copy the ad slot IDs and update in `GoogleAds.tsx`:
   - `BannerAd`: Replace `"1234567890"` with your banner slot ID
   - `InContentAd`: Replace `"1122334455"` with your rectangle slot ID
   - `SidebarAd`: Replace `"0987654321"` with your sidebar slot ID

### 4. Ad Placements Currently Set
- **Top Banner**: Above the URL input (catches user attention before they start)
- **In-Content**: Between comments and footer (high engagement area)
- **Future placements**: Can add sidebar ads on larger screens

### 5. Best Practices for Revenue
- Keep the minimalistic design - ads blend better
- Monitor ad performance in AdSense dashboard
- Consider adding more placements after getting traffic data
- Ensure ads don't interfere with user experience

### 6. Expected Revenue
- RPM (Revenue per 1000 impressions): $1-5 typically
- Depends on: traffic quality, user location, niche relevance
- YouTube analysis tool users often have good engagement rates

## Notes
- Ads will only show to real users (not in development)
- AdSense requires real traffic to display ads
- Keep content high-quality for better ad rates
- Consider adding more content pages for additional ad inventory