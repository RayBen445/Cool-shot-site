import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertContactInquirySchema } from '../../shared/schema';
import { z } from 'zod';

// In-memory storage for demo purposes
// In production, this should use a proper database like Neon
const contactInquiries: any[] = [];

// Contact notification service
interface ContactNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  service?: string | null;
  message: string;
}

async function sendContactNotification(data: ContactNotificationData): Promise<boolean> {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Create new contact inquiry
      const validatedData = insertContactInquirySchema.parse(req.body);
      
      const inquiry = {
        ...validatedData,
        id: Math.random().toString(36).substr(2, 9),
        company: validatedData.company || "",
        service: validatedData.service || "",
        createdAt: new Date(),
      };
      
      contactInquiries.push(inquiry);
      
      // Send notification (Telegram or console)
      await sendContactNotification(validatedData);
      
      return res.json({ success: true, inquiry });

    } else if (req.method === 'GET') {
      // Get all contact inquiries (for admin purposes)
      const sortedInquiries = contactInquiries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return res.json(sortedInquiries);

    } else {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid form data", 
        errors: error.errors 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: req.method === 'POST' ? "Failed to submit inquiry" : "Failed to fetch inquiries"
      });
    }
  }
}