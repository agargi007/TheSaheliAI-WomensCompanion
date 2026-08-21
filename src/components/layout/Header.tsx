"use client";

import React from "react";
import { useAppStore, Language } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ShieldAlert, XCircle, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafetyManager } from "@/lib/safety/SafetyManager";

export default function Header() {
  const { language, setLanguage, triggerEmergencySOS } = useAppStore();

  const handleQuickExit = () => {
    SafetyManager.quickExit();
  };

  const handleSOS = () => {
    triggerEmergencySOS();
    SafetyManager.emergencySOS();
  };

  const langLabels: Record<Language, string> = {
    en: "English",
    hi: "हिन्दी",
    mr: "मराठी",
  };

  return (
    <header className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 border-b bg-background">
      {/* Quick Exit (Top Left) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleQuickExit}
        className="text-muted-foreground hover:text-foreground"
        title="Quick Exit"
        aria-label="Quick Exit"
      >
        <XCircle className="h-6 w-6" />
      </Button>

      {/* Language Selector (Top Center) */}
      <DropdownMenu>
        {/* @ts-ignore - Radix UI DropdownMenuTrigger asChild type issue */}
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium">{langLabels[language]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => setLanguage("en")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("hi")}>
            हिन्दी
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("mr")}>
            मराठी
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* SOS Button (Top Right) */}
      <Button
        variant="destructive"
        size="icon"
        onClick={handleSOS}
        className="bg-emergency hover:bg-emergency-dark text-white shadow-lg animate-pulse hover:animate-none"
        title="Emergency SOS"
        aria-label="Emergency SOS"
      >
        <ShieldAlert className="h-6 w-6" />
      </Button>
    </header>
  );
}
