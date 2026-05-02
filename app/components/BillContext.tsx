"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { DateValue } from "@nextui-org/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import Holidays from "date-holidays";

type CountryConfig = {
  label: string;
  holidayCode: string;
  currency: string;
  currencyLabel: string;
};

const COUNTRY_CONFIG = {
  india: {
    label: "India",
    holidayCode: "IN",
    currency: "INR",
    currencyLabel: "₹",
  },
  argentina: {
    label: "Argentina",
    holidayCode: "AR",
    currency: "ARS",
    currencyLabel: "$",
  },
  venezuela: {
    label: "Venezuela",
    holidayCode: "VE",
    currency: "VES",
    currencyLabel: "Bs",
  },
  brazil: {
    label: "Brazil",
    holidayCode: "BR",
    currency: "BRL",
    currencyLabel: "R$",
  },
  switzerland: {
    label: "Switzerland",
    holidayCode: "CH",
    currency: "CHF",
    currencyLabel: "CHF",
  },
  germany: {
    label: "Germany",
    holidayCode: "DE",
    currency: "EUR",
    currencyLabel: "€",
  },
  spain: {
    label: "Spain",
    holidayCode: "ES",
    currency: "EUR",
    currencyLabel: "€",
  },
  france: {
    label: "France",
    holidayCode: "FR",
    currency: "EUR",
    currencyLabel: "€",
  },
  italy: {
    label: "Italy",
    holidayCode: "IT",
    currency: "EUR",
    currencyLabel: "€",
  },
  mexico: {
    label: "Mexico",
    holidayCode: "MX",
    currency: "MXN",
    currencyLabel: "$",
  },
} as const satisfies Record<string, CountryConfig>;

export type Country = keyof typeof COUNTRY_CONFIG;

export type HolidayEntry = {
  date: string;
  name: string;
  dayType: "weekday" | "weekend";
  rateApplied: number;
  contribution: number;
  billed: boolean;
  substitute: boolean;
};

type Option = {
  code: string;
  label: string;
};

interface BillContextProps {
  startDate: DateValue;
  setStartDate: (date: DateValue) => void;
  endDate: DateValue;
  setEndDate: (date: DateValue) => void;
  weekdayRate: number;
  setWeekdayRate: (rate: number) => void;
  weekdays: number;
  weekendRate: number;
  setWeekendRate: (rate: number) => void;
  weekends: number;
  totalBill: number;
  currency: string;
  currencyLabel: string;
  availableCountries: Option[];
  selectedCountry: Country;
  setSelectedCountry: (selectedCountry: Country) => void;
  availableStates: Option[];
  selectedState: string;
  setSelectedState: (selectedState: string) => void;
  weekendsSkipped: number;
  setWeekendsSkipped: (weekendsSkipped: number) => void;
  weekdaysSkipped: number;
  setWeekdaysSkipped: (weekdaysSkipped: number) => void;
  serviceChargeRate: number;
  setServiceChargeRate: (serviceChargeRate: number) => void;
  serviceChargeMonths: number;
  serviceCharge: number;
  deductHolidayContributions: boolean;
  setDeductHolidayContributions: (deductHolidayContributions: boolean) => void;
  holidayEntries: HolidayEntry[];
  holidayTotal: number;
  selectedHolidays: string[];
}

const BillContext = createContext<BillContextProps | undefined>(undefined);

const HOLIDAY_TYPES = ["public"] as const;
const DEFAULT_MONTHLY_SERVICE_CHARGE = 20;

const buildDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const toDateKey = (dateValue: DateValue) =>
  buildDateKey(dateValue.year, dateValue.month, dateValue.day);

const getBillingMonthSpan = (start: DateValue, end: DateValue) => {
  if (
    end.year < start.year ||
    (end.year === start.year && end.month < start.month) ||
    (end.year === start.year && end.month === start.month && end.day < start.day)
  ) {
    return 0;
  }

  return (end.year - start.year) * 12 + (end.month - start.month) + 1;
};

