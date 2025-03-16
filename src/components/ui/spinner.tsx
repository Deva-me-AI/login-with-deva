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
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}
