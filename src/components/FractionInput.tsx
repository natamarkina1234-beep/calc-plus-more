interface FractionInputProps {
  num: string;
  den: string;
  onNumChange: (v: string) => void;
  onDenChange: (v: string) => void;
  label?: string;
}

const FractionInput = ({ num, den, onNumChange, onDenChange, label }: FractionInputProps) => {
  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || val === "-" || /^-?\d+$/.test(val)) {
      setter(val);
    }
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      {label && <span className="text-xs text-muted-foreground mb-1">{label}</span>}
      <input
        type="text"
        inputMode="numeric"
        value={num}
        onChange={handleChange(onNumChange)}
        placeholder="0"
        className="w-16 text-center bg-muted/50 border border-border rounded-lg px-2 py-1.5 font-mono text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="w-14 h-[2px] bg-foreground rounded-full" />
      <input
        type="text"
        inputMode="numeric"
        value={den}
        onChange={handleChange(onDenChange)}
        placeholder="1"
        className="w-16 text-center bg-muted/50 border border-border rounded-lg px-2 py-1.5 font-mono text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
};

export default FractionInput;
