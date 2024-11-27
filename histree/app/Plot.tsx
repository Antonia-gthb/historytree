
import * as d3 from "d3";
import { useRef, useEffect } from "react";

export function LinePlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
  strokeWidth= 1.5,
}) {
  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]); //x-Skalierung
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]); //y-Skalierung, entent(data) gibt das Minimum und Maximum der Daten zurück
  const line = d3.line((d, i) => x(i), y);  //erzeugt Pfad für Liniendiagramm
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]); {/* Achsen werden generiert, useEffect um Achsen nur dann zu rendern, wenn sie sich ändern */}
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />  
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth={strokeWidth} d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth={strokeWidth}>
        {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
      </g>
    </svg>
  );
}

export default function Plot ({ cmap, scaling, threshold }: { cmap: number, scaling: number, threshold:number }){
  //const data = Array.from({ length: 100 }, (_, i) => [i, cmap]);  Funktion übergibt Wert von cmap an Line-Plot Komponente
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, cmap];
  const thresholdData = data.filter(d => d > threshold);


  return (
    <div>
      <LinePlot data={thresholdData} strokeWidth={scaling}/>
    </div>
  )
}
