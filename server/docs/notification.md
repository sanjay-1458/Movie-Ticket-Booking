# Notification

When user books a show we need to send email to user informing that show is booked. Inngest works here as server might crash / restart but it should not affect the notification which is scheduled.

For sending mail we use `Nodemailer`. Which uses `transporter` which uses `SMTP` protocol, `Message` to define `sender`, `recipient` and `content`.