const enumerateDateKeys = (start: DateValue, end: DateValue) => {
  const startDate = parseDateKey(toDateKey(start));
  const endDate = parseDateKey(toDateKey(end));

  if (endDate < startDate) {
    return [];
  }

  const currentDate = new Date(startDate);
  const dates: string[] = [];

  while (currentDate <= endDate) {
    dates.push(
      buildDateKey(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate()
      )
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const isWeekendDate = (dateKey: string) => {
  const dayOfWeek = parseDateKey(dateKey).getDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
};

const createHolidayLookup = (countryCode: string, stateCode: string) => {
  if (stateCode) {
    return new Holidays(countryCode, stateCode, { types: [...HOLIDAY_TYPES] });
  }

  return new Holidays(countryCode, { types: [...HOLIDAY_TYPES] });
};

const getHolidayStateOptions = (countryCode: string) => {
  const holidayLookup = new Holidays({ types: [...HOLIDAY_TYPES] });
  const states = holidayLookup.getStates(countryCode) ?? {};

  return Object.entries(states)
    .map(([code, label]) => ({ code, label }))
    .sort((left, right) => left.label.localeCompare(right.label));
};

export const useBillContext = () => {
  const context = useContext(BillContext);

  if (!context) {
    throw new Error("useBillContext must be used within a BillProvider");
  }

  return context;
};

export const BillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startDate, setStartDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [endDate, setEndDate] = useState<DateValue>(
    today(getLocalTimeZone()).add({ weeks: 1 })
  );
  const [weekdayRate, setWeekdayRate] = useState<number>(12);
  const [weekendRate, setWeekendRate] = useState<number>(15);
  const [selectedCountry, setSelectedCountry] = useState<Country>("india");
  const [selectedState, setSelectedState] = useState<string>("");
  const [weekendsSkipped, setWeekendsSkipped] = useState<number>(0);
  const [weekdaysSkipped, setWeekdaysSkipped] = useState<number>(0);
  const [serviceChargeRate, setServiceChargeRate] = useState<number>(
    DEFAULT_MONTHLY_SERVICE_CHARGE
  );
  const [deductHolidayContributions, setDeductHolidayContributions] =
    useState<boolean>(true);

  const availableCountries = useMemo(
    () =>
      Object.entries(COUNTRY_CONFIG)
        .map(([code, config]) => ({ code, label: config.label }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    []
  );

  const selectedCountryConfig = COUNTRY_CONFIG[selectedCountry];

  const availableStates = useMemo(
    () => getHolidayStateOptions(selectedCountryConfig.holidayCode),
    [selectedCountryConfig.holidayCode]
  );

  const normalizedSelectedState = useMemo(() => {
    if (
      selectedState &&
      availableStates.some((state) => state.code === selectedState)
    ) {
      return selectedState;
    }

    return "";
  }, [availableStates, selectedState]);

  const calculation = useMemo(() => {
    const dateKeys = enumerateDateKeys(startDate, endDate);

    if (!dateKeys.length) {
      return {
        weekdays: 0,
        weekends: 0,
        selectedHolidays: [],
        holidayEntries: [] as HolidayEntry[],
        holidayTotal: 0,
        serviceChargeMonths: 0,
        serviceCharge: 0,
        totalBill: 0,
      };
    }

    const holidayLookup = createHolidayLookup(
      selectedCountryConfig.holidayCode,
      normalizedSelectedState
    );
    const dateKeySet = new Set(dateKeys);
    const holidayMap = new Map<
      string,
      {
        names: string[];
        substitute: boolean;
      }
    >();

    const startYear = parseDateKey(dateKeys[0]).getFullYear();
    const endYear = parseDateKey(dateKeys[dateKeys.length - 1]).getFullYear();

    for (let year = startYear; year <= endYear; year += 1) {
      const holidays = holidayLookup.getHolidays(year);

      for (const holiday of holidays) {
        const holidayDate = holiday.date.slice(0, 10);

        if (!dateKeySet.has(holidayDate)) {
          continue;
        }

        const existingHoliday = holidayMap.get(holidayDate) ?? {
          names: [],
          substitute: false,
        };

        if (!existingHoliday.names.includes(holiday.name)) {
          existingHoliday.names.push(holiday.name);
        }

        existingHoliday.substitute =
          existingHoliday.substitute || Boolean(holiday.substitute);

        holidayMap.set(holidayDate, existingHoliday);
      }
    }

    const billableDays = dateKeys.map((dateKey) => {
      const holiday = holidayMap.get(dateKey);
      const isWeekend = isWeekendDate(dateKey);
      const rateApplied = isWeekend ? weekendRate : weekdayRate;

      return {
        date: dateKey,
        holidayNames: holiday?.names ?? [],
        substitute: holiday?.substitute ?? false,
        isWeekend,
        rateApplied,
        billed: true,
      };
    });

    const applySkippedDays = (skipCount: number, matchWeekend: boolean) => {
      let remainingSkips = skipCount;

      for (const prioritizeHolidayDays of [false, true]) {
        for (const day of billableDays) {
          if (remainingSkips === 0) {
            return;
          }

          if (!day.billed || day.isWeekend !== matchWeekend) {
            continue;
          }

          const isHoliday = day.holidayNames.length > 0;

          if (isHoliday !== prioritizeHolidayDays) {
            continue;
          }

          day.billed = false;
          remainingSkips -= 1;
        }
      }
    };

    applySkippedDays(weekdaysSkipped, false);
    applySkippedDays(weekendsSkipped, true);

    const weekdays = billableDays.filter(
      (day) => !day.isWeekend && day.billed
    ).length;
    const weekends = billableDays.filter(
      (day) => day.isWeekend && day.billed
    ).length;
    const holidayEntries = billableDays
      .filter((day) => day.holidayNames.length > 0)
      .map<HolidayEntry>((day) => ({
        date: day.date,
        name: day.holidayNames.join(", "),
        dayType: day.isWeekend ? "weekend" : "weekday",
        rateApplied: day.rateApplied,
        contribution: day.billed ? day.rateApplied : 0,
        billed: day.billed,
        substitute: day.substitute,
      }));
    const holidayTotal = holidayEntries.reduce(
      (total, holiday) => total + holiday.contribution,
      0
    );
    const serviceChargeMonths = getBillingMonthSpan(startDate, endDate);
    const serviceCharge = serviceChargeMonths * serviceChargeRate;
    const subtotal =
      billableDays.reduce(
        (total, day) => total + (day.billed ? day.rateApplied : 0),
        0
      );
    const totalBill =
      subtotal +
      serviceCharge -
      (deductHolidayContributions ? holidayTotal : 0);

    return {
      weekdays,
      weekends,
      selectedHolidays: holidayEntries.map((holiday) => holiday.date),
      holidayEntries,
      holidayTotal,
      serviceChargeMonths,
      serviceCharge,
      totalBill,
    };
  }, [
    endDate,
    normalizedSelectedState,
    selectedCountryConfig.holidayCode,
    serviceChargeRate,
    startDate,
    deductHolidayContributions,
    weekdayRate,
    weekdaysSkipped,
    weekendRate,
    weekendsSkipped,
  ]);

  const value = {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    weekdayRate,
    setWeekdayRate,
    weekdays: calculation.weekdays,
    weekendRate,
    setWeekendRate,
    weekends: calculation.weekends,
    totalBill: calculation.totalBill,
    currency: selectedCountryConfig.currency,
    currencyLabel: selectedCountryConfig.currencyLabel,
    availableCountries,
    selectedCountry,
    setSelectedCountry,
    availableStates,
    selectedState: normalizedSelectedState,
    setSelectedState,
    weekendsSkipped,
    setWeekendsSkipped,
    weekdaysSkipped,
    setWeekdaysSkipped,
    serviceChargeRate,
    setServiceChargeRate,
    serviceChargeMonths: calculation.serviceChargeMonths,
    serviceCharge: calculation.serviceCharge,
    deductHolidayContributions,
    setDeductHolidayContributions,
    holidayEntries: calculation.holidayEntries,
    holidayTotal: calculation.holidayTotal,
    selectedHolidays: calculation.selectedHolidays,
  } satisfies BillContextProps;

  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};
