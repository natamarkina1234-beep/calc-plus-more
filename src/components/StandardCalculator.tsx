import { useCallback, useEffect, useReducer, useState } from "react";
import CalculatorDisplay from "./CalculatorDisplay";
import Keypad from "./Keypad";
import CalculationHistory from "./CalculationHistory";
import { calculate, formatNumber, HistoryEntry, initialState, CalculatorState } from "@/lib/calculator";

type Action = { type: "INPUT"; value: string };

function reducer(state: CalculatorState, action: Action): CalculatorState {
  const { value } = action;

  if (value === "AC") return initialState;

  if (value === "±") {
    const num = parseFloat(state.display);
    return { ...state, display: formatNumber(-num) };
  }

  if (value === "%") {
    const num = parseFloat(state.display);
    return { ...state, display: formatNumber(num / 100) };
  }

  if (["+", "−", "×", "÷"].includes(value)) {
    if (state.operator && !state.waitingForOperand) {
      const prev = parseFloat(state.previousValue!);
      const curr = parseFloat(state.display);
      const result = calculate(prev, curr, state.operator);
      return {
        display: formatNumber(result),
        previousValue: String(result),
        operator: value,
        waitingForOperand: true,
        expression: `${formatNumber(result)} ${value}`,
      };
    }
    return {
      ...state,
      previousValue: state.display,
      operator: value,
      waitingForOperand: true,
      expression: `${state.display} ${value}`,
    };
  }

  if (value === "=") {
    if (!state.operator || !state.previousValue) return state;
    const prev = parseFloat(state.previousValue);
    const curr = parseFloat(state.display);
    const result = calculate(prev, curr, state.operator);
    const expr = `${state.previousValue} ${state.operator} ${state.display}`;
    return {
      display: formatNumber(result),
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      expression: `${expr} =`,
    };
  }

  if (value === ".") {
    if (state.waitingForOperand) {
      return { ...state, display: "0.", waitingForOperand: false };
    }
    if (state.display.includes(".")) return state;
    return { ...state, display: state.display + "." };
  }

  // Number input
  if (state.waitingForOperand) {
    return { ...state, display: value, waitingForOperand: false };
  }
  return {
    ...state,
    display: state.display === "0" ? value : state.display + value,
  };
}

const StandardCalculator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("calc-history") || "[]");
    } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const prevExpression = useState(state.expression);

  // Save to history when = is pressed
  useEffect(() => {
    if (state.expression.endsWith("=") && state.expression !== prevExpression[0]) {
      const entry: HistoryEntry = {
        expression: state.expression.replace(" =", ""),
        result: state.display,
        timestamp: Date.now(),
      };
      setHistory(prev => {
        const next = [...prev, entry];
        localStorage.setItem("calc-history", JSON.stringify(next));
        return next;
      });
      prevExpression[0] = state.expression;
    }
  }, [state.expression, state.display]);

  const handleInput = useCallback((value: string) => {
    dispatch({ type: "INPUT", value });
  }, []);

  // Keyboard support
  useEffect(() => {
    const keyMap: Record<string, string> = {
      "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
      "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
      ".": ".", "+": "+", "-": "−", "*": "×", "/": "÷",
      Enter: "=", "=": "=", Backspace: "AC", Escape: "AC", "%": "%",
    };
    const handler = (e: KeyboardEvent) => {
      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        handleInput(mapped);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleInput]);

  return (
    <div className="space-y-4 animate-fade-in">
      <CalculatorDisplay expression={state.expression} display={state.display} />
      <Keypad onInput={handleInput} />
      <div className="pt-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center py-2"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
        {showHistory && (
          <div className="animate-slide-up mt-2">
            <CalculationHistory
              history={history}
              onClear={() => {
                setHistory([]);
                localStorage.removeItem("calc-history");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardCalculator;
