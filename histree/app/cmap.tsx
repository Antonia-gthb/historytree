import { useState, useEffect } from 'react';
import Hue from '@uiw/react-color-hue';



interface ColorScaleProps {
    setEventColor: (color: string) => void; // Callback für das Setzen der Eventfarbe
  }
  const ColorScale: React.FC<ColorScaleProps> = ({ setEventColor }) => {
    const [hue, setHue] = useState(0); // Initialisiere den Hue-Wert mit 0 (Rot)
  
    const handleColorChange = (newHue: any) => {
      // Einfach den Farbton (h) direkt an den Graph übergeben
      const hexColor = `hsl(${newHue.h}, 100%, 50%)`; // Verwende HSL als einfache Darstellung
      setEventColor(hexColor); // Setze den Farbwert für den Graphen
      setHue(newHue.h); // Aktualisiere den Zustand des Farbtons
    };
      
  
    return (
      <div>
        <Hue
          hue={hue} // Der Schieberegler verwendet den aktuellen Hue-Wert
          onChange={handleColorChange} // Bei jeder Änderung des Farbtons wird die handleColorChange-Funktion aufgerufen
        />
      </div>
    );
  };
  
//const ColorScale: React.FC<ColorScaleProps> = ({ setEventColor }) => {
    //const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });

    //const handleColorChange = (newHue: any) => {
      // Überprüfe, ob die hex-Eigenschaft verfügbar ist und verwende sie
      //const hexColor = newHue.hex || `#${Math.round(newHue.color.rgb.r).toString(16).padStart(2, '0')}${Math.round(newHue.color.rgb.g).toString(16).padStart(2, '0')}${Math.round(newHue.color.rgb.b).toString(16).padStart(2, '0')}`;
      //setEventColor(hexColor); // Setze den Hex-Farbwert in die Elternkomponente
    //};
    
  //return (
    //<Hue
      //hue={hsva.h}
      //onChange={handleColorChange}
    ///>
  //);
//}
export default ColorScale;







