import React from "react";
// 💡 FIX: Import the new utility function
import { formatBytes } from "../utils/format";

type Savings = {
  bytes_saved: number;
  total_unique_bytes: number;
  total_logical_bytes: number;
  percent_saved: number;
};

type Props = { savings: Savings };

const SavingsBadge: React.FC<Props> = ({ savings }) => {
  return (
    <span className="text-xs rounded border px-2 py-1 text-gray-600 bg-gray-50">
      Storage saved: {savings.percent_saved.toFixed(2)}% (
      {/* 💡 FIX: Use the robust formatBytes function */}
      {formatBytes(savings.bytes_saved)})
    </span>
  );
};

export default SavingsBadge;