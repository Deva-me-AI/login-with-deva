import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface TokenInputProps {
  onComplete: (token: string) => void;
  isVerifying: boolean;
  error: string | null;
}

export function TokenInput({ onComplete, isVerifying }: TokenInputProps) {
  const [token, setToken] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (token.every((digit) => digit !== "")) {
      onComplete(token.join(""));
    }
  }, [token, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (isVerifying) return;

    const newToken = [...token];
    newToken[index] = value.replace(/\D/g, "").slice(0, 1);
    setToken(newToken);

    if (value && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isVerifying) return;

    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {token.map((digit, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={inputRefs[index]}
          className="h-12 w-12 text-center text-2xl"
          disabled={isVerifying}
        />
      ))}
    </div>
  );
}
