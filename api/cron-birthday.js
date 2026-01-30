/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Vercel Cron - Birthday Email Sender
 * Schedule (UTC): 30 18 19 1 *  -> 12:00 AM IST on Jan 20 (once per year)
 * Optimized for minimal usage: runs only once annually
 * ═══════════════════════════════════════════════════════════════════════════
 */

const https = require("https");

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

    req.on("error", (error) => reject(error));

    req.write(data);
    req.end();
  });
}

function isWithinIstMidnightWindow() {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );

  const isJan20 = ist.getMonth() === 0 && ist.getDate() === 20;
  const isMidnight = ist.getHours() === 0 && ist.getMinutes() <= 10;

  return isJan20 && isMidnight;
}

module.exports = async (req, res) => {
  // Allow Vercel Cron header or optional secret query
  const cronHeader = req.headers["x-vercel-cron"];
  const secret = req.query && req.query.secret;
  const hasSecret = !!process.env.CRON_SECRET;
  const secretOk = hasSecret ? secret === process.env.CRON_SECRET : true;

  if (!cronHeader && !secretOk) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (
    !process.env.EMAILJS_PUBLIC_KEY ||
    !process.env.EMAILJS_SERVICE_ID ||
    !process.env.EMAILJS_TEMPLATE_ID
  ) {
    res.status(500).json({
      success: false,
      message: "Missing EmailJS credentials",
    });
    return;
  }

  if (!isWithinIstMidnightWindow()) {
    res.status(200).json({
      success: true,
      message: "Not within IST midnight window. Skipped.",
    });
    return;
  }

  try {
    const templateParams = {
      to_name: "Birthday Person",
      subject: "🎉 Happy Birthday! 🎉",
      message: "Wishing you the most magical birthday ever! 🎂✨",
    };

    const result = await sendEmailViaEmailJS(templateParams);

    if (result.statusCode === 200) {
      res.status(200).json({
        success: true,
        message: "Birthday email sent successfully!",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
