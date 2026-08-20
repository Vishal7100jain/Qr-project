"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";

interface IDatePicker {
  selected: Date | null;
  onChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date | null;
  placeholderText?: string;
  className?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  label?: string;
}

// ─── Custom Input ─────────────────────────────────────────────────────────────
// Must be forwardRef so react-datepicker can attach its own ref + click handler.
// We pass `open` and `selected` as extra props through the `...rest` spread.
interface CustomInputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
  selected?: Date | null;
  onClear?: (e: React.MouseEvent) => void;
  placeholderText?: string;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  (
    { open, selected, onClear, placeholderText = "Select date", ...rest },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={cn(
        // Base layout
        "group flex h-11 w-[260px] items-center gap-3 px-4 dark:bg-[#101828]",
        "text-left text-sm font-normal",
        // Base appearance
        "rounded-lg border bg-white",
        "shadow-sm transition-all duration-200 ease-out",
        // Default border + hover
        "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md dark:border-gray-600",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:border-zinc-900",
        // Open / active state
        open && "border-zinc-900 shadow-md ring-2 ring-zinc-900/10"
      )}
    >
      {/* Calendar icon badge */}
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          "transition-colors duration-200",
          open
            ? "bg-zinc-900 dark:bg-gray-300"
            : "bg-zinc-100 group-hover:bg-zinc-200 dark:bg-white"
        )}
      >
        <CalendarIcon
          className={cn(
            "h-3.5 w-3.5 transition-colors duration-200",
            open ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
          )}
        />
      </span>

      {/* Label */}
      {selected ? (
        <span className="font-medium text-zinc-900 dark:text-white">
          {format(selected, "MMM d, yyyy")}
        </span>
      ) : (
        <span className="text-zinc-400">{placeholderText}</span>
      )}

      {/* Clear × */}
      {selected && (
        <span
          role="button"
          tabIndex={0}
          onClick={onClear}
          onKeyDown={(e) => e.key === "Enter" && onClear?.(e as any)}
          className={cn(
            "ml-auto flex h-5 w-5 items-center justify-center rounded-full",
            "text-zinc-400 transition-all duration-150",
            "hover:bg-zinc-100 hover:text-zinc-700"
          )}
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  )
);
CustomInput.displayName = "CustomInput";

// ─── DatePicker ───────────────────────────────────────────────────────────────
export function DatePicker({
  selected,
  onChange,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
  placeholderText = "Select date",
  className,
  open,
  setOpen,
  label,
}: IDatePicker) {
  const handleChange = (date: Date | null) => {
    if (date) {
      if (selectsStart) onChange({ startDate: date, endDate: endDate || null });
      else if (selectsEnd)
        onChange({ startDate: startDate || null, endDate: date });
      else onChange({ startDate: date, endDate: date });
    }
    setOpen?.(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: null, endDate: null });
  };

  return (
    <>
      <style>{`
        .dp-popper { z-index: 9999 !important; padding-top: 6px !important; }

        .dp-popper .react-datepicker {
          font-family: inherit;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.06);
          overflow: hidden;
          background: #fff;
          padding: 0;
        }
        .dp-popper .react-datepicker__triangle { display: none !important; }
        .dp-popper .react-datepicker__navigation { display: none; }

        /* Header */
        .dp-popper .react-datepicker__header {
          background: #fff;
          border-bottom: 1px solid #f4f4f5;
          padding: 12px 12px 10px;
          border-radius: 0;
        }

        /* Day-name row */
        .dp-popper .react-datepicker__day-names {
          display: flex;
          justify-content: space-between;
          margin: 6px 0 0;
          padding: 0;
        }
        .dp-popper .react-datepicker__day-name {
          width: 36px; height: 24px; line-height: 24px;
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: #a1a1aa; margin: 0; text-align: center;
        }

        /* Month / week */
        .dp-popper .react-datepicker__month { margin: 8px 12px 12px; padding: 0; }
        .dp-popper .react-datepicker__week {
          display: flex; justify-content: space-between; margin-bottom: 2px;
        }

        /* Day cells */
        .dp-popper .react-datepicker__day {
          width: 36px; height: 36px; line-height: 36px;
          font-size: 13px; font-weight: 500;
          color: #3f3f46; border-radius: 8px; margin: 0;
          text-align: center;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .dp-popper .react-datepicker__day:hover {
          background: #f4f4f5; color: #09090b;
        }
        .dp-popper .react-datepicker__day--selected {
          background: #09090b !important; color: #fff !important;
          font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .dp-popper .react-datepicker__day--selected:hover {
          background: #27272a !important;
        }
        .dp-popper .react-datepicker__day--today {
          font-weight: 700; color: #09090b; position: relative;
        }
        .dp-popper .react-datepicker__day--today::after {
          content: ''; position: absolute;
          bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #09090b;
        }
        .dp-popper .react-datepicker__day--today.react-datepicker__day--selected::after {
          background: #fff;
        }
        .dp-popper .react-datepicker__day--outside-month { color: #d4d4d8; }
        .dp-popper .react-datepicker__day--outside-month:hover { color: #a1a1aa; }
        .dp-popper .react-datepicker__day--disabled {
          color: #d4d4d8 !important; cursor: not-allowed; pointer-events: none;
        }
          
        /* DARK MODE */
        .dark .dp-popper .react-datepicker {
          background: #18181b;
          border: 1px solid #27272a;
          color: #e4e4e7;
        }

        .dark .dp-popper .react-datepicker__header {
          background: #18181b;
          border-bottom: 1px solid #27272a;
        }

        .dark .dp-popper .react-datepicker__day-name {
          color: #71717a;
        }

        .dark .dp-popper .react-datepicker__day {
          color: #e4e4e7;
        }

        .dark .dp-popper .react-datepicker__day:hover {
          background: #27272a;
          color: #fff;
        }

        .dark .dp-popper .react-datepicker__day--outside-month {
          color: #52525b;
        }

        .dark .dp-popper .react-datepicker__day--selected {
          background: #3b82f6 !important; /* your blue primary */
          color: white !important;
        }

        .dark .dp-popper .react-datepicker__day--today {
          color: #fff;
        }

        .dark .dp-popper .react-datepicker__day--today::after {
          background: #3b82f6;
        }
      `}</style>

      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="select-none text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            {label}
          </label>
        )}

        <ReactDatePicker
          selected={selected}
          onChange={handleChange}
          selectsStart={selectsStart}
          selectsEnd={selectsEnd}
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          minDate={minDate ?? undefined}
          open={open}
          onInputClick={() => setOpen?.(true)}
          onClickOutside={() => setOpen?.(false)}
          popperClassName="dp-popper"
          popperPlacement="bottom-start"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-transparent text-zinc-500 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {format(date, "MMMM yyyy")}
              </span>

              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-transparent text-zinc-500 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          customInput={
            <CustomInput
              open={open}
              selected={selected}
              onClear={handleClear}
              placeholderText={placeholderText}
            />
          }
        />
      </div>
    </>
  );
}
