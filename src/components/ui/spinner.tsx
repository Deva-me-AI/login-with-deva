import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  /**
   * Optional size of the spinner (defaults to "md")
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional custom className to apply to the spinner
   */
  className?: string;
}

/**
 * Spinner component that displays a loading animation
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "deva-h-4 deva-w-4",
    md: "deva-h-6 deva-w-6",
    lg: "deva-h-8 deva-w-8",
  };

  return (
    <Loader
      className={cn("deva-animate-spin deva-text-primary", sizeClasses[size], className)}
    />
  );
}
