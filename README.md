# Mail

Mail is a front-end for an email client designed to send, receive, and manage emails using API calls. The project is built as a single-page-application(SPA) using JavaScript, HTML, and CSS.

### Description

This project is a fully functional email client where users can:
- Send emails.
- View their Inbox, Sent, and Archived emails.
- Mark emails as read or unread.
- Archive and unarchive emails.
- Reply to received emails.

### Getting Started

1. Run the following commands:
```bash
python manage.py makemigrations mail
python manage.py migrate
python manage.py runserver
```
2. Visit http://127.0.0.1:8000/ in your web browser to use the email client.

### Specification

#### Send Mail
- A user submits the email composition form to send an email.
- The form includes fields for:
  - **Recipients**
  - **Subject**
  - **Body**
- After sending the email, the application redirects the user to their Sent mailbox.

#### Mailbox
- When the user visits their **Inbox**, **Sent**, or **Archive**, the appropriate mailbox is loaded.
- The mailbox displays:
  - Sender
  - Subject line
  - Timestamp
- Email status:
  - **Unread emails** appear with a white background.
  - **Read emails** appear with a gray background.

#### View Email
- Clicking on an email takes the user to a detailed view of the email.
- The view displays:
  - Sender
  - Recipients
  - Subject
  - Timestamp
  - Body
- When an email is viewed, it is marked as **read**.

#### Archive and Unarchive
- Users can archive or unarchive emails in the **Inbox**.
  - Archived emails are moved to the Archive mailbox.
  - Unarchived emails are moved back to the Inbox.
- Emails in the Sent mailbox cannot be archived.
- After archiving or unarchiving, the user is redirected to their Inbox.

#### Reply
- Users can reply to an email using the "Reply" button in the email view.
- The reply form is pre-filled with:
  - **Recipient**: The sender of the original email.
  - **Subject**: Prefixed with `Re:`.
  - **Body**: Includes the original email's timestamp, sender, and body text.

### CSS and Design

The front-end design is minimal and user-friendly, ensuring an intuitive experience for sending and managing emails.

### About

This project demonstrates proficiency in front-end development, particularly in building single-page applications that interact with RESTful APIs to send, retrieve, and update email data dynamically.

### Video Demo

You can view a video showcasing the project on [YouTube](https://www.youtube.com/watch?v=Nvrw2DVRWkI).
