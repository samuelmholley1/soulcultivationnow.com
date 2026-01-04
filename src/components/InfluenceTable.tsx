'use client';

interface InfluenceTableProps {
  digitCounts: number[]; // Array of 10 elements (0-9)
}

export function InfluenceTable({ digitCounts }: InfluenceTableProps) {
  // Masculine: 0-4, Feminine: 5-9
  const masculineTotal = digitCounts.slice(0, 5).reduce((sum, count) => sum + count, 0);
  const feminineTotal = digitCounts.slice(5, 10).reduce((sum, count) => sum + count, 0);
  
  const elements = [
    { name: 'EARTH', masculine: 0, feminine: 5, color: '#D69E2E' },
    { name: 'WATER', masculine: 1, feminine: 6, color: '#4299E1' },
    { name: 'FIRE', masculine: 2, feminine: 7, color: '#F56565' },
    { name: 'NATURE', masculine: 3, feminine: 8, color: '#48BB78' },
    { name: 'MINERAL', masculine: 4, feminine: 9, color: '#A0AEC0' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#427d78] text-white">
            <th className="font-['Jost',sans-serif] font-bold p-3 text-left border border-[#2c5550]">
              Influence
            </th>
            {elements.map((element) => (
              <th 
                key={element.name}
                className="font-['Jost',sans-serif] font-bold p-3 text-center border border-[#2c5550]"
              >
                {element.name}
              </th>
            ))}
            <th className="font-['Jost',sans-serif] font-bold p-3 text-center border border-[#2c5550] bg-[#2c5550]">
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody className="font-['Bitter',serif]">
          {/* Masculine Row */}
          <tr className="bg-white hover:bg-blue-50 transition-colors">
            <td className="p-3 font-bold border border-gray-300 text-[#4682B4]">
              MASCULINE
            </td>
            {elements.map((element) => (
              <td 
                key={`m-${element.name}`}
                className="p-3 text-center border border-gray-300"
                style={{ backgroundColor: `${element.color}15` }}
              >
                <span className="text-sm text-gray-600">{element.masculine}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="font-bold text-lg" style={{ color: element.color }}>
                  {digitCounts[element.masculine]}
                </span>
              </td>
            ))}
            <td className="p-3 text-center font-bold text-xl border border-gray-300 bg-blue-100 text-[#4682B4]">
              {masculineTotal}
            </td>
          </tr>
          
          {/* Feminine Row */}
          <tr className="bg-white hover:bg-purple-50 transition-colors">
            <td className="p-3 font-bold border border-gray-300 text-[#967BB6]">
              FEMININE
            </td>
            {elements.map((element) => (
              <td 
                key={`f-${element.name}`}
                className="p-3 text-center border border-gray-300"
                style={{ backgroundColor: `${element.color}15` }}
              >
                <span className="text-sm text-gray-600">{element.feminine}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="font-bold text-lg" style={{ color: element.color }}>
                  {digitCounts[element.feminine]}
                </span>
              </td>
            ))}
            <td className="p-3 text-center font-bold text-xl border border-gray-300 bg-purple-100 text-[#967BB6]">
              {feminineTotal}
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="font-['Bitter',serif] text-sm text-gray-600">
          <strong>Masculine energies (0-4)</strong> represent structure, logic, and external action. 
          <strong className="ml-3">Feminine energies (5-9)</strong> represent intuition, emotion, and internal wisdom.
        </p>
      </div>
    </div>
  );
}
