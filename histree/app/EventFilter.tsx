import { useState, useEffect } from 'react';


const EventCheckboxes = () => {
  const [events, setEvents] = useState<Array<{id: string; x: number; y: number; checked: boolean}>>([
    { id: 'Event A', x: 0, y: 1, checked: false },
    { id: 'Event B', x: 1, y: 2, checked: false },
    { id: 'Event C', x: 2, y: 3, checked: false },
    { id: 'Event D', x: 8, y: 9, checked: false },
  ]);


  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;  // name ist die Event-ID, checked gibt an, ob die Checkbox angeklickt wurde
    setEvents((prevState) =>
      prevState.map((Event) =>
        Event.id === name ? { ...Event, checked } : Event
      )
    );
  };

  const selectedEvents= events
    .filter(Event => Event.checked);

  useEffect(() => {
    console.log("Uebersicht Events", events);
    console.log ("Ausgewählte Events", selectedEvents)
  }, [events],);


  return (
    <div className="mt-3">
      {events.map((Event) => (
        <div key={Event.id}>
          <label className="w-fit"> {Event.id}
            <input
              className="w-fit px-3"
              style={{ marginLeft: '10px' }}
              type="checkbox"
              name={Event.id}
              checked={Event.checked}
              onChange={handleEventChange}
            />
          </label>
        </div>
      ))}
    </div>
  )
};


export default EventCheckboxes;

