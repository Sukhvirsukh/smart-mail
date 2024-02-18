const Imap = require('imap');
const { simpleParser } = require('mailparser');

// IMAP server configuration
const imapConfig = {
  user: 'vnamburi@smartleadscale.org', // your email address
  password: 'sg#2cxEi3Jo@ZX2f!4', // your email password
  host: 'imap.zoho.com.au', // IMAP server host
  port: 993, // IMAP server port (default is 993 for SSL/TLS)
  tls: true, // Use TLS/SSL for secure connection
};

// Function to fetch emails from the INBOX mailbox
function fetchEmails() {
  let emails: any = [];
  const imap = new Imap(imapConfig);

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening mailbox:', err);
        return;
      }

      const searchCriteria = ['UNSEEN']; // Fetch unseen emails
      const fetchOptions = { bodies: '', markSeen: true }; // Fetch email bodies and mark emails as seen

      imap.search(searchCriteria, (searchErr, results) => {
        if (searchErr) {
          console.error('Error searching for emails:', searchErr);
          return;
        }

        const fetch = imap.fetch(results, fetchOptions);

        fetch.on('message', (msg) => {
          const emailData = { headers: {} };

          msg.on('body', (stream) => {
            let body = '';
            stream.on('data', (chunk) => {
              body += chunk.toString('utf8');
            });
            stream.once('end', () => {
              emailData['body'] = body;
            });
          });

          msg.once('attributes', (attrs) => {
            emailData.headers = attrs.struct;
          });

          msg.once('end', () => {
            // Extract desired fields and store in an object
            if (emailData['body'])
              simpleParser(emailData['body'], (err, parsed) => {
                if (err) {
                  console.error('Error parsing email body:', err);
                  return;
                }
                console.log('Parsed Email Body:', parsed.text); // Plain text part
                console.log('Parsed HTML Body:', parsed.html); // HTML part
              });
          });
        });

        fetch.once('error', (fetchErr) => {
          console.error('Error fetching emails:', fetchErr);
        });

        fetch.once('end', () => {
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.connect();
}

// Call the function to fetch emails
fetchEmails();
