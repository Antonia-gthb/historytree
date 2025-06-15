import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface ThresholdProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
}

export default function Threshold({ value, onChange, min = 1 }: ThresholdProps) {
  const [input, setInput] = useState(value.toString());

  useEffect(() => {
    setInput(value.toString());
  }, [value]);

  const numericValue = () => {
    const parsed = parseInt(input, 10);
    return isNaN(parsed) ? min : Math.max(parsed, min);
  };

  const debouncedChange = useDebouncedCallback((next: number) => {
    onChange(next);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "") {
      setInput("");
      return;
    }
    if (/^\d+$/.test(input)) {
      setInput(input);
      const parsed = parseInt(input, 10);
    }
  };

  const increment = () => {
    const next = numericValue() + 1;
    setInput(next.toString());
    debouncedChange(next);
  };

  const decrement = () => {
    const next = Math.max(numericValue() - 1, min);
    setInput(next.toString());
    debouncedChange(next);
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <Button className="hover:border-none hover:bg-indigo-800 text-slate-700 hover:text-white"
        onClick={decrement} variant="outline" size="sm" disabled={numericValue() <= min}>
        <Minus size={16} />
      </Button>
      <Input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            debouncedChange(numericValue());
            e.currentTarget.blur();
          }
        }}
        className="w-16 text-center"
      />
      <Button className="hover:border-none hover:bg-indigo-800 text-slate-700 hover:text-white"
        onClick={increment} variant="outline" size="sm" disabled={numericValue() > 3000}>
        <Plus size={16} />
      </Button>
    </div>
  );
}

