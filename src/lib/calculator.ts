// Standard calculator logic
export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operator: string | null;
  waitingForOperand: boolean;
  expression: string;
}

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export const initialState: CalculatorState = {
  display: "0",
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  expression: "",
};

export function calculate(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? NaN : a / b;
    default: return b;
  }
}

export function formatNumber(n: number): string {
  if (isNaN(n)) return "Error";
  if (!isFinite(n)) return "Error";
  const str = String(n);
  if (str.length > 12) {
    return n.toExponential(6);
  }
  return str;
}

// Fraction logic
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export interface Fraction {
  num: number;
  den: number;
}

export function simplify(f: Fraction): Fraction {
  if (f.den === 0) return { num: NaN, den: 0 };
  if (f.num === 0) return { num: 0, den: 1 };
  const g = gcd(Math.abs(f.num), Math.abs(f.den));
  let num = f.num / g;
  let den = f.den / g;
  if (den < 0) { num = -num; den = -den; }
  return { num, den };
}

export function fractionOp(a: Fraction, b: Fraction, op: string): Fraction {
  switch (op) {
    case "+": return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den });
    case "−": return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den });
    case "×": return simplify({ num: a.num * b.num, den: a.den * b.den });
    case "÷": return simplify({ num: a.num * b.den, den: a.den * b.num });
    default: return a;
  }
}

export function toMixed(f: Fraction): { whole: number; num: number; den: number } {
  const s = simplify(f);
  if (s.den === 0) return { whole: NaN, num: 0, den: 0 };
  const whole = Math.trunc(s.num / s.den);
  const num = Math.abs(s.num % s.den);
  return { whole, num, den: s.den };
}

export function fractionToString(f: Fraction): string {
  const s = simplify(f);
  if (isNaN(s.num)) return "Error";
  if (s.den === 1) return String(s.num);
  return `${s.num}/${s.den}`;
}

// Date calculator logic
export function dateDifference(
  start: Date,
  end: Date,
  excludeWeekends: boolean
): { days: number; hours: number; minutes: number; seconds: number; totalDays: number } {
  let diffMs = end.getTime() - start.getTime();
  const totalSeconds = Math.abs(Math.floor(diffMs / 1000));
  
  let totalDays: number;
  if (excludeWeekends) {
    totalDays = countBusinessDays(start, end);
  } else {
    totalDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  const days = totalDays;
  const remainderMs = Math.abs(diffMs) % (1000 * 60 * 60 * 24);
  const hours = Math.floor(remainderMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainderMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalDays };
}

function countBusinessDays(start: Date, end: Date): number {
  let [s, e] = start < end ? [new Date(start), new Date(end)] : [new Date(end), new Date(start)];
  let count = 0;
  const current = new Date(s);
  while (current < e) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}
