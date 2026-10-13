import { ColorView } from '@/lib/products/types';

interface ColorChipGroupProps {
  colors: ColorView[];
  selectedId: string | null;
  onChange: (id: string) => void;
}

export default function ColorChipGroup({ colors, selectedId, onChange }: ColorChipGroupProps) {
  const selected = colors.find((c) => c.id === selectedId);

  return (
    <div className='flex items-center justify-between'>
      <p className='text-[14px] font-bold text-[#0E2447]'>색상 - {selected?.name}</p>

      <div role='radiogroup' aria-label='색상 선택' className='flex items-center gap-5.5'>
        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          return (
            <button
              key={color.id}
              type='button'
              role='radio'
              aria-checked={isSelected}
              aria-label={color.name}
              title={color.name}
              onClick={() => onChange(color.id)}
              style={{ backgroundColor: color.code ?? undefined }}
              className={`h-6 w-6 rounded-full border border-black/10 ring-offset-2 transition ${
                isSelected ? 'ring-2 ring-[#1F61C7]' : 'hover:ring-2 hover:ring-[#1F61C7]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
