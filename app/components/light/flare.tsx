import cn from 'classnames';

interface FlareProps {
  className?: string;
}
export function Flare({ className }: FlareProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        `pointer-events-none absolute inset-0 flex items-center justify-center
      before:absolute before:rounded-full before:content-['']
      before:bg-linear-to-r before:from-[#2525e3] before:to-[#69ced0]
      before:blur-[100px]
      before:opacity-30
      before:-rotate-90
      before:w-130 before:h-50
      before:translate-x-[0%] before:translate-y-[-30%]

      sm:before:w-130 sm:before:h-50
      lg:before:w-200 lg:before:h-90`,
        className
      )}
    />
  );
}
