import React from "react";

interface StyledButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
  children: React.ReactNode;
  className: string;
  pendingText: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  onClick,
  disabled,
  isPending,
  children,
  className,
  pendingText,
}) => {
  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
      <div className="flex justify-between gap-2 flex-wrap">
        <button className={`btn ${className} btn-sm`} disabled={disabled} onClick={onClick}>
          {isPending && <span className="loading loading-spinner loading-xs"></span>}
          {isPending ? pendingText : children}
        </button>
      </div>
    </div>
  );
};

export default StyledButton;
