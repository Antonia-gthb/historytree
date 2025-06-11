import { NumberInput } from "@/components/features/numberinput";

interface ThresholdProps {
  /** Aktueller Schwellwert */
  value: number;
  /** Wird aufgerufen, wenn der User den Wert ändert */
  onChange: (newValue: number) => void;
}

export default function Threshold({ value, onChange }: ThresholdProps) {

  return (
    <div>
           <NumberInput
        defaultValue={value}  
        onChange={onChange}   
      />
    </div>
  );
}
