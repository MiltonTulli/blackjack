"use client";
import { GameProvider } from "@/context/gameContext";
import { Board } from "@/components/Board";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <GameProvider>
        <main className="min-h-screen m-auto container p-8">
          <Board />
        </main>
      </GameProvider>
    </NextUIProvider>
  );
}
