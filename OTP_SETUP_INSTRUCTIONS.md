# OTP Login Setup Instructions

## Overview
The OTP (One-Time Password) login functionality is implemented but currently hidden from the login/signup pages. To enable real-time SMS OTP functionality, you need to set up a proper SMS service.

## Current Implementation
- **Database**: `sms_otp` table exists with all necessary fields
- **Components**: `OTPLogin.tsx` component is ready but hidden
- **Functions**: Database functions for OTP cleanup exist

## Steps to Enable Real SMS OTP

### 1. Choose an SMS Provider
Select one of these popular SMS services:
- **Twilio** (Recommended - reliable, global)
- **AWS SNS** (Good for existing AWS users)
- **TextLocal** (Good for India-specific usage)
- **MSG91** (Popular in India)

### 2. Create Supabase Edge Function
Create a new edge function to send SMS:

```bash
supabase functions new send-sms-otp
```

### 3. Add SMS Service Credentials
Add your SMS service credentials to Supabase secrets:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN` 
- `TWILIO_PHONE_NUMBER`

### 4. Implement SMS Sending Logic
Update the edge function to:
- Generate 6-digit OTP
- Store in `sms_otp` table
- Send SMS via your chosen provider
- Handle delivery confirmation

### 5. Update Frontend
Uncomment/enable OTP components in:
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`

### 6. Test Thoroughly
- Test OTP generation
- Test SMS delivery
- Test OTP verification
- Test rate limiting
- Test error handling

### 7. Security Considerations
- Implement rate limiting (max 3 attempts per 15 minutes)
- Set OTP expiry (5-10 minutes)
- Add CAPTCHA for abuse prevention
- Log failed attempts
- Monitor SMS costs

### 8. Cost Optimization
- Use local SMS providers for better rates
- Implement smart routing based on country
- Add fallback providers
- Monitor usage and costs

## Example Twilio Implementation
```typescript
import { Twilio } from 'https://deno.land/x/twilio@0.1.0/mod.ts'

const client = new Twilio({
  accountSid: Deno.env.get('TWILIO_ACCOUNT_SID'),
  authToken: Deno.env.get('TWILIO_AUTH_TOKEN')
})

const message = await client.messages.create({
  body: `Your verification code is: ${otpCode}`,
  from: Deno.env.get('TWILIO_PHONE_NUMBER'),
  to: phoneNumber
})
```

## Testing
For testing purposes, you can temporarily enable a "development mode" that:
- Shows OTP in console logs
- Sends OTP via email instead of SMS
- Uses a fixed OTP code (123456) in development

Once you complete these steps, the OTP functionality will be fully operational with real SMS delivery.