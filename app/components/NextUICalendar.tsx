import React from "react";
import { Calendar } from "@nextui-org/calendar";
import { useBillContext } from "./BillContext";
interface NextUICalendarProps {
  holidays: string[];
}

const NextUICalendar: React.FC<NextUICalendarProps> = ({
}) => {
  const { startDate, setStartDate, endDate, setEndDate } = useBillContext();
  return (
    <div className="p-4 border rounded-lg mt-4 border border-gray-300 dark:border-gray-500 dark:border-opacity-50">
      <div className="flex flex-col md:flex-col gap-4">
        <div className="flex w-full flex-wrap md:flex-nowrap justify-center items-center gap-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Start Date</h3>
            <Calendar
              aria-label="Date (Start Date)"
              defaultValue={startDate}
              showMonthAndYearPickers={true}
              onChange={(value) => setStartDate(value)}
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">End Date</h3>
            <Calendar
              aria-label="Date (End Date)"
              defaultValue={endDate}
              showMonthAndYearPickers={true}
              onChange={(value) => setEndDate(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextUICalendar;
