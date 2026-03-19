import { useState } from "react";
import { cn } from "@/lib/utils";
import StandardCalculator from "@/components/StandardCalculator";
import FractionCalculator from "@/components/FractionCalculator";
import DateCalculator from "@/components/DateCalculator";
import ThemeToggle from "@/components/ThemeToggle";
import { Calculator, Divide, CalendarDays } from "lucide-react";

const tabs = [
  { id: "standard", label: "Standard", icon: Calculator },
  { id: "fraction", label: "Fraction", icon: Divide },
  { id: "date", label: "Date", icon: CalendarDays },
] as const;

type TabId = typeof tabs[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("standard");

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">Advanced Calculator</h1>
          <ThemeToggle />
        </div>

        {/* Tab Switcher */}
        <div className="bg-muted rounded-2xl p-1 flex gap-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Calculator Content */}
        {activeTab === "standard" && <StandardCalculator />}
        {activeTab === "fraction" && <FractionCalculator />}
        {activeTab === "date" && <DateCalculator />}
      </div>
    </div>
  );
};

export default Index;
