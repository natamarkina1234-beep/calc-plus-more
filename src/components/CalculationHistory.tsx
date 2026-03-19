import { HistoryEntry } from "@/lib/calculator";
import { Clock, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CalculationHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

const CalculationHistory = ({ history, onClear }: CalculationHistoryProps) => {
  const copyResult = (entry: HistoryEntry) => {
    navigator.clipboard.writeText(entry.result);
    toast.success("Copied to clipboard");
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-sm">No history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">History</h3>
        <button onClick={onClear} className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {history.slice().reverse().map((entry, i) => (
          <div
            key={i}
            className="bg-muted/50 rounded-xl p-3 flex items-center justify-between group animate-fade-in"
          >
            <div className="font-mono text-sm">
              <div className="text-muted-foreground text-xs">{entry.expression}</div>
              <div className="text-foreground font-semibold">= {entry.result}</div>
            </div>
            <button
              onClick={() => copyResult(entry)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculationHistory;
