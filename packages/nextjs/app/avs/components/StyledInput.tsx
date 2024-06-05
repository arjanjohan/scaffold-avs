import React, { ChangeEvent } from "react";

interface StyledInputProps {
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
}

const StyledInput: React.FC<StyledInputProps> = ({ type, value, onChange, name, disabled }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center ml-2">
        <span className="text-xs font-medium mr-2 leading-none">{name}</span>
      </div>
      <div className={"flex border-2 border-base-300 bg-base-200 rounded-full text-accent"}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={name}
          disabled={disabled ? true : false}
          className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
        />
      </div>
    </div>
  );
};

export default StyledInput;
