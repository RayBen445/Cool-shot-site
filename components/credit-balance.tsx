"use client";

import { useState, useEffect } from "react";
import { getUserCredits, getCreditHistory } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingDown, Gift, Minus } from "lucide-react";

interface CreditTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  created_at: string;
}

export default function CreditBalance({ userId }: { userId: string }) {
  const [credits, setCredits] = useState<any>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCreditsAndHistory();
  }, [userId]);

  const loadCreditsAndHistory = async () => {
    try {
      const creditData = await getUserCredits(userId);
      setCredits(creditData);

      const historyData = await getCreditHistory(userId, 10);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load credits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Credits Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deployment":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case "redeem":
        return <Gift className="w-4 h-4 text-green-400" />;
      case "admin_grant":
        return <Gift className="w-4 h-4 text-blue-400" />;
      case "admin_deduct":
        return <Minus className="w-4 h-4 text-red-400" />;
      default:
        return <Zap className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "deployment":
        return "Deployment Cost";
      case "redeem":
        return "Redeemed Code";
      case "admin_grant":
        return "Admin Grant";
      case "admin_deduct":
        return "Admin Deduction";
      default:
        return "Transaction";
    }
  };

  return (
    <div className="space-y-4">
      {/* Credit Balance Card */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-600/50 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {credits?.unlimited ? "∞" : credits?.credits || 0}
          </div>
          <p className="text-gray-400 mt-2">
            {credits?.unlimited ? "Unlimited credits" : "Credits available for deployments"}
          </p>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {history.length > 0 && (
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">Your last 10 credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div className="min-w-0">
                      <p className="font-medium text-sm">
                        {getTransactionLabel(transaction.transaction_type)}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-gray-400 truncate">{transaction.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.created_at).toLocaleDateString()} {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    transaction.amount > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
