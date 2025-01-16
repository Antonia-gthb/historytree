
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
  strokeWidth = 1.5,
  eventColor,
}: {
  data: number[][];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  strokeWidth?: number;
  eventColor: string
}) {
  //const gx = useRef();
  //const gy = useRef();
  // interface GraphProps {
  //   eventColor: string; // Die ausgewählte Eventfarbe
  // }
  const gx = useRef<SVGGElement | null>(null);
  const gy = useRef<SVGGElement | null>(null);
  const x = d3.scaleLinear()
    .domain([Math.min(...data.map((d: number[]) => d[0])), Math.max(...data.map((d: number[]) => d[0]))])  // Skalierung auf Basis der X-Werte
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([Math.min(...data.map((d: number[]) => d[1])), Math.max(...data.map((d: number[]) => d[1]))])  // Skalierung auf Basis der Y-Werte
    .range([height - marginBottom, marginTop]);

  const line = d3.line()
    .x((d: [number, number]) => x(d[0]))  // X-Werte werden durch die x-Skalierung gemappt
    .y((d: [number, number]) => y(d[1]));

  //const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]); //x-Skalierung
  //const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]); //y-Skalierung, entent(data) gibt das Minimum und Maximum der Daten zurück
  //const line = d3.line((d, i) => x(i), y);  //erzeugt Pfad für Liniendiagramm
  useEffect(() => void d3.select(gx.current!).call(d3.axisBottom(x)), [gx, x]); {/* Achsen werden generiert, useEffect um Achsen nur dann zu rendern, wenn sie sich ändern */ }
  useEffect(() => void d3.select(gy.current!).call(d3.axisLeft(y)), [gy, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth={strokeWidth} d={line(data.map(x => [x[0], x[1]])) || undefined} />
      <g fill="white" stroke="currentColor" strokeWidth={strokeWidth}>
        {data.map((d, i) => (<circle key={i} cx={x(d[0])} cy={y(d[1])} r="2.5" fill={eventColor} />))}
      </g>
    </svg>
  );
}

export default function Plot({ cmap, scaling, threshold, selectedXValues, selectedYValues, eventColor }: { cmap: number, scaling: number, threshold: number, selectedXValues: Array<number>, selectedYValues: Array<number>, eventColor: string }) {
  //const data = Array.from({ length: 100 }, (_, i) => [i, cmap]);  Funktion übergibt Wert von cmap an Line-Plot Komponente
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, cmap].map(x => [x, x - 1]);
  console.log("Datenarray", data)
  //const thresholdData = data.filter(([x, y]) => y > threshold);
  //const thresholdData = data.filter(d => d > threshold);  //wieso d???
  const thresholdData = threshold >= 0
    ? data.filter((point) => point[1] > threshold) // Nur Y-Werte größer als threshold
    : data;
  const selectedData = selectedXValues.map((x, index) => [x, selectedYValues[index]]);



  if (selectedXValues.length > 0) {
    return (
      <div>
        <LinePlot data={selectedData} strokeWidth={scaling} eventColor={eventColor} />
      </div>
    )
  }
  else
    return (
      <div>
        <LinePlot data={thresholdData} strokeWidth={scaling} eventColor={eventColor} />
      </div>
    )
}






