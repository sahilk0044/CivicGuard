import axios from "axios";

export const sendSMS = async (phone, message) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q", // transactional route
        message: message,
        language: "english",
        numbers: phone
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Fast2SMS Error:", error.response?.data || error.message);
  }
};