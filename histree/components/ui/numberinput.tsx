import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
    /** Initial value (>= 0) */
    defaultValue?: number;
    /** Minimum allowed value (default 0) */
    min?: number;
    /** Maximum allowed value (optional) */
    onChange?: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    defaultValue = 0,
    min = 0,
    onChange,
}) => {
    const [value, setValue] = useState<string>(
        defaultValue !== undefined ? defaultValue.toString() : ""
    );

    const numericValue = (): number => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? min : Math.max(parsed, min);
    };

    const increment = () => {
        const next = numericValue() + 1;
        setValue(next.toString());
        onChange?.(next);
    };

    const decrement = () => {
        const next = Math.max(numericValue() - 1, min);
        setValue(next.toString());
        onChange?.(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // Allow empty string to let user clear field
        if (input === "") {
            setValue("");
            return;
        }
        // Only numbers
        if (/^\d+$/.test(input)) {
            setValue(input);
            const parsed = parseInt(input, 10);
            onChange?.(Math.max(parsed, min));
        }
    };

    return (
        <div className="inline-flex items-center space-x-2">
            <Button
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
                placeholder=""
            />
            <Button
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
