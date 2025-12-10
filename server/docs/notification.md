# Notification

When user books a show we need to send email to user informing that show is booked. Inngest works here as server might crash / restart but it should not affect the notification which is scheduled.

For sending mail we use `Nodemailer`. Which uses `transporter` which uses `SMTP` protocol, `Message` to define `sender`, `recipient` and `content`.<br>
`Nodemailer` is used to send the email which requires:<br>

- host; example: `"smtp.google.com"`
- email; email address of sender
- pass; application password which is achieved from Google account

For remiders we can use scheduler from Inngest which runs itself every 8 hours with no api call, no manuall trigger, it is used to send reminder to those user whose movie showtime is near.

## Implementation

Reminders works as:

- Starting from now find all the movies who will start in 8 hour window.
- Find all the users who have booked those movies.
- Send them a reminder about their movie.

### Schedule

We schedule a job to run code every 8 hours, evryday. Using:<br>
`{ cron: "0 */8 * * *" }`

```js
Run at 00:00
Run at 08:00
Run at 16:00
Then repeat every day
```

### Window

We find all the shows which start from currentTime to 8 hours from now with buffer of 10 minutes.
