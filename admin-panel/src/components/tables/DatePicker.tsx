import { useState } from "react";
import { DatePicker } from "../ui/datePicker/datePicker";
import { Label } from "../ui/label";

export const DateRangeFilter = ({
  startDate,
  endDate,
  onChange,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
}) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleStartDateChange = (dates: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    onChange(dates);
    setIsStartOpen(false);
  };

  const handleEndDateChange = (dates: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    onChange(dates);
    setIsEndOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div>
        <Label className="dark:text-white text-sm font-medium">
          Start Date :
        </Label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="w-60"
          open={isStartOpen}
          setOpen={setIsStartOpen}
        />
      </div>
      <div>
        <Label className="dark:text-white text-sm font-medium">
          End Date :
        </Label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="w-60"
          open={isEndOpen}
          setOpen={setIsEndOpen}
        />
      </div>
    </div>
  );
};
