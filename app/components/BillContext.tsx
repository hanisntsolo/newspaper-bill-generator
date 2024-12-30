// BillContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateValue } from '@nextui-org/calendar';
import dayjs from 'dayjs';
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';

interface BillContextProps {
  startDate: DateValue;
  setStartDate: (date: DateValue) => void;
  endDate: DateValue;
  setEndDate: (date: DateValue) => void;
  selectedHolidays: string[];
  setSelectedHolidays: (holidays: string[]) => void;
  weekdayRate: number;
  setWeekdayRate: (rate: number) => void;
  weekdays: number;
  setWeekdays: (weekdays: number) => void;
  weekendRate: number;
  setWeekendRate: (rate: number) => void;
  weekends: number;
  setWeekends: (weekends: number) => void;
  totalBill: number;
  currency: string;
  setCurrency: (currency: string) => void;
  currencyLabel: string;
  setCurrencyLabel: (currencyLabel: string) => void;
  selectedCountry: Country;
  setSelectedCountry: (selectedCountry: Country) => void;
  weekendsSkipped: number;
  setWeekendsSkipped: (weekendsSkipped: number) => void;
  weekdaysSkipped: number;
  setWeekdaysSkipped: (weekdaysSkipped: number) => void;
  serviceCharge: number;
  setServiceCharge: (serviceCharge: number) => void;
}

const BillContext = createContext<BillContextProps | undefined>(undefined);

export const useBillContext = () => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error('useBillContext must be used within a BillProvider');
  }
  return context;
};

type Country = 'india' | 'argentina' | 'venezuela' | 'brazil' | 'switzerland' | 'germany' | 'spain' | 'france' | 'italy' | 'mexico';

const currencies = {
  india: { currency: "INR", currencyLabel: "₹" },
  argentina: { currency: "ARS", currencyLabel: "$" },
  venezuela: { currency: "VEF", currencyLabel: "Bs" },
  brazil: { currency: "BRL", currencyLabel: "R$" },
  switzerland: { currency: "CHF", currencyLabel: "CHF" },
  germany: { currency: "EUR", currencyLabel: "€" },
  spain: { currency: "EUR", currencyLabel: "€" },
  france: { currency: "EUR", currencyLabel: "€" },
  italy: { currency: "EUR", currencyLabel: "€" },
  mexico: { currency: "MXN", currencyLabel: "$" }
};

export const BillProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [startDate, setStartDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [endDate, setEndDate] = useState<DateValue>(today(getLocalTimeZone()).add({weeks: 1}));
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
  const [weekdayRate, setWeekdayRate] = useState<number>(10);
  const [weekendRate, setWeekendRate] = useState<number>(15);
  const [selectedCountry, setSelectedCountry] = useState<Country>('india');
  const [currency, setCurrency] = useState<string>(currencies[selectedCountry].currency);
  const [currencyLabel, setCurrencyLabel] = useState<string>(currencies[selectedCountry].currencyLabel);
  const [weekendsSkipped, setWeekendsSkipped] = useState<number>(0);
  const [weekdaysSkipped, setWeekdaysSkipped] = useState<number>(0);
  const [weekends, setWeekends] = useState<number>(0);
  const [weekdays, setWeekdays] = useState<number>(0);
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  // Function to check if a date is a weekend (Saturday or Sunday)
  const is_Weekend = (date: DateValue): boolean => {
    const dateString = `${date.year}-${date.month}-${date.day}`;
    const dayOfWeek = dayjs(dateString).day(); // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };
// Calculate weekdays and weekends on start or end date change
React.useEffect(() => {
  const calculateBill = (start: DateValue | null, end: DateValue | null) => {
    if (!start || !end) return 0;

    const startDate = new Date(start.year, start.month - 1, start.day);
    const endDate = new Date(end.year, end.month - 1, end.day);
    const differenceInMs = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    if (differenceInDays <= 0) return 0;

    let totalBill = 0;
    let weekdays_local = 0;
    let weekends_local = 0;
    for (let i = 0; i <= differenceInDays; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(currentDay.getDate() + i);

      const currentDateValue = {
        year: currentDay.getFullYear(),
        month: currentDay.getMonth() + 1,
        day: currentDay.getDate(),
      };

      const isWeekend = is_Weekend(new CalendarDate(currentDateValue.year, currentDateValue.month, currentDateValue.day));
      if (isWeekend) {
        weekends_local += 1;
      } else {
        weekdays_local += 1;
      }
      totalBill += isWeekend ? weekendRate : weekdayRate;
    }

    setWeekdays(weekdays_local);
    setWeekends(weekends_local);
    // handle weekends and weekdays skipped
    if (weekdaysSkipped > 0) {
      setWeekdays(weekdays_local - weekdaysSkipped);
    }
    if (weekendsSkipped > 0) {
      setWeekends(weekends_local - weekendsSkipped);
    }
    return totalBill;
  };

  calculateBill(startDate, endDate);
}, [startDate, endDate, weekendRate, weekdayRate, weekdaysSkipped, weekendsSkipped, serviceCharge, weekdays, weekends]); // Only recalculates when startDate, endDate, or rates change

  // Recalculate the bill whenever the start date, end date, weekday rate, or weekend rate changes
  const totalBill = (weekends * weekendRate) + (weekdays * weekdayRate) + serviceCharge;


  return (
    <BillContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedHolidays,
        setSelectedHolidays,
        weekdayRate,
        setWeekdayRate,
        weekendRate,
        setWeekendRate,
        weekdaysSkipped,
        setWeekdaysSkipped,
        weekendsSkipped,
        setWeekendsSkipped,
        totalBill,
        currency,
        setCurrency,
        currencyLabel,
        setCurrencyLabel,
        selectedCountry,
        setSelectedCountry,
        weekdays,
        setWeekdays,
        weekends,
        setWeekends,
        serviceCharge,
        setServiceCharge
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
