import twilio from 'twilio';

/**
 * Twilio Service for sending SMS messages
 * 
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_PHONE_NUMBER: Your Twilio phone number (e.g., +1234567890)
 */

// Twilio configuration
const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
};

/**
 * Validates Twilio configuration
 * @returns {boolean} True if all required config values are present
 */
const validateTwilioConfig = () => {
  const { accountSid, authToken, phoneNumber } = TWILIO_CONFIG;
  
  if (!accountSid || !authToken || !phoneNumber) {
    console.error('Twilio configuration error: Missing required environment variables');
    console.error('Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
    return false;
  }
  
  return true;
};

/**
 * Initialize Twilio client
 * @returns {Object|null} Twilio client or null if config is invalid
 */
const getTwilioClient = () => {
  if (!validateTwilioConfig()) {
    return null;
  }
  
  return twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
};

/**
 * Formats phone number to E.164 format for Twilio
 * Handles Kenyan phone numbers (starting with 07, 01, or +254)
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number in E.164 format
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }
  
  // Remove all spaces, dashes, and parentheses
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // If it starts with +, assume it's already in international format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If it starts with 254, add the +
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  
  // If it starts with 07 or 01 (Kenyan format), convert to +254
  if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
    return `+254${cleaned.substring(1)}`;
  }
  
  // If it starts with 7 or 1 (without leading 0), add +254
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return `+254${cleaned}`;
  }
  
  // Default: assume it's a Kenyan number without country code
  return `+254${cleaned}`;
};

/**
 * Sends an SMS message using Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - Message body
 * @returns {Promise<Object>} Twilio message response
 */
export const sendSMS = async (to, message) => {
  const client = getTwilioClient();
  
  if (!client) {
    throw new Error('Twilio is not properly configured. Please check your environment variables.');
  }
  
  try {
    const formattedNumber = formatPhoneNumber(to);
    
    console.log(`[Twilio] Sending SMS to: ${formattedNumber}`);
    
    const response = await client.messages.create({
      body: message,
      from: TWILIO_CONFIG.phoneNumber,
      to: formattedNumber,
    });
    
    console.log(`[Twilio] SMS sent successfully. SID: ${response.sid}`);
    
    return {
      success: true,
      sid: response.sid,
      status: response.status,
      to: formattedNumber,
    };
  } catch (error) {
    console.error('[Twilio] Error sending SMS:', error.message);
    
    // Provide more specific error messages
    if (error.code === 21211) {
      throw new Error('Invalid phone number format. Please check the phone number and try again.');
    } else if (error.code === 21608) {
      throw new Error('The phone number is not verified with your Twilio trial account. Please verify it first.');
    } else if (error.code === 21614) {
      throw new Error('This phone number cannot receive SMS messages.');
    } else if (error.code === 20003) {
      throw new Error('Twilio authentication failed. Please check your credentials.');
    }
    
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Sends an OTP SMS message
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} Twilio message response
 */
export const sendOTPSMS = async (phoneNumber, otp) => {
  const message = `Your Mjengo Connect verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
  
  return await sendSMS(phoneNumber, message);
};

/**
 * Check if Twilio is properly configured
 * @returns {boolean} True if Twilio is configured
 */
export const isTwilioConfigured = () => {
  return validateTwilioConfig();
};

export default {
  sendSMS,
  sendOTPSMS,
  formatPhoneNumber,
  isTwilioConfigured,
};
