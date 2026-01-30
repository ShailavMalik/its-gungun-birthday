/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EMAIL SERVICE - VERCEL SERVERLESS FUNCTION (Node.js)
 * This endpoint handles secure email sending via EmailJS
 * Deploy to Vercel: credentials stored in Vercel environment variables
 * ═══════════════════════════════════════════════════════════════════════════
 */

const https = require("https");

/**
 * Send email via EmailJS API
 */
async function sendEmailViaEmailJS(templateParams) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    });

    const options = {
      hostname: "api.emailjs.com",
      port: 443,
      path: "/api/v1.0/email/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: responseData,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Main handler function for Vercel
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
    return;
  }

  try {
    // Validate environment variables
    if (
      !process.env.EMAILJS_PUBLIC_KEY ||
      !process.env.EMAILJS_SERVICE_ID ||
      !process.env.EMAILJS_TEMPLATE_ID
    ) {
      console.error("Missing EmailJS credentials:", {
        hasPublicKey: !!process.env.EMAILJS_PUBLIC_KEY,
        hasServiceId: !!process.env.EMAILJS_SERVICE_ID,
        hasTemplateId: !!process.env.EMAILJS_TEMPLATE_ID,
      });
      res.status(500).json({
        success: false,
        message: "Server configuration error - Missing credentials",
      });
      return;
    }

    const { action } = req.body;

    // Validate request
    if (!action) {
      res.status(400).json({
        success: false,
        message: "Missing required field: action",
      });
      return;
    }

    // Handle test email
    if (action === "send_test_email") {
      const templateParams = {};

      const result = await sendEmailViaEmailJS(templateParams);

      if (result.statusCode === 200) {
        res.status(200).json({
          success: true,
          message: "Test email sent successfully!",
        });
      } else {
        console.error("EmailJS error:", result.body);
        res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again.",
        });
      }
      return;
    }

    // Handle birthday email
    if (action === "send_birthday_email") {
      const templateParams = {};
      };

      const result = await sendEmailViaEmailJS(templateParams);

      if (result.statusCode === 200) {
        res.status(200).json({
          success: true,
          message: "Birthday email sent successfully!",
        });
      } else {
        console.error("EmailJS error:", result.body);
        res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again.",
        });
      }
      return;
    }

    // Invalid action
    res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (error) {
    console.error("Error in email function:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + (error.message || "Unknown error"),
    });
  }
};
