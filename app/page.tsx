"use client";

import React from "react";
import NextUICalendar from "./components/NextUICalendar";
import Bill from "./components/Bill";
import { NextUIProvider } from "@nextui-org/react";
import { BillProvider } from "./components/BillContext";

const holidays = ["2024-01-01", "2024-01-26"]; // Example holidays

export default function Home() {
  return (
    <NextUIProvider>
      <BillProvider>
        <div className="w-screen h-screen p-8 flex items-start justify-center">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Newspaper Bill Calculator</h1>
            <div className="flex flex-col gap-4">
              {/* Updated Flexbox Layout */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-1">
                  <NextUICalendar holidays={holidays} />
                </div>
                <div className="flex-1">
                  <Bill />
                </div>
              </div>
            </div>
          </div>
        </div>
      </BillProvider>
    </NextUIProvider>
  );
}
