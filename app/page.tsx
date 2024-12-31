"use client";

import React from "react";
import NextUICalendar from "./components/NextUICalendar";
import Bill from "./components/Bill";
import { NextUIProvider } from "@nextui-org/react";
import { BillProvider } from "./components/BillContext";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "./components/icons/SunIcon";
import { MoonIcon } from "./components/icons/MoonIcon";

const holidays = ["2024-01-01", "2024-01-26"]; // Example holidays

export default function Home() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <NextUIProvider>
      <div className={isDarkMode ? "dark" : ""}>
        <BillProvider>
          <div
            className={`w-screen p-8 flex items-start justify-center bg-white dark:bg-gradient-to-br from-slate-800 via-stone-900 to-zinc-950 dark:text-white min-h-screen sm:min-h-[750px] md:min-h-[95vh] lg:min-h-[100vh]`}
          >
            <div className="container mx-auto p-4 mb-4">
              <div className="container mx-auto p-4 mb-6 flex items-center justify-between">
                <h5 className="text-4xl md:text-5xl sm:text-4xl font-bold mb-4">
                  <div className="flex flex-row justify-center items-center">
                    <img src="/favicon_io/android-chrome-512x512.png" alt="Browser Chrome" className="w-8 h-8 mr-2" />
                    <p>Newspaper Bill Calculator</p>
                  </div>
                </h5>
                <Switch
                  defaultSelected={isDarkMode}
                  color="primary"
                  size="md"
                  onChange={toggleTheme}
                  thumbIcon={({ isSelected, className }) =>
                    !isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
                  }
                ></Switch>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-1">
                  <NextUICalendar holidays={holidays} />
                </div>
                <div className="flex-1 mt-4">
                  <Bill />
                </div>
              </div>
            </div>
          </div>
        </BillProvider>
      </div>
    </NextUIProvider>
  );
}
