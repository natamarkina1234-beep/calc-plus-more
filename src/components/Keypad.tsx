import { cn } from "@/lib/utils";

interface KeypadProps {
  onInput: (value: string) => void;
}

type ButtonType = "number" | "operator" | "function" | "equals";

interface KeyConfig {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}

const keys: KeyConfig[] = [
  { label: "AC", value: "AC", type: "function" },
  { label: "±", value: "±", type: "function" },
  { label: "%", value: "%", type: "function" },
  { label: "÷", value: "÷", type: "operator" },
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "×", value: "×", type: "operator" },
  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "−", value: "−", type: "operator" },
  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "+", value: "+", type: "operator" },
  { label: "0", value: "0", type: "number", span: 2 },
  { label: ".", value: ".", type: "number" },
  { label: "=", value: "=", type: "equals" },
];

const typeStyles: Record<ButtonType, string> = {
  number: "bg-calc-number text-calc-number-foreground hover:opacity-80",
  operator: "bg-calc-operator text-calc-operator-foreground hover:opacity-80",
  function: "bg-calc-function text-calc-function-foreground hover:opacity-80",
  equals: "bg-calc-equals text-calc-equals-foreground hover:opacity-80",
};

const Keypad = ({ onInput }: KeypadProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {keys.map((key) => (
        <button
          key={key.value}
          onClick={() => onInput(key.value)}
          className={cn(
            "calc-btn-press rounded-2xl h-16 text-xl font-medium select-none",
            "focus:outline-none focus:ring-2 focus:ring-ring/50",
            "shadow-sm",
            typeStyles[key.type],
            key.span === 2 && "col-span-2"
          )}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
};

export default Keypad;
