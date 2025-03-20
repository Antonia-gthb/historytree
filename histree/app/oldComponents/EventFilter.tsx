interface myEvent {
  id: string;
  x: number;
  y: number;
  checked: boolean;
}

const EventCheckboxes = ({
  events,
  setEvents
}: {
  events: myEvent[];
  setEvents: React.Dispatch<React.SetStateAction<myEvent[]>>;
}) => {

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;  // name ist die Event-ID, checked gibt an, ob die Checkbox angeklickt wurde
    console.log(name, checked);
    setEvents((prevState) =>
      prevState.map((Event) =>
        Event.id === name ? { ...Event, checked } : Event
      )
    );
  };

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
export type { myEvent };

