"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, Language } from "@/store/useAppStore";

type RecordingState = "idle" | "recording" | "processing";

export default function VoiceRecorder() {
  const { language } = useAppStore();
  const [recordState, setRecordState] = useState<RecordingState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getStatusMessage = () => {
    switch (recordState) {
      case "idle":
        return {
          en: "Tap to speak",
          hi: "बोलने के लिए दबाएं",
          mr: "बोलण्यासाठी दाबा",
        }[language];
      case "recording":
        return {
          en: "Listening...",
          hi: "सुन रहा हूँ...",
          mr: "ऐकत आहे...",
        }[language];
      case "processing":
        return {
          en: "Thinking...",
          hi: "सोच रहा हूँ...",
          mr: "विचार करत आहे...",
        }[language];
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordState("recording");
      
      // Auto-stop after 30 seconds as per specs
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording();
        }
      }, 30000);
      
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      // Fallback UI handling
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecordState("processing");
    }
  };

  const processAudio = async (blob: Blob) => {
    // 1. Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = reader.result?.toString().split(",")[1];
      
      try {
        const response = await fetch("/api/voice-pipeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioBase64: base64Audio,
            language: language,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to process audio");
        }
        
        const data = await response.json();
        console.log("Guidance Received:", data.guidance);
        
        // Play audio if available
        if (data.audioResponse) {
          const audio = new Audio("data:audio/wav;base64," + data.audioResponse);
          audio.play();
        }
        
        // In a real implementation, we would update global state with the new case 
        // and navigate to a GuidanceView component.
        
      } catch (error) {
        console.error("Error processing audio:", error);
      } finally {
        setRecordState("idle");
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-10">
      <div className="relative flex items-center justify-center">
        {/* Pulsing rings when recording */}
        {recordState === "recording" && (
          <>
            <div className="absolute h-32 w-32 rounded-full bg-emergency animate-ping opacity-75" />
            <div className="absolute h-40 w-40 rounded-full bg-emergency opacity-30 animate-pulse" />
          </>
        )}

        <Button
          onClick={
            recordState === "idle"
              ? startRecording
              : recordState === "recording"
              ? stopRecording
              : undefined
          }
          disabled={recordState === "processing"}
          className={`relative z-10 flex h-32 w-32 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
            recordState === "idle"
              ? "bg-primary hover:bg-primary-dark hover:scale-105"
              : recordState === "recording"
              ? "bg-emergency hover:bg-emergency-dark scale-95"
              : "bg-muted cursor-not-allowed"
          }`}
          aria-label={recordState === "idle" ? "Start Recording" : "Stop Recording"}
        >
          {recordState === "idle" && (
            <Mic className="h-14 w-14 text-white" />
          )}
          {recordState === "recording" && (
            <Square className="h-10 w-10 text-white fill-current" />
          )}
          {recordState === "processing" && (
            <Loader2 className="h-14 w-14 text-primary animate-spin" />
          )}
        </Button>
      </div>

      <p className="text-xl font-medium text-foreground text-center animate-fade-in h-8">
        {getStatusMessage()}
      </p>
    </div>
  );
}
