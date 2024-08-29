import { cn } from "@/lib/utils";

export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className={cn(
            "w-2 h-2 bg-gray-500 rounded-full",
            "animate-bounce",
            dot === 1 && "animation-delay-200",
            dot === 2 && "animation-delay-400"
          )}
        />
      ))}
    </div>
  );
}
