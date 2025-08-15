// Email service utility
interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  try {
    // Option 1: EmailJS (Frontend-based, no API key needed)
    // This can be implemented on the frontend using EmailJS service
    
    // Option 2: Simple webhook to external service
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'oladoyeheritage445@gmail.com',
          subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
            <p><strong>Service:</strong> ${data.service || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p><em>Sent from Cool Shot Systems website contact form</em></p>
          `
        })
      });
      
      return response.ok;
    }

    // Option 3: Log to console for now (development)
    console.log('📧 New Contact Form Submission:');
    console.log(`Name: ${data.firstName} ${data.lastName}`);
    console.log(`Email: ${data.email}`);
    console.log(`Company: ${data.company || 'Not provided'}`);
    console.log(`Service: ${data.service || 'Not provided'}`);
    console.log(`Message: ${data.message}`);
    console.log('---');
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}