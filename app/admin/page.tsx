"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isUserAdmin, createRedemptionCode, getRedemptionCodes, deactivateRedemptionCode, createAdminNotification, getUserCredits, adminGrantCredits, adminDeductCredits, getCreditHistory } from "@/lib/db";
import { Plus, Copy, Trash2, Bell, Users, Zap, LogOut } from "lucide-react";

interface RedemptionCode {
  id: string;
  code: string;
  credits: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

interface UserCredit {
  user_id: string;
  credits: number;
  unlimited: boolean;
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<RedemptionCode[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [codeCredits, setCodeCredits] = useState("5");
  const [codeMaxUses, setCodeMaxUses] = useState("1");
  const [codeExpiry, setCodeExpiry] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"info" | "warning" | "error" | "success">("info");

  const [targetUserId, setTargetUserId] = useState("");
  const [userCredits, setUserCredits] = useState<UserCredit | null>(null);
  const [creditAmount, setCreditAmount] = useState("5");
  const [creditReason, setCreditReason] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUserId(session.user.id);
        const admin = await isUserAdmin(session.user.id);
        
        if (!admin) {
          router.push("/account");
          return;
        }

        setIsAdmin(true);
        await loadRedemptionCodes();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const loadRedemptionCodes = async () => {
    try {
      const allCodes = await getRedemptionCodes();
      setCodes(allCodes);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load redemption codes",
        variant: "destructive",
      });
    }
  };

  const handleCreateCode = async () => {
    if (!userId) return;

    try {
      const newCode = await createRedemptionCode(
        userId,
        parseInt(codeCredits),
        parseInt(codeMaxUses),
        codeExpiry || undefined
      );

      setCodes([newCode as RedemptionCode, ...codes]);
      setCodeCredits("5");
      setCodeMaxUses("1");
      setCodeExpiry("");

      toast({
        title: "Code Created",
        description: `New code: ${newCode.code}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeactivateCode = async (codeId: string) => {
    try {
      await deactivateRedemptionCode(codeId);
      setCodes(codes.map(c => c.id === codeId ? { ...c, is_active: false } : c));
      toast({
        title: "Code Deactivated",
        description: "The redemption code is no longer active",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateNotification = async () => {
    if (!userId || !notifTitle || !notifMessage) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAdminNotification(
        userId,
        notifTitle,
        notifMessage,
        notifType,
        []
      );

      setNotifTitle("");
      setNotifMessage("");
      setNotifType("info");

      toast({
        title: "Notification Sent",
        description: "All users have been notified",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGrantCredits = async () => {
    if (!targetUserId || !creditAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminGrantCredits(targetUserId, parseInt(creditAmount), creditReason || undefined);
      
      setTargetUserId("");
      setCreditAmount("5");
      setCreditReason("");

      toast({
        title: "Credits Granted",
        description: `${creditAmount} credits granted to user`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeductCredits = async () => {
    if (!targetUserId || !creditAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminDeductCredits(targetUserId, parseInt(creditAmount), creditReason || undefined);
      
      setTargetUserId("");
      setCreditAmount("5");
      setCreditReason("");

      toast({
        title: "Credits Deducted",
        description: `${creditAmount} credits deducted from user`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLookupUser = async () => {
    if (!targetUserId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const credits = await getUserCredits(targetUserId);
      setUserCredits(credits);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "User not found or error loading credits",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage CSSLab platform</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-600/20 border-red-600/50 hover:bg-red-600/30 text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="codes" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="codes" className="data-[state=active]:bg-blue-600">
              <Zap className="w-4 h-4 mr-2" />
              Redemption Codes
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              User Credits
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Redemption Codes Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Create Redemption Code</CardTitle>
                <CardDescription className="text-gray-400">Generate a new redemption code for users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Credits</label>
                    <Input
                      type="number"
                      min="1"
                      value={codeCredits}
                      onChange={(e) => setCodeCredits(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Uses</label>
                    <Input
                      type="number"
                      min="1"
                      value={codeMaxUses}
                      onChange={(e) => setCodeMaxUses(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expires (Optional)</label>
                    <Input
                      type="date"
                      value={codeExpiry}
                      onChange={(e) => setCodeExpiry(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateCode}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Code
                </Button>
              </CardContent>
            </Card>

            {/* Active Codes */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Active Codes</CardTitle>
                <CardDescription className="text-gray-400">{codes.filter(c => c.is_active).length} active codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {codes.filter(c => c.is_active).map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex-1">
                        <div className="font-mono text-sm font-medium">{code.code}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {code.credits} credits • Used {code.current_uses}/{code.max_uses}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(code.code)}
                          className={`bg-gray-700 border-gray-600 hover:bg-gray-600 ${
                            copiedCode === code.code ? "bg-green-600/30 border-green-600/50" : ""
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeactivateCode(code.id)}
                          className="bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Manage User Credits</CardTitle>
                <CardDescription className="text-gray-400">Grant or deduct credits from users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User ID</label>
                  <div className="flex gap-2">
                    <Input
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                      placeholder="Enter user ID"
                    />
                    <Button
                      onClick={handleLookupUser}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Lookup
                    </Button>
                  </div>
                </div>

                {userCredits && (
                  <div className="p-3 bg-blue-600/10 border border-blue-600/50 rounded">
                    <p className="text-sm text-blue-400">
                      Current Balance: <span className="font-bold text-lg">{userCredits.unlimited ? "∞" : userCredits.credits} credits</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <Input
                      type="number"
                      min="1"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
                    <Input
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Reason for adjustment"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleGrantCredits}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Grant Credits
                  </Button>
                  <Button
                    onClick={handleDeductCredits}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Deduct Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Send System Notification</CardTitle>
                <CardDescription className="text-gray-400">Broadcast updates to all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Notification message"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                  </select>
                </div>

                <Button
                  onClick={handleCreateNotification}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
