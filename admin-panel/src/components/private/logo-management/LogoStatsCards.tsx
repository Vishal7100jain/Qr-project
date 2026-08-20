"use client";

import { GetLogoManagementAnalysisAction } from "@/action/logoManagementAction/logoManagementAction";
import { Card } from "@/components/ui/card";
import { BarChart3, CheckCircle, Percent, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ILogoSummary {
  totalStocks: number;
  stocksWithLogo: number;
  stocksWithoutLogo: number;
  logoCompletionPercentage: string;
}

const LogoStatsCards: React.FC = () => {
  const [summary, setSummary] = useState<ILogoSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const response = await GetLogoManagementAnalysisAction({
        page: 1,
        pageSize: 1,
      });
      if (response?.status === "success" && response?.data?.summary) {
        setSummary(response?.data?.summary);
      }
      setLoading(false);
    };
    fetchSummary();
  }, []);

  const stats = [
    {
      title: "Total Stocks",
      value: summary?.totalStocks || "0",
      icon: <BarChart3 className="w-5 h-5 text-[#44c8ec]" />,
    },
    {
      title: "With Logo",
      value: summary?.stocksWithLogo || "0",
      icon: <CheckCircle className="w-5 h-5 text-[#748cf8]" />,
    },
    {
      title: "Without Logo",
      value: summary?.stocksWithoutLogo || "0",
      icon: <XCircle className="w-5 h-5 text-[#0c6178]" />,
    },
    {
      title: "Completion",
      value: summary?.logoCompletionPercentage || "0%",
      icon: <Percent className="w-5 h-5 text-[#a18267]" />,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="h-24 rounded-2xl border border-[#b3c2ce] animate-pulse bg-gray-100 dark:bg-gray-800"
          ></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="rounded-xl border shadow-sm p-3 bg-white dark:bg-[#101828] hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-white/[0.05]"
        >
          {/* top row with icon + title */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-full border border-[#b3c2ce] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-800">
                {stat.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#4b494c] dark:text-gray-200">
                {stat.title}
              </h3>
            </div>

            <p className="text-xl font-bold text-brand-500 mr-2">
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LogoStatsCards;
