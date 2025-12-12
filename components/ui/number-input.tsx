"use client";

import { useState } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

/** Number input with + and − buttons */
export default function NumberInput({
  label,
  value,
  step = 1,
  min = 0,
  max = 999999,
  onChange,
}: NumberInputProps) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>

      <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border w-64">
        <span className="flex-1 text-gray-800 font-semibold">{value.toFixed(2)}</span>
        <button onClick={decrease} className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300">−</button>
        <button onClick={increase} className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300">+</button>
      </div>
    </div>
  );
}
