export type ColorOption = {
  id: string;
  color_name: string;
  color_code: string;
};

interface ColorChipGroupProps {
  colors: ColorOption[];
  selectedId: string | null;
  onChange: (id: string) => void;
}

export default function ColorChipGroup({ colors, selectedId, onChange }: ColorChipGroupProps) {
  const selected = colors.find((c) => c.id === selectedId);

  return (
    <div className='flex items-center justify-between'>
      <p className='text-sm font-bold text-gray-900'>색상 - {selected?.color_name}</p>

      <div role='radiogroup' aria-label='색상 선택' className='flex items-center gap-3'>
        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          return (
            <button
              key={color.id}
              type='button'
              role='radio'
              aria-checked={isSelected}
              aria-label={color.color_name}
              title={color.color_name}
              onClick={() => onChange(color.id)}
              style={{ backgroundColor: color.color_code }}
              className={`h-7 w-7 rounded-full border border-black/10 ring-offset-2 transition ${
                isSelected ? 'ring-2 ring-blue-600' : 'hover:ring-2 hover:ring-gray-300'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
