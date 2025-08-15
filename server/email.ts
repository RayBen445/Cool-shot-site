// Contact notification service
interface ContactNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  service?: string | null;
  message: string;
}

export async function sendContactNotification(data: ContactNotificationData): Promise<boolean> {
  try {
    // Send to Telegram Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const telegramMessage = `
🔔 *New Contact Form Submission*

👤 *Name:* ${data.firstName} ${data.lastName}
📧 *Email:* ${data.email}
🏢 *Company:* ${data.company || 'Not provided'}
🛠 *Service:* ${data.service || 'Not provided'}

💬 *Message:*
${data.message}

---
_From Cool Shot Systems website_
      `.trim();

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown'
        })
      });
      
      if (response.ok) {
        console.log('✅ Telegram notification sent successfully');
        return true;
      } else {
        console.error('❌ Telegram notification failed:', await response.text());
      }
    }

    // Fallback: Log to console
    console.log('📧 New Contact Form Submission:');
    console.log(`Name: ${data.firstName} ${data.lastName}`);
    console.log(`Email: ${data.email}`);
    console.log(`Company: ${data.company || 'Not provided'}`);
    console.log(`Service: ${data.service || 'Not provided'}`);
    console.log(`Message: ${data.message}`);
    console.log('---');
    
    return true;
  } catch (error) {
    console.error('Contact notification failed:', error);
    return false;
  }
}