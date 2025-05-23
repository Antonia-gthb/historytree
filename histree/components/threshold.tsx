import { NumberInput } from "@/components/ui/numberinput";

export default function Threshold() {
  const handleChange = (newValue: number) => {
    console.log("Aktueller Wert:", newValue);
  };

  return (
    <div className="p-4">
      <NumberInput defaultValue={0} min={0} onChange={handleChange} />
    </div>
  );
}
