import { useState } from 'react';
import Hue from '@uiw/react-color-hue';

interface ColorScaleProps {
  setEventColor: (color: string) => void; // Callback für das Setzen der Eventfarbe
}
const ColorScale: React.FC<ColorScaleProps> = ({ setEventColor }) => {
  const [hue, setHue] = useState(0); // Initialisiere den Hue-Wert mit 0 (Rot)

  const handleColorChange = (newHue: { h: number }) => {
    // Einfach den Farbton (h) direkt an den Graph übergeben
    const hexColor = `hsl(${newHue.h}, 100%, 50%)`; // Verwende HSL als einfache Darstellung
    setEventColor(hexColor); // Setze den Farbwert für den Graphen
    setHue(newHue.h); // Aktualisiere den Zustand des Farbtons
  };


  return (
    <div style={{ width: '200px', height: 'auto' }}>
      <Hue
        hue={hue} // Der Schieberegler verwendet den aktuellen Hue-Wert
        onChange={handleColorChange} // Bei jeder Änderung des Farbtons wird die handleColorChange-Funktion aufgerufen
      />
    </div>
  );
};


export default ColorScale;







