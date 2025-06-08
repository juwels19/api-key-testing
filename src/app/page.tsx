"use client";

import axios from "axios";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export default function Home() {
  const dialogInputRef = useRef(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [enteredKey, setEnteredKey] = useState("");
  const [createdKey, setCreatedKey] = useState();

  const onGenerateClick = async () => {
    setIsCreating(true);

    try {
      const keyResult = await fetch("/api/keys/create", { method: "post" });
      const key = await keyResult.json();
      setCreatedKey(key.key);
    } catch (e) {
      console.log(e);
    }

    setIsCreating(false);
  };

  const onValidateClick = async () => {
    setIsValidating(true);

    try {
      const verifyResult = await axios.post("/api/keys/verify", {
        apiKey: enteredKey,
      });
      if (verifyResult.status !== 200) {
        toast.error("Your API key is invalid");
      } else {
        toast.success("Your API key is valid!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopy = () => {
    if (dialogInputRef.current) {
      navigator.clipboard.writeText(dialogInputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="font-bold text-2xl">API Key Testing App</h1>
      <Card className="w-3/4 self-center">
        <CardHeader>
          <CardTitle>Generate API Key</CardTitle>
          <CardDescription>
            Click the button below to generate an API key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled={isCreating} onClick={onGenerateClick}>
            {isCreating && <Loader2Icon className="size-4 animate-spin" />}
            Generate key
          </Button>
        </CardContent>
      </Card>

      <Card className="w-3/4 self-center">
        <CardHeader>
          <CardTitle>Validate API Key</CardTitle>
          <CardDescription>
            Enter an API key and click validate to see if your API key is valid
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Enter API key..."
            type="text"
            className="text-sm"
            onChange={(e) => setEnteredKey(e.target.value)}
          />
          <Button
            disabled={isValidating}
            onClick={onValidateClick}
            className="max-w-fit"
          >
            {isValidating && <Loader2Icon className="size-4 animate-spin" />}
            Validate key
          </Button>
        </CardContent>
      </Card>
      <Dialog open={createdKey}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>API key successfully created!</DialogTitle>
            <DialogDescription>
              Please save this key somewhere safe and accessible. This will be
              the <span className="font-semibold italic">only time</span> it is
              visible. If you lose this key, you will need to generate a new
              one.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="relative">
              <Input
                readOnly
                defaultValue={createdKey}
                type="text"
                ref={dialogInputRef}
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                      aria-label={copied ? "Copied" : "Copy to clipboard"}
                      disabled={copied}
                    >
                      <div
                        className={cn(
                          "transition-all",
                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        )}
                      >
                        <CheckIcon
                          className="stroke-emerald-500"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute transition-all",
                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                        )}
                      >
                        <CopyIcon size={16} aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Copy to clipboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setCreatedKey(undefined)}
              className="cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
