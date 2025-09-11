import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DateTimeInputProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  label,
  placeholder,
  disabled,
  id,
  onChange,
  value
}) => {
  const onChangehandler = (value: string) => {
    const formattedDateTime = dayjs(value).local().format();
    onChange(formattedDateTime);
  };

  return (
    <div className="flex-1 flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-slate-900">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="datetime-local"
        disabled={disabled}
        onChange={(e) => onChangehandler(e.target.value)}
        value={dayjs(value).format("YYYY-MM-DDTHH:mm")}
        className="bg-white border border-gray-200 rounded-lg mt-1 h-10 pl-3 text-sm"
      />
    </div>
  );
};

export default DateTimeInput;
// 2025-09-01T01:35
