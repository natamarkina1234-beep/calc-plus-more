interface CalculatorDisplayProps {
  expression: string;
  display: string;
}

const CalculatorDisplay = ({ expression, display }: CalculatorDisplayProps) => {
  const fontSize = display.length > 10 ? "text-3xl" : display.length > 7 ? "text-4xl" : "text-5xl";

  return (
    <div className="bg-calc-display rounded-2xl p-6 mb-4 min-h-[120px] flex flex-col justify-end items-end shadow-sm">
      <div className="text-muted-foreground text-sm font-mono h-6 truncate w-full text-right">
        {expression}
      </div>
      <div className={`font-mono font-semibold ${fontSize} text-foreground truncate w-full text-right mt-1 transition-all duration-150`}>
        {display}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
