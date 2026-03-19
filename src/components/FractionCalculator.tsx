import { useState } from "react";
import FractionInput from "./FractionInput";
import { Fraction, fractionOp, simplify, toMixed, fractionToString, gcd } from "@/lib/calculator";
import { cn } from "@/lib/utils";

const operators = ["+", "−", "×", "÷"];

const FractionCalculator = () => {
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [operator, setOperator] = useState("+");
  const [result, setResult] = useState<Fraction | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [error, setError] = useState("");

  const calc = () => {
    setError("");
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    if (d1 === 0 || d2 === 0) {
      setError("Denominator cannot be zero");
      setResult(null);
      return;
    }
    if (operator === "÷" && n2 === 0) {
      setError("Cannot divide by zero");
      setResult(null);
      return;
    }

    const a: Fraction = { num: n1, den: d1 };
    const b: Fraction = { num: n2, den: d2 };
    setResult(fractionOp(a, b, operator));
  };

  const mixed = result ? toMixed(result) : null;
  const simplified = result ? simplify(result) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <FractionInput num={num1} den={den1} onNumChange={setNum1} onDenChange={setDen1} label="Fraction A" />

          <div className="flex flex-col gap-1">
            {operators.map(op => (
              <button
                key={op}
                onClick={() => setOperator(op)}
                className={cn(
                  "w-10 h-10 rounded-xl text-lg font-medium calc-btn-press",
                  op === operator
                    ? "bg-calc-operator text-calc-operator-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                )}
              >
                {op}
              </button>
            ))}
          </div>

          <FractionInput num={num2} den={den2} onNumChange={setNum2} onDenChange={setDen2} label="Fraction B" />
        </div>

        <button
          onClick={calc}
          className="w-full mt-6 bg-primary text-primary-foreground rounded-2xl py-3 text-lg font-medium calc-btn-press hover:opacity-90"
        >
          Calculate
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-center text-sm font-medium animate-slide-up">
          {error}
        </div>
      )}

      {result && !isNaN(result.num) && (
        <div className="bg-card rounded-2xl p-6 shadow-sm animate-slide-up space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Result</h3>
          
          {/* Visual fraction result */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-muted-foreground">=</span>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl font-semibold text-foreground">{simplified!.num}</span>
              {simplified!.den !== 1 && (
                <>
                  <div className="w-12 h-[2px] bg-foreground rounded-full" />
                  <span className="font-mono text-2xl font-semibold text-foreground">{simplified!.den}</span>
                </>
              )}
            </div>
            {mixed && mixed.num !== 0 && simplified!.den !== 1 && (
              <span className="text-muted-foreground text-sm ml-4">
                = {mixed.whole !== 0 && `${mixed.whole} `}{mixed.num}/{mixed.den}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-sm text-primary hover:underline"
            >
              {showSteps ? "Hide steps" : "Show steps"}
            </button>
            <span className="font-mono text-sm text-muted-foreground">
              ≈ {(simplified!.num / simplified!.den).toFixed(6)}
            </span>
          </div>

          {showSteps && (
            <div className="bg-muted/50 rounded-xl p-4 text-sm font-mono space-y-1 animate-fade-in text-foreground">
              <p>Step 1: {num1 || 0}/{den1 || 1} {operator} {num2 || 0}/{den2 || 1}</p>
              {(operator === "+" || operator === "−") && (
                <>
                  <p>Step 2: Find common denominator = {(parseInt(den1) || 1) * (parseInt(den2) || 1)}</p>
                  <p>Step 3: {operator === "+" ? "Add" : "Subtract"} numerators</p>
                </>
              )}
              {operator === "×" && <p>Step 2: Multiply num×num and den×den</p>}
              {operator === "÷" && <p>Step 2: Multiply by reciprocal</p>}
              <p>Final: Simplify using GCD({Math.abs(result.num * (simplified!.den / result.den))}, {result.den * (simplified!.den / result.den)}) → {fractionToString(simplified!)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FractionCalculator;
