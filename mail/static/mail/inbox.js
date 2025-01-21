// When the back button is clicked
window.onpopstate = event => {
  const page = event.state.page;
  console.log(page);
  if(page === 'mailbox') {
    load_mailbox(event.state.type);
  }
  else if(page === 'compose') {
    compose_email();
  }
};

// Function to show a toast using BootStrap
function show_toast(message) {
  document.querySelector('.toast-body').innerHTML = message ;
  const toast_div = document.querySelector('.toast');
  var toast = new bootstrap.Toast(toast_div);

    toast.show();
}

document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => {
      // For updating the URL
      history.pushState({page: 'mailbox', type: 'inbox'} , '', 'inbox');

      load_mailbox('inbox');
    });
    document.querySelector('#sent').addEventListener('click', () => {
      // For updating the URL
      history.pushState({page: 'mailbox', type: 'sent'} , '', 'sent');

      load_mailbox('sent')
    });
    document.querySelector('#archived').addEventListener('click', () => {
      // For updating the URL
      history.pushState({page: 'mailbox', type: 'archive'} , '', 'archive');

      load_mailbox('archive')
    });
    document.querySelector('#compose').addEventListener('click', () => {
      // For updating the URL
      history.pushState({page: 'compose'} , '', 'compose-email');

      compose_email();
    });
  
    // By default, load the inbox
    load_mailbox('inbox'); 
  });

// Variables required for the reply email
let reply = false;
let email_id = null;

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // For a reply email
  if(reply) {
    fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Pre - filling the compose-form
      document.querySelector('#compose-recipients').value = email.sender;
      let subject = '';
      if (email.subject.startsWith('Re:')) {
        subject = email.subject;
      }
      else {
        subject = `Re: ${email.subject}`;
      }
      document.querySelector('#compose-subject').value = subject;
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body}`;

    });
  }

  // Add onsubmit event listener to the compose-form
  document.querySelector('#compose-form').onsubmit =  () => {
    
    //Take the user input
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
  
    //Send a POST request to store the email
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        if(result.message !== undefined ) {
          if (reply) {          // Check if it is a reply email
            reply = false;      // Reply email is now submitted
          }
          load_mailbox('sent');
          show_toast(result.message);  // Show a toast for the message
          
        }
        else {
          show_toast(result.error);   // Show a toast for the error message
        }   
    }).catch(error => {
      console.log('Error', error);
    });
    
    // Stop the form from submitting to the server
    return false;
  };
  
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // GET the mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // If there are no emails in the mailbox
      if(!emails.length) {
        const empty_div = document.createElement('div');
        empty_div.innerHTML = `There are no ${mailbox} emails.`;
        document.querySelector('#emails-view').append(empty_div);
      }

      // For each email, create a div
      emails.forEach(email => {
        const email_div = document.createElement('div');
        
        //When the email is clicked, view that email
        email_div.addEventListener('click', () => view_email(email));

        // Title will be different for (inbox, archive) and sent
        let title = '';
        if (mailbox === 'sent') {
          title = `To: ${email.recipients}`;
        }
        else {
          title = email.sender;
        }
        email_div.className = 'row p-2 border rounded shadow-sm fw-bold'
        email_div.innerHTML = `<div class="col-lg-3 col-md-5 ">${title}</div><div class="col-lg-6 col-md-5">${email.subject}</div><div class="col-lg-3 col-md-2">${email.timestamp}</div>`;
        
        // Background color will be different for read and unread emails
        if(email.read) {
          email_div.style.backgroundColor = 'rgba(230, 230, 230, 0.938)';
          email_div.className = 'row p-2 border rounded shadow-sm fw-normal';
        }
        else {
          email_div.style.backgroundColor = 'white';
        }
        document.querySelector('#emails-view').append(email_div);
      })
  }).catch(error => {
    console.log('Error', error);
  });
}

function view_email(email) {
  
  // Show the particular email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  
  // For updating the URL
  history.pushState({page: 'mailbox', type: 'inbox'} , '', 'inbox');

  // Adding onclick event listener to the reply button
  document.querySelector('#email-reply').onclick = () => {
    reply = true;
    email_id = email.id;    //Provide email id
    compose_email();
  };

  // Show the Archive/Unarchive and Reply buttons for recieved emails only
  const btn_div = document.querySelector('#email-buttons');
  if(email.sender === btn_div.dataset.user) {
    btn_div.style.display = 'none';       //Sent emails
  }
  else {
    btn_div.style.display = 'block';      //Recieved emails
  }
  
  const archive_btn = document.querySelector('#email-archive');
  // Deciding the title of the archive/unarchive button
  if(!email.archived) {
    archive_btn.innerHTML = 'Archive';
  }
  else {
    archive_btn.innerHTML = 'Unarchive';
  }
  
  // Adding onclick event listener to the archive/unarchive button
  archive_btn.onclick = () => {
    if(!email.archived) {
      // PUT request to update the email (Archive the email)
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      .then(() => {
        archive_btn.innerHTML = 'Unarchive';
        load_mailbox('inbox');
        show_toast('Email Archived!');
      })
      .catch(error => {
        console.log('Error', error);
      });

    }
    else {
      // PUT request to update the email (Unarchive the email)
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      .then(() => {
        archive_btn.innerHTML = 'Archive';
        load_mailbox('inbox');
        show_toast('Email Unarchived!');
      })
      .catch(error => {
        console.log('Error', error);
      });
    }
  };

  // GET the particular email
  fetch(`/emails/${email.id}`)
  .then(response => response.json())
  .then(data => {
    // Print email
    console.log(data);
    document.querySelector('#email-subject').innerHTML = `<h3>${data.subject}</h3>`;
    document.querySelector('#email-body').innerHTML = `
      <b>Sender:</b> ${data.sender}<br>
      <b>Recipients:</b> ${data.recipients}<br>
      <b>Subject:</b> ${data.subject}<br>
      ${data.timestamp}<br><br>
      <p>${data.body}</p>` ;
  }).catch(error => {
    console.log('Error', error);
  });

  // PUT request to update the email (Mark as read)
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  }).catch(error => {
    console.log('Error', error);
  });
}

