"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingConfirmationHTML = void 0;
const BookingConfirmationHTML = ({ type = "confirmed", fullName, serviceType, appointmentDate, preferredTime, location, styles, budget, occasionType, }) => {
    const isUpdate = type === "updated";
    const title = isUpdate ? "Booking Updated" : "Booking Confirmation";
    const heading = isUpdate
        ? "Your Booking Has Been Updated! 📝"
        : "Your Booking is Confirmed! 💚";
    const greeting = isUpdate
        ? "Thanks for updating your booking with"
        : "Thank you for booking with";
    const subNote = isUpdate
        ? "Here's your updated booking details:"
        : "Here are your booking details:";
    const connectNote = isUpdate
        ? "The artist will reconnect with you shortly to confirm the updated details."
        : "The artist will connect with you within 24 hours to confirm the final details and discuss your design preferences.";
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - ${"envConfig.COMPANY_DETAILS.COMPANY_NAME_SMALL"}</title>
  </head>

  <body
    style="margin: 0; padding: 0; background-color: #fdfcf8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
  >
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); padding: 30px;"
          >
            <tr>
              <td style="padding-bottom: 20px; text-align: center">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto">
                  <tr>
                    <td style="padding-right: 10px; vertical-align: middle">
                      <div
                        style="width: 40px; height: 35px; border-radius: 50%; background-color: #6b8e23; color: #fff; font-weight: bold; display: inline-block; text-align: center; font-size: 25px; padding-top: 10px;"
                      >
                        B
                      </div>
                    </td>
                    <td style="vertical-align: middle">
                      <h1 style="font-size: 24px; color: #6b8e23; font-weight: bold; margin: 0;">
                        ${"envConfig.COMPANY_DETAILS.COMPANY_NAME_SMALL"}
                      </h1>
                    </td>
                  </tr>
                </table>
                <h3 style="color: #222; margin-top: 20px">${heading}</h3>
              </td>
            </tr>
            <tr>
              <td style="color: #444; font-size: 16px; line-height: 1.6">
                <p>Hi <strong>${fullName}</strong>,</p>

                <p>
                  ${greeting} <strong>${"envConfig.COMPANY_DETAILS.COMPANY_NAME_SMALL"}</strong>!
                  We're excited to serve you.
                </p>

                <p><strong>${subNote}</strong></p>

                <table
                  cellpadding="6"
                  cellspacing="0"
                  width="100%"
                  style="background-color: #f8f8f8; border-radius: 8px; padding-left: 20px;"
                >
                  <tr>
                    <td><strong>Service Type:</strong></td>
                    <td>${serviceType}</td>
                  </tr>
                  <tr>
                    <td><strong>Occasion:</strong></td>
                    <td>${occasionType}</td>
                  </tr>
                  <tr>
                    <td><strong>Style:</strong></td>
                    <td>${styles === null || styles === void 0 ? void 0 : styles.join(", ")}</td>
                  </tr>
                  <tr>
                    <td><strong>Budget:</strong></td>
                    <td>₹${budget === null || budget === void 0 ? void 0 : budget.min} – ₹${budget === null || budget === void 0 ? void 0 : budget.max}</td>
                  </tr>
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>${appointmentDate.toDateString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Time:</strong></td>
                    <td>${preferredTime}</td>
                  </tr>
                  <tr>
                    <td><strong>Location:</strong></td>
                    <td>${location}</td>
                  </tr>
                </table>

                <p style="margin-top: 20px">
                  🎨 We’ll shortly assign a professional artist within your budget range
                  who specializes in ${styles === null || styles === void 0 ? void 0 : styles.join(" and ")} style.
                </p>

                <p>
                  💌 ${connectNote}
                </p>

                <p>
                  If you have any questions or need to make changes, please reach out at
                  <a href="mailto:${"envConfig.COMPANY_DETAILS.COMPANY_SUPPORT_EMAIL"}" style="color: #3b7e20">
                    ${"envConfig.COMPANY_DETAILS.COMPANY_SUPPORT_EMAIL"}
                  </a>.
                </p>

                <p>
                  With love,<br />
                  <strong>The ${"envConfig.COMPANY_DETAILS.COMPANY_NAME_SMALL"} Team</strong>
                </p>

                <p style="margin-top: 30px">
                  🌐 Visit us:
                  <a href="${"envConfig.COMPANY_DETAILS.COMPANY_URL"}" style="color: #3b7e20">
                    bridalmehndi.in
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
exports.BookingConfirmationHTML = BookingConfirmationHTML;
