import { useState } from "react";
import { dateDifference } from "@/lib/calculator";
import { CalendarDays } from "lucide-react";

const DateCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("00:00");
  const [includeTime, setIncludeTime] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof dateDifference> | null>(null);
  const [error, setError] = useState("");

  const calc = () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    const start = new Date(includeTime ? `${startDate}T${startTime}` : `${startDate}T00:00:00`);
    const end = new Date(includeTime ? `${endDate}T${endTime}` : `${endDate}T00:00:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Invalid date(s)");
      return;
    }

    setResult(dateDifference(start, end, excludeWeekends));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {includeTime && (
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full mt-2 bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {includeTime && (
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full mt-2 bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={includeTime}
              onChange={e => setIncludeTime(e.target.checked)}
              className="rounded accent-primary"
            />
            Include time
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={e => setExcludeWeekends(e.target.checked)}
              className="rounded accent-primary"
            />
            Exclude weekends
          </label>
        </div>

        <button
          onClick={calc}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-3 text-lg font-medium calc-btn-press hover:opacity-90"
        >
          Calculate Difference
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-center text-sm font-medium animate-slide-up">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-card rounded-2xl p-6 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Difference</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Days", value: result.days },
              { label: "Hours", value: result.hours },
              { label: "Minutes", value: result.minutes },
              { label: "Seconds", value: result.seconds },
            ].map(item => (
              <div key={item.label} className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-bold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          {excludeWeekends && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              * Weekends excluded from day count
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateCalculator;
