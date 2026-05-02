"use client";

import React from "react";
import dayjs from "dayjs";
import { Input, Switch } from "@nextui-org/react";

import { Country, useBillContext } from "./BillContext";

const formatHolidayDate = (date: string) => dayjs(date).format("DD MMM YYYY");

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
    setServiceCharge,
    deductHolidayContributions,
    setDeductHolidayContributions,
    availableCountries,
    selectedCountry,
    setSelectedCountry,
    availableStates,
    selectedState,
    setSelectedState,
    holidayEntries,
    holidayTotal,
  } = useBillContext();

  return (
    <div className="p-4 border rounded-lg border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
      <div className="text-m">
        <div className="flex flex-col md:flex-row w-full gap-4 mb-4">
          <div className="flex-1">
            <p className="text-lg font-bold">Start Date</p>
            <p className="text-xl font-bold">
              {startDate.year}-{startDate.month}-{startDate.day}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">End Date</p>
            <p className="text-xl font-bold">
              {endDate.year}-{endDate.month}-{endDate.day}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg mt-4 border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col md:flex-row w-full gap-4 mb-2">
            <div className="flex-1">
              <label
                htmlFor="country-select"
                className="block text-sm font-medium mb-2"
              >
                Country
              </label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(event) =>
                  setSelectedCountry(event.target.value as Country)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-black shadow-sm outline-none transition focus:border-primary dark:border-gray-500 dark:bg-zinc-900 dark:text-white"
              >
                {availableCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="state-select"
                className="block text-sm font-medium mb-2"
              >
                State / Province
              </label>
              <select
                id="state-select"
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
                disabled={!availableStates.length}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-black shadow-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-500 dark:bg-zinc-900 dark:text-white"
              >
                <option value="">
                  {availableStates.length
                    ? "National holidays only"
                    : "No state selection available"}
                </option>
                {availableStates.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4 mb-2">
            <div className="flex-1">
              <Input
                value={weekdayRate.toString()}
                onChange={(event) => setWeekdayRate(Number(event.target.value))}
                label={"Weekday(Mon - Fri) Rate"}
                labelPlacement="outside"
                type="number"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      {currencyLabel}
                    </span>
                  </div>
                }
                placeholder={weekdayRate.toString()}
              />
            </div>

            <div className="flex-1">
              <Input
                value={weekendRate.toString()}
                onChange={(event) => setWeekendRate(Number(event.target.value))}
                label={"WeekEnd(Sat - Sun) Rate"}
                labelPlacement="outside"
                type="number"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      {currencyLabel}
                    </span>
                  </div>
                }
                placeholder={weekendRate.toString()}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="flex-1">
              <Input
                value={weekdaysSkipped.toString()}
                onChange={(event) =>
                  setWeekdaysSkipped(Number(event.target.value))
                }
                label={"Weekdays Skipped"}
                labelPlacement="outside"
                type="number"
                placeholder={weekdaysSkipped.toString()}
              />
            </div>

            <div className="flex-1">
              <Input
                value={weekendsSkipped.toString()}
                onChange={(event) =>
                  setWeekendsSkipped(Number(event.target.value))
                }
                label={"Weekends Skipped"}
                labelPlacement="outside"
                type="number"
                placeholder={weekendsSkipped.toString()}
              />
            </div>

            <div className="flex-1">
              <Input
                value={serviceCharge.toString()}
                onChange={(event) => setServiceCharge(Number(event.target.value))}
                label={"Service Charge"}
                labelPlacement="outside"
                type="number"
                placeholder={serviceCharge.toString()}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div>
              <p className="font-medium">Deduct holidays from bill</p>
              <p className="text-sm text-default-500">
                Turn this off only if deliveries are billed even on holidays.
              </p>
            </div>
            <Switch
              isSelected={deductHolidayContributions}
              onValueChange={setDeductHolidayContributions}
              color="primary"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg mt-4 border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
        <h3 className="text-2xl font-bold text-center mb-4">Bill Summary</h3>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <p className="text-base">WeekDays: {weekdays} days</p>
          </div>
          <div className="col-span-6 text-right">
            <p className="text-base font-bold">
              {currencyLabel}
              {weekdayRate * weekdays}
            </p>
          </div>

          <div className="col-span-6">
            <p className="text-base">WeekEnds: {weekends} days</p>
          </div>
          <div className="col-span-6 text-right">
            <p className="text-base font-bold">
              {currencyLabel}
              {weekendRate * weekends}
            </p>
          </div>

          <div className="col-span-6">
            <p className="text-base">
              {deductHolidayContributions
                ? "Holiday Deduction:"
                : "Holiday Billed Amount:"}
            </p>
          </div>
          <div className="col-span-6 text-right">
            <p
              className={`text-base font-bold ${
                deductHolidayContributions ? "text-danger" : ""
              }`}
            >
              {deductHolidayContributions ? "-" : ""}
              {currencyLabel}
              {holidayTotal}
            </p>
          </div>

          <div className="col-span-6">
            <p className="text-base">Service Charge:</p>
          </div>
          <div className="col-span-6 text-right">
            <p className="text-base font-bold">
              {currencyLabel}
              {serviceCharge}
            </p>
          </div>

          <div className="col-span-6 text-left align-text-bottom">
            <p className="text-xl font-bold">Total Bill:</p>
          </div>
          <div className="col-span-6 text-right">
            <p className="text-4xl font-bold text-primary">
              {currencyLabel}
              {totalBill}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-bold">Holidays in Range</p>
            <p className="text-sm text-default-500">
              {holidayEntries.length} holiday
              {holidayEntries.length === 1 ? "" : "s"}
            </p>
          </div>

          {holidayEntries.length ? (
            <div className="mt-4 space-y-3">
              {holidayEntries.map((holiday) => (
                <div
                  key={`${holiday.date}-${holiday.name}`}
                  className="grid grid-cols-12 gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="col-span-8">
                    <p className="font-semibold">{holiday.name}</p>
                    <p className="text-sm text-default-500">
                      {formatHolidayDate(holiday.date)} ·{" "}
                      {holiday.dayType === "weekday" ? "Weekday" : "Weekend"} ·
                      Rate {currencyLabel}
                      {holiday.rateApplied}
                      {holiday.substitute ? " · Substitute day" : ""}
                      {holiday.billed
                        ? deductHolidayContributions
                          ? " · Deducted from bill"
                          : " · Included in bill"
                        : ""}
                      {!holiday.billed ? " · Skipped by manual adjustment" : ""}
                    </p>
                  </div>
                  <div className="col-span-4 text-right">
                    <p
                      className={`text-base font-bold ${
                        holiday.billed ? "" : "text-default-400"
                      }`}
                    >
                      {holiday.billed && deductHolidayContributions ? "-" : ""}
                      {currencyLabel}
                      {holiday.contribution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-default-500">
              No public holidays fall inside the selected billing range.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bill;
