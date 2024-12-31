"use client";
import React from "react";

import { useBillContext } from "./BillContext";
import { Input } from "@nextui-org/react";



const Bill: React.FC = () => {
  const {
    startDate,
    endDate,
    weekdayRate,
    weekendRate,
    weekdaysSkipped,
    setWeekdaysSkipped,
    weekendsSkipped,
    setWeekendsSkipped,
    totalBill,
    currencyLabel,
    setWeekdayRate,
    setWeekendRate,
    weekdays,
    weekends,
    serviceCharge,
    setServiceCharge
  } = useBillContext();

  return (
      <div className="p-4 border rounded-lg border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
          <div className="text-m">
          {/* Date display with responsive layout */}
          <div className="flex flex-col md:flex-row w-full gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold">Start Date: <p className="text-xl font-bold">{startDate.year}-{startDate.month}-{startDate.day}</p> </h2>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">End Date: <h2 className="text-xl font-bold">{endDate.year}-{endDate.month}-{endDate.day}</h2> </h2>
            </div>
          </div>
          </div>
            <div className="p-4 border rounded-lg mt-4 border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
            {/* Flex layout for form inputs */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col md:flex-row w-full gap-4 mb-2">
                <div className="flex-1">
                  <Input
                    value={weekdayRate.toString()}
                    onChange={(e) => setWeekdayRate(Number(e.target.value))}
                    label={"Weekday(Mon - Fri) Rate"}
                    labelPlacement="outside"
                    type="number"
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">{currencyLabel}</span></div>}
                    placeholder={weekdayRate.toString()}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    value={weekendRate.toString()}
                    onChange={(e) => setWeekendRate(Number(e.target.value))}
                    label={"WeekEnd(Sat - Sun) Rate"}
                    labelPlacement="outside"
                    type="number"
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">{currencyLabel}</span></div>}
                    placeholder={weekendRate.toString()}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="flex-1">
                  <Input
                    value={weekdaysSkipped.toString()}
                    onChange={(e) => setWeekdaysSkipped(Number(e.target.value))}
                    label={"Weekdays Skipped"}
                    labelPlacement="outside"
                    type="number"
                    placeholder={weekdaysSkipped.toString()}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    value={weekendsSkipped.toString()}
                    onChange={(e) => setWeekendsSkipped(Number(e.target.value))}
                    label={"Weekends Skipped"}
                    labelPlacement="outside"
                    type="number"
                    placeholder={weekendsSkipped.toString()}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    value={serviceCharge.toString()}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    label={"Service Charge"}
                    labelPlacement="outside"
                    type="number"
                    placeholder={serviceCharge.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        <div className="p-4 border rounded-lg mt-4 border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
        <div className="card">
          <div className="card">
            <h3 className="text-2xl font-bold text-center mb-4">Bill Summary</h3>
            <div className="grid grid-cols-12 gap-4">
              {/* Weekdays */}
              <div className="col-span-6">
                <p className="text-base">WeekDays: {weekdays} days</p>
              </div>
              <div className="col-span-6 text-right">
                <p className="text-base font-bold">
                  {currencyLabel}{weekdayRate * weekdays}
                </p>
              </div>

              {/* Weekends */}
              <div className="col-span-6">
                <p className="text-base">WeekEnds: {weekends} days</p>
              </div>
              <div className="col-span-6 text-right">
                <p className="text-base font-bold">
                  {currencyLabel}{weekendRate * weekends}
                </p>
              </div>

              {/* Service Charge */}
              <div className="col-span-6">
                <p className="text-base">Service Charge:</p>
              </div>
              <div className="col-span-6 text-right">
                <p className="text-base font-bold">
                  {currencyLabel}{serviceCharge}
                </p>
              </div>

              {/* Total Bill */}
              <div className="col-span-6 text-left align-text-bottom">
                <p className="text-xl font-bold">Total Bill:</p>
              </div>
              <div className="col-span-6 text-right">
                <p className="text-4xl font-bold text-primary">
                  {currencyLabel}{totalBill}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Bill;
