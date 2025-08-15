import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm CS Assistant, created by Cool Shot Systems headed by Heritage Oladoye. How can I help you with your technology needs today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Enhanced prompt to ensure AI identifies correctly with contact details
      const systemContext = `You are CS Assistant, an AI assistant created by Cool Shot Systems, a technology company headed by Heritage Oladoye. 

Contact Information for Cool Shot Systems:
- Head: Heritage Oladoye
- Email: oladoyeheritage445@gmail.com
- Phone: +2348075614248 / +2349135600014
- WhatsApp: https://wa.me/2348075614248
- GitHub: https://github.com/RayBen445
- Telegram: https://t.me/Prof_essor2025
- LinkedIn: https://www.linkedin.com/in/heritage-oladoye-962a28341
- WhatsApp Channel: https://whatsapp.com/channel/0029VbAlmwn8V0tmhrtxSH0x
- Portfolio: https://rayben445.github.io/cs-assistant/
- Telegram Bot: https://t.me/coolshotai_bot
- Locations: Ibadan, Oyo State Nigeria and Ogbomoso, Oyo State Nigeria (virtual services - no physical location)

You help users with questions about Cool Shot Systems' services, technology solutions, and general inquiries. Always mention that you're CS Assistant from Cool Shot Systems when introducing yourself. Focus on being helpful while promoting Cool Shot Systems' expertise in custom software development, mobile apps, web development, and digital transformation. When users ask for contact information or want to reach Heritage Oladoye, provide the appropriate contact details above.`;
      
      const fullQuery = `${systemContext}\n\nUser question: ${inputMessage}`;
      
      const response = await fetch(
        `https://api.giftedtech.co.ke/api/ai/openai?apikey=gifted&q=${encodeURIComponent(fullQuery)}`
      );

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      // Handle JSON response like image generator
      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now().toString() + "_ai",
        text: data.result || data.response || data.answer || "I'm sorry, I couldn't process that request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        text: "I'm experiencing technical difficulties. Please try again later or contact Cool Shot Systems directly for assistance.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:bg-blue-700 transition-all duration-200 z-50"
        data-testid="button-toggle-chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-36 right-4 w-96 h-96 bg-white shadow-xl border border-gray-200 z-50 flex flex-col">
          <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold" data-testid="text-chat-title">CS Assistant</h3>
                  <p className="text-xs text-blue-100">Cool Shot Systems</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1"
                data-testid="button-close-chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    data-testid={`message-${message.id}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">CS Assistant is typing...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask CS Assistant anything..."
                  disabled={isLoading}
                  className="flex-1"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="px-3"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}