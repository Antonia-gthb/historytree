<span className="text-black mr-4">Scale edges by weight</span>
</div>
<div className="flex items-center mt-2">
  <span className="text-black font-bold mr-4">Scaling:</span>
  <div className="flex items-center">
    <input
      type="range" min="1" max="10" value={scaleFactor} className="w-fit" onChange={(e) => setScaleFactor(Number(e.target.value))}
      disabled={!scaling}
    />
    <span className='px-3'> {scaleFactor} </span>
    


    <div className="flex flex-col mt-6"> {/* Scaling */}
        <div>
          <input
            type="checkbox"
            checked={scaling}
            onChange={onScalingChange}
            className="w-4 h-4 border cursor-pointer mr-2"
          />

          const [scaling, setScaling] = useState(false);
          const onScalingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setScaling(e.target.checked);
          };