
import crypto from 'crypto';
import axios from "axios";
import twilio from 'twilio'

export const generateOtp = (mobile) => {
   const otp =  crypto.randomInt(1000, 10000); 
   sendOtpSMS(mobile,otp)
   return otp

};


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOtpSMS = async (mobile, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }  
};  