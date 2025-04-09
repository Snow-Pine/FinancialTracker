import React from "react";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  return (
    <div className="w-full bg-gray-300 rounded-full h-4">
      <div
        className="bg-bank-gradient h-4 rounded-full"
        style={{ width: `${clampedProgress}%`, backgroundColor: clampedProgress > 0 ? 'black' : 'black' }}
      ></div>
    </div>
  );
};
