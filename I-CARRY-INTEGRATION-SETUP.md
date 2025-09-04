# I Carry Integration Setup Guide

## Required Information

To complete the I Carry shipment integration, you need to provide the following details:

### 1. API Credentials
- **API Base URL**: The I Carry API endpoint (e.g., `https://api.icarry.com/v1`)
- **API Key**: Your I Carry API key for authentication
- **API Secret**: Your I Carry API secret (if required)

### 2. Account Details
- **Account ID**: Your I Carry account identifier
- **Vendor Code**: Your vendor/partner code with I Carry

### 3. Service Configuration
- **Default Service Type**: Standard/Express/Premium shipping options
- **Pickup Location**: Your default pickup address details
- **COD Settings**: Cash on Delivery configuration (if applicable)

## Where to Add These Details

Once you have the above information, update the following file:

**File**: `supabase/functions/create-shipment/index.ts`

**Section to Update** (Lines 10-14):
```typescript
const ICARRY_CONFIG = {
  apiUrl: 'YOUR_ICARRY_API_URL', // Replace with actual API URL
  apiKey: 'YOUR_ICARRY_API_KEY', // Add this to Supabase secrets
  apiSecret: 'YOUR_ICARRY_API_SECRET' // Add this to Supabase secrets
};
```

## Additional Supabase Secrets to Add

After getting your I Carry credentials, add these secrets to your Supabase project:

1. `ICARRY_API_KEY` - Your I Carry API key
2. `ICARRY_API_SECRET` - Your I Carry API secret (if required)

## API Integration Points

The integration handles:
- Creating shipments automatically after successful payment
- Tracking number generation
- Delivery status updates
- Estimated delivery dates
- Order tracking for customers

## Testing

Once configured, test the integration with:
1. Place a test order through the checkout flow
2. Verify shipment creation in admin panel
3. Check tracking updates are received
4. Ensure customer notifications work

## Support

For I Carry API documentation and support, contact your I Carry account manager or visit their developer portal.