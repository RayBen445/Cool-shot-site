"use client";

import { useState } from "react";
import { redeemCode } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Gift, Check } from "lucide-react";

export default function RedeemCodeModal({ onSuccess, onClose }: { onSuccess?: () => void; onClose?: () => void }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const { toast } = useToast();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a redemption code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await redeemCode("", code.trim().toUpperCase());
      
      setIsRedeemed(true);
      toast({
        title: "Success",
        description: `You received ${result.creditsAdded} credits!`,
      });

      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRedeemed) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-center">Code Redeemed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-300">Your credits have been added to your account.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="w-5 h-5 mr-2 text-purple-400" />
          Redeem Code
        </CardTitle>
        <CardDescription className="text-gray-400">Enter a redemption code to get credits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter redemption code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          disabled={isLoading}
        />
        <Button
          onClick={handleRedeem}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? "Redeeming..." : "Redeem"}
        </Button>
      </CardContent>
    </Card>
  );
}
