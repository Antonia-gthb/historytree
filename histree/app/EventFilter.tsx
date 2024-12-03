import { useState } from 'react';

interface Event {
    id: string;
    x: number;
    y: number;
  }

  const events: Event[] = [
    { id: 'Event A', x: 0, y: 1 },
    { id: 'Event B', x: 1, y: 2 },
    { id: 'Event C', x: 2, y: 3 },
    { id: 'Event D', x: 8, y: 9 },
  ];
  

const EventCheckboxes = () => {
    const [eventfilter, setEventFilter] = useState<Record<string, boolean>>({
        A: false,
        B: false,
        C: false,
        D: false
      });
    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;  // name ist die Event-ID, checked gibt an, ob die Checkbox angeklickt wurde
        setEventFilter((prevState) => ({
          ...prevState,  // Behält die vorherigen Auswahlwerte bei
          [name]: checked // Ändert nur das Event, das gerade verändert wurde
        }));
  };


return (
    <div className="mt-3">
    {events.map((Event) => (
        <div key={Event.id}>
            <label  className= "w-fit"> {Event.id} 
            <input
                className= "w-fit px-3"
                style={{marginLeft: '10px'}}
                type="checkbox"
                name={Event.id}
                checked= {eventfilter[Event.id]}
                onChange={handleEventChange}
                />
            </label>
        </div>
    ))}
    </div>
)};


export default EventCheckboxes;
    
