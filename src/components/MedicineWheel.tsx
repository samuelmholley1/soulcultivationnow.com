'use client';

interface WheelData {
  water: number;  // 1, 6
  nature: number; // 3, 8
  fire: number;   // 2, 7
  mineral: number; // 4, 9
  earth: number;  // 0, 5
}

interface MedicineWheelProps {
  data: WheelData;
}

export function MedicineWheel({ data }: MedicineWheelProps) {
  const size = 400;
  const center = size / 2;
  const radius = 140;
  
  // Element positions (clockwise from top)
  const elements = [
    { name: 'WATER', value: data.water, color: '#4299E1', angle: -90 }, // Top
    { name: 'NATURE', value: data.nature, color: '#48BB78', angle: 0 }, // Right
    { name: 'FIRE', value: data.fire, color: '#F56565', angle: 90 }, // Bottom
    { name: 'MINERAL', value: data.mineral, color: '#A0AEC0', angle: 180 }, // Left
  ];
  
  // Calculate position for each element
  const getPosition = (angle: number, distance: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian),
    };
  };

  return (
    <div className="flex justify-center items-center p-8">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full h-auto">
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={radius + 20}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="2"
        />
        
        {/* Center circle (EARTH) */}
        <circle
          cx={center}
          cy={center}
          r={60}
          fill="#D69E2E"
          opacity="0.2"
          stroke="#D69E2E"
          strokeWidth="3"
        />
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="font-['Jost',sans-serif] font-bold"
          fontSize="16"
          fill="#744210"
        >
          EARTH
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="font-['Jost',sans-serif] font-bold"
          fontSize="32"
          fill="#744210"
        >
          {data.earth}
        </text>
        
        {/* Element sections */}
        {elements.map((element, index) => {
          const pos = getPosition(element.angle, radius);
          const labelPos = getPosition(element.angle, radius + 50);
          
          return (
            <g key={element.name}>
              {/* Element circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={45}
                fill={element.color}
                opacity="0.2"
                stroke={element.color}
                strokeWidth="3"
              />
              
              {/* Element value */}
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                className="font-['Jost',sans-serif] font-bold"
                fontSize="28"
                fill={element.color}
              >
                {element.value}
              </text>
              
              {/* Element label */}
              <text
                x={labelPos.x}
                y={labelPos.y + 5}
                textAnchor="middle"
                className="font-['Jost',sans-serif] font-bold"
                fontSize="14"
                fill="#374151"
              >
                {element.name}
              </text>
            </g>
          );
        })}
        
        {/* Connecting lines from center to elements */}
        {elements.map((element) => {
          const pos = getPosition(element.angle, radius - 45);
          return (
            <line
              key={`line-${element.name}`}
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              stroke="#CBD5E0"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
