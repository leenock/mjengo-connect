# KopoKopo Integration Setup Guide

This guide will help you set up KopoKopo payment integration for client wallet top-ups.

## Required Environment Variables

Add the following environment variables to your `.env` file in the `server` directory:

```env
# KopoKopo API Credentials
KOPOKOPO_CLIENT_ID=your_client_id_here
KOPOKOPO_CLIENT_SECRET=your_client_secret_here
KOPOKOPO_TILL_NUMBER=K000000
KOPOKOPO_BASE_URL=https://sandbox.kopokopo.com
KOPOKOPO_CALLBACK_URL=http://localhost:5000/api/client/wallet/kopokopo/webhook
```

## ⚠️ Important: Sandbox vs Production Behavior

### Sandbox Environment:
- **STK Push is SIMULATED** - No actual phone prompt will appear
- Payments are processed via webhook callbacks automatically
- Use this for testing your integration logic
- Webhook callbacks will be sent to your callback URL
- No real money is involved

### Production Environment:
- **STK Push is REAL** - Users will receive actual M-Pesa prompts on their phones
- Requires a verified Online Payments account
- Real money transactions
- Must use HTTPS for webhook callbacks

## Getting Your KopoKopo Credentials

### For Sandbox (Testing):
1. Sign up for a KopoKopo Sandbox account at https://sandbox.kopokopo.com
2. Navigate to your dashboard
3. Create an application to get your `CLIENT_ID` and `CLIENT_SECRET`
4. Request an Online Payments account to get your `TILL_NUMBER` (prefixed with "K")
5. Contact KopoKopo support (api-support@kopokopo.com) to activate your Online Payments account
6. **Note:** In sandbox, STK push requests are simulated - no actual phone prompt appears

### For Production:
1. Contact KopoKopo support at api-support@kopokopo.com or support@kopokopo.com
2. Request an Online Payments account
3. You'll receive your production credentials and till number
4. Update `KOPOKOPO_BASE_URL` to `https://api.kopokopo.com`
5. Update `KOPOKOPO_CALLBACK_URL` to your production webhook URL (must be HTTPS)

## Webhook Configuration

The webhook endpoint is: `/api/client/wallet/kopokopo/webhook`

**Important:**
- For production, the webhook URL must be publicly accessible via HTTPS
- KopoKopo will send webhook callbacks to this URL when payment status changes
- Make sure your server is accessible from the internet (consider using ngrok for local testing)

### Testing Webhooks Locally:
1. Use ngrok to expose your local server: `ngrok http 5000`
2. Update `KOPOKOPO_CALLBACK_URL` with the ngrok URL: `https://your-ngrok-url.ngrok.io/api/client/wallet/kopokopo/webhook`
3. Update the callback URL in your KopoKopo dashboard

## API Endpoints

### 1. Initiate STK Push
**POST** `/api/client/wallet/add-funds/kopokopo`
- Requires authentication (Bearer token)
- Request body:
```json
{
  "paymentChannel": "M-PESA STK Push",
  "amount": 1000,
  "currency": "KES",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+254712345678",
  "email": "john@example.com",
  "metadata": {
    "customerId": "user_id",
    "reference": "WALLET_TOPUP_123",
    "notes": "Wallet top-up"
  }
}
```

### 2. Get Wallet Balance
**GET** `/api/client/wallet/balance`
- Requires authentication (Bearer token)

### 3. Get Payment Status
**GET** `/api/client/wallet/payment-status/:paymentRequestId`
- Requires authentication (Bearer token)

### 4. Webhook Endpoint
**POST** `/api/client/wallet/kopokopo/webhook`
- Public endpoint (called by KopoKopo)
- No authentication required

## Database Migration

After updating the Prisma schema, run:

```bash
cd server
npx prisma migrate dev --name add_kopokopo_fields
npx prisma generate
```

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use environment variables** - All KopoKopo credentials are stored in environment variables
3. **HTTPS in production** - Always use HTTPS for webhook callbacks in production
4. **Validate webhooks** - Consider implementing webhook signature validation (see KopoKopo docs)

## Testing

### Sandbox Testing:
1. Start your server: `npm start` (in server directory)
2. Use Postman or your frontend to test the STK Push initiation
3. **No phone prompt will appear** - this is expected in sandbox
4. Check your server logs for webhook callbacks
5. The payment will be simulated and processed automatically via webhook
6. Check your database to see if the payment status was updated

### Production Testing:
1. Ensure you have a verified Online Payments account
2. Use a real Safaricom phone number
3. Initiate the STK Push request
4. **You will receive an actual M-Pesa prompt on your phone**
5. Enter your M-Pesa PIN to complete the payment
6. Check webhook logs to confirm payment status

## Troubleshooting

- **"Failed to get access token"**: Check your CLIENT_ID and CLIENT_SECRET
- **"Till number not found"**: Ensure you have an Online Payments account
- **Webhook not received**: Check that your callback URL is publicly accessible
- **Payment stuck in PENDING**: Check webhook logs and KopoKopo dashboard

## References

- KopoKopo API Documentation: https://developers.kopokopo.com/guides/
- KopoKopo Support: api-support@kopokopo.com
