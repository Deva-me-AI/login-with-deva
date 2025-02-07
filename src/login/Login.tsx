import { useCallback, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmailValidation } from "@/hooks/use-email-validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TokenInput } from "./TokenInput";

export async function verifyToken(
  _email: string,
  _token: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(true);
      } else {
        reject(new Error("Invalid token"));
      }
    }, 2000);
  });
}

export const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "token">("email");
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isValid: isEmailValid, error: emailError } =
    useEmailValidation(email);

  const handleClose = useCallback(() => {
    setEmail("");
    setStep("email");
    onClose();
  }, [onClose]);

  const handleEmailSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isEmailValid) {
        setStep("token");
      }
    },
    [isEmailValid],
  );

  const handleTokenComplete = useCallback(
    async (token: string) => {
      setIsVerifying(true);
      setTokenError(null);
      try {
        await verifyToken(email, token);
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in.",
        });
        handleClose();
      } catch (error) {
        console.error(error);
        setTokenError("Invalid token. Please try again.");
        toast({
          title: "Login Failed",
          description: "Please check your token and try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    },
    [email, handleClose, toast],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "email" ? "Enter your email" : "Enter verification token"}
          </DialogTitle>
        </DialogHeader>
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>
              <Button type="submit" disabled={!isEmailValid}>
                Next
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Label>Enter the 4-digit token sent to your email</Label>
            <TokenInput
              onComplete={handleTokenComplete}
              isVerifying={isVerifying}
              error={tokenError}
            />
            {tokenError && <p className="text-sm text-red-500">{tokenError}</p>}
            {isVerifying && (
              <p className="text-sm text-blue-500">Verifying token...</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
