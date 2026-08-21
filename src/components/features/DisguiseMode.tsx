"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";

export default function DisguiseMode() {
  const { setDisguiseMode } = useAppStore();
  const [display, setDisplay] = useState("0");

  const handleKeyPress = (key: string) => {
    // Secret code to exit disguise mode
    if (display === "181" && key === "=") {
      setDisguiseMode(false);
      return;
    }

    if (key === "C") {
      setDisplay("0");
    } else if (key === "=") {
      // Basic mock calculator logic
      try {
        // Safe eval simulation for basic math
        // eslint-disable-next-line no-new-func
        const result = new Function("return " + display)();
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
    } else {
      setDisplay(display === "0" ? key : display + key);
    }
  };

  const keys = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "C", "0", "=", "+",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card p-6 rounded-2xl shadow-xl border border-border">
        <div className="w-full h-20 bg-muted rounded-xl mb-6 flex items-center justify-end px-4 text-4xl font-mono text-foreground overflow-hidden">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {keys.map((key) => (
            <Button
              key={key}
              variant={["C", "=", "/", "*", "-", "+"].includes(key) ? "secondary" : "outline"}
              className="h-16 text-2xl font-medium"
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
