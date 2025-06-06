import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface NumberInputProps {
    defaultValue?: number;
    min?: number;
    onChange?: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    defaultValue = 1,
    min = 1,
    onChange,
}) => {
    const [value, setValue] = useState<string>(
        defaultValue !== undefined ? defaultValue.toString() : ""
    );

    useEffect(() => {
        setValue(defaultValue.toString());
    }, [defaultValue]);

    const numericValue = (): number => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? min : Math.max(parsed, min);
    };

    const debouncedOnChange = useDebouncedCallback(
        (next: number) => onChange?.(next),
        500
    );

    const increment = () => {
        const next = numericValue() + 1;
        setValue(next.toString());
        debouncedOnChange(next);
    };

    const decrement = () => {
        const next = Math.max(numericValue() - 1, min);
        setValue(next.toString());
        debouncedOnChange(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input === "") {
            setValue("");
            return;
        }
        // Only numbers
        if (/^\d+$/.test(input)) {
            setValue(input);
            const parsed = parseInt(input, 10);
        }
    };

    return (
        <div className="inline-flex items-center space-x-2">
            <Button
                className="hover:border-none hover:bg-indigo-800 text-slate-700 hover:text-white"
                variant="outline"
                size="sm"
                onClick={decrement}
                disabled={numericValue() <= min}
            >
                <Minus size={16} />
            </Button>
            <Input
                type="text"
                className="w-16 text-center"
                value={value}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        debouncedOnChange(numericValue());
                        e.currentTarget.blur();  
                    }
                }}
            />
            <Button
                className="hover:border-none hover:bg-indigo-800 text-slate-700 hover:text-white"
                variant="outline"
                size="sm"
                onClick={increment}
                disabled={numericValue() > 4000}
            >
                <Plus size={16} />
            </Button>
        </div>
    );
};
