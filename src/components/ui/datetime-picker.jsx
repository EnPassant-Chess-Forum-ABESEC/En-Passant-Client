"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateTimePicker({ date, setDate }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(date ? new Date(date) : undefined);
  const [timeValue, setTimeValue] = React.useState(
    date ? format(new Date(date), "hh:mm a") : "12:00 AM"
  );

  React.useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
      setTimeValue(format(new Date(date), "hh:mm a"));
    }
  }, [date]);

  const handleDateSelect = (newDate) => {
    if (!newDate) return;
    const [time, period] = timeValue.split(" ");
    const [hours, minutes] = time.split(":");
    let parsedHours = parseInt(hours, 10);
    if (period === "PM" && parsedHours < 12) parsedHours += 12;
    if (period === "AM" && parsedHours === 12) parsedHours = 0;

    newDate.setHours(parsedHours);
    newDate.setMinutes(parseInt(minutes, 10));
    newDate.setSeconds(0);
    setSelectedDate(newDate);
    setDate(newDate.toISOString());
  };

  const handleTimeChange = (type, value) => {
    const [time, period] = timeValue.split(" ");
    let [hours, minutes] = time.split(":");
    let newPeriod = period;

    if (type === "hour") hours = value;
    if (type === "minute") minutes = value;
    if (type === "period") newPeriod = value;

    const newTimeValue = `${hours}:${minutes} ${newPeriod}`;
    setTimeValue(newTimeValue);

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      let parsedHours = parseInt(hours, 10);
      if (newPeriod === "PM" && parsedHours < 12) parsedHours += 12;
      if (newPeriod === "AM" && parsedHours === 12) parsedHours = 0;

      newDate.setHours(parsedHours);
      newDate.setMinutes(parseInt(minutes, 10));
      newDate.setSeconds(0);
      setSelectedDate(newDate);
      setDate(newDate.toISOString());
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-start text-left bg-slate-50 dark:bg-[#020617] border rounded-xl px-4 h-[50px] text-sm outline-none transition-colors font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            isOpen ? "border-blue-500" : "border-slate-200 dark:border-slate-800",
            !date && "text-slate-400 dark:text-slate-500"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-blue-600/70 shrink-0" />
          {date ? format(new Date(date), "MM/dd/yyyy hh:mm a") : <span>Pick a date and time</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 ring-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-lg overflow-hidden"
        style={{ width: "290px" }}
        align="start"
      >
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="w-full bg-transparent dark:bg-transparent"
          />
        </div>
        <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium shrink-0">
            <Clock className="w-4 h-4" />
            Time
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Select value={timeValue.split(" ")[0].split(":")[0]} onValueChange={(v) => handleTimeChange("hour", v)}>
              <SelectTrigger className="w-[56px] px-1.5 h-8 bg-white dark:bg-[#020617] text-slate-800 dark:text-slate-200 focus:ring-0 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="min-w-[80px] bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {Array.from({ length: 12 }, (_, i) => {
                  const val = (i + 1).toString().padStart(2, "0");
                  return <SelectItem key={val} value={val} className="focus:bg-slate-100 dark:focus:bg-slate-800">{val}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">:</span>
            <Select value={timeValue.split(" ")[0].split(":")[1]} onValueChange={(v) => handleTimeChange("minute", v)}>
              <SelectTrigger className="w-[56px] px-1.5 h-8 bg-white dark:bg-[#020617] text-slate-800 dark:text-slate-200 focus:ring-0 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="min-w-[80px] bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {Array.from({ length: 60 }, (_, i) => {
                  const val = i.toString().padStart(2, "0");
                  return <SelectItem key={val} value={val} className="focus:bg-slate-100 dark:focus:bg-slate-800">{val}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={timeValue.split(" ")[1]} onValueChange={(v) => handleTimeChange("period", v)}>
              <SelectTrigger className="w-[62px] px-1.5 h-8 bg-white dark:bg-[#020617] text-slate-800 dark:text-slate-200 focus:ring-0 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="AM" />
              </SelectTrigger>
              <SelectContent className="min-w-[80px] bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <SelectItem value="AM" className="focus:bg-slate-100 dark:focus:bg-slate-800">AM</SelectItem>
                <SelectItem value="PM" className="focus:bg-slate-100 dark:focus:bg-slate-800">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
