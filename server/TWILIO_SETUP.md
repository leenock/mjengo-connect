# Twilio SMS Setup Guide for OTP Password Reset

This guide explains how to configure Twilio for sending OTP (One-Time Password) SMS messages for password reset functionality.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/try-twilio)
2. A verified Twilio phone number that can send SMS

## Environment Variables

Add the following environment variables to your `.env` file in the `server` directory:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Getting Your Twilio Credentials

### 1. Account SID and Auth Token

1. Log in to your Twilio Console at https://console.twilio.com/
2. On the dashboard, you'll see your **Account SID** and **Auth Token**
3. Click on "Show" to reveal your Auth Token
4. Copy both values to your `.env` file

### 2. Twilio Phone Number

1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Or use the trial phone number provided by Twilio
3. Copy the phone number (in E.164 format: +1234567890) to your `.env` file

## Trial Account Limitations

If you're using a Twilio trial account:

1. **Verified Numbers Only**: You can only send SMS to verified phone numbers
   - Go to **Phone Numbers** → **Verified Caller IDs** to add numbers
   - You'll receive a verification call/SMS to confirm each number

2. **Trial Message Prefix**: All messages will start with "Sent from your Twilio trial account"

3. **Limited Credits**: Trial accounts have limited SMS credits (~$15 worth)

## Phone Number Format

The system automatically handles Kenyan phone numbers in various formats:

- `0712345678` → `+254712345678`
- `254712345678` → `+254712345678`
- `+254712345678` → `+254712345678`
- `712345678` → `+254712345678`

## API Endpoints

### Send OTP
```
POST /api/client/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "0712345678"
}
```

### Verify OTP and Reset Password
```
POST /api/client/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "0712345678",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

### Resend OTP
```
POST /api/client/auth/resend-otp
Content-Type: application/json

{
  "phoneNumber": "0712345678"
}
```

### Check SMS Service Status
```
GET /api/client/auth/check-sms-service
```

## OTP Specifications

- **Length**: 6 digits
- **Expiry**: 10 minutes
- **Security**: OTP is hashed before storage (bcrypt)
- **Format**: Numeric only (e.g., "123456")

## Security Considerations

1. **OTP Hashing**: OTPs are hashed before storing in the database
2. **Expiry**: OTPs automatically expire after 10 minutes
3. **Single Use**: OTP is cleared after successful verification
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **Phone Enumeration**: The system doesn't reveal if a phone number exists

## Troubleshooting

### Common Errors

1. **"Twilio is not properly configured"**
   - Check that all environment variables are set correctly
   - Ensure there are no typos in the Account SID or Auth Token

2. **"The phone number is not verified with your Twilio trial account"**
   - Add the recipient phone number to Verified Caller IDs in Twilio Console

3. **"Invalid phone number format"**
   - Ensure the phone number is valid
   - Try using the full international format (+254...)

4. **SMS not received**
   - Check Twilio logs in the Console for delivery status
   - Verify the phone number is correct
   - Check if the number can receive SMS (not a landline)

### Testing

For testing without sending actual SMS:
1. Check server logs for the generated OTP
2. Use Twilio's test credentials (messages won't be sent)
3. In development, you can temporarily log the OTP

## Database Migration

After updating the schema, run:

```bash
cd server
npx prisma migrate dev --name add_otp_fields
npx prisma generate
```

This adds the `otp` and `otpExpiresAt` fields to the `Client_User` model.

## Cost Considerations

- Twilio SMS pricing varies by country
- Kenya SMS typically costs ~$0.05-0.10 per message
- Monitor your usage in the Twilio Console
- Set up usage alerts to avoid unexpected charges
