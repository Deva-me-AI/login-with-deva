import type React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface TokenDigitInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isVerifying: boolean;
}

const TokenDigitInput = function TokenDigitInput({
  value,
  index,
  onChange,
  onKeyDown,
  inputRef,
  isVerifying,
}: TokenDigitInputProps) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
          // check if value is a digit, and slice to only allow one character
          onChange(index, e.target.value),
        [index, onChange],
      )}
      onKeyDown={useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(index, e),
        [index, onKeyDown],
      )}
      ref={inputRef}
      className="h-12 w-12 text-center text-2xl"
      disabled={isVerifying}
    />
  );
};

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

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (isVerifying) return;

      // replace non-digit characters with empty string
      value = value.replace(/\D/g, "").slice(0, 1);
      if (!value) return;

      const newToken = [...token];
      newToken[index] = value.replace(/\D/g, "").slice(0, 1);
      setToken(newToken);

      if (value && index < 3) {
        inputRefs[index + 1]?.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVerifying, token],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isVerifying) return;
      // check that value is a number, and that it's not empty
      if (!/^\d$/.test(e.key) || !e.key) return;

      if (e.key === "Backspace" && !token[index] && index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVerifying, token],
  );

  return (
    <div className="flex space-x-2">
      {token.map((digit, index) => (
        <TokenDigitInput
          key={index}
          value={digit}
          index={index}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputRef={inputRefs[index]!}
          isVerifying={isVerifying}
        />
      ))}
    </div>
  );
}
