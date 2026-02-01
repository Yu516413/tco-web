"use client";

import * as React from "react";

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;

  // 可选配置
  step?: number;       // 默认 0.01
  min?: number;
  max?: number;
  decimals?: number;   // 默认根据 step 推断
};

function decimalsFromStep(step: number) {
  const s = step.toString();
  if (!s.includes(".")) return 0;
  return s.split(".")[1]?.length ?? 0;
}

function clamp(x: number, min?: number, max?: number) {
  let v = x;
  if (typeof min === "number") v = Math.max(min, v);
  if (typeof max === "number") v = Math.min(max, v);
  return v;
}

function roundToStep(x: number, step: number, decimals: number) {
  // 避免 0.1 + 0.2 这种浮点误差
  const scaled = Math.round(x / step) * step;
  return Number(scaled.toFixed(decimals));
}

export default function NumberInput({
  label,
  value,
  onChange,
  step = 0.01,
  min,
  max,
  decimals,
}: NumberInputProps) {
  const d = decimals ?? decimalsFromStep(step);

  // 用 string state 允许用户输入 "8." / "" / "-" 这种中间态
  const [text, setText] = React.useState<string>(() => value.toFixed(d));

  // 外部 value 变化时同步输入框显示
  React.useEffect(() => {
    setText(value.toFixed(d));
  }, [value, d]);

  const commit = (raw: string) => {
    // 空/非法：回退到当前 value
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setText(value.toFixed(d));
      return;
    }

    const v1 = clamp(parsed, min, max);
    const v2 = roundToStep(v1, step, d);
    onChange(v2);
    setText(v2.toFixed(d));
  };

  const inc = (delta: number) => {
    const v1 = clamp(value + delta, min, max);
    const v2 = roundToStep(v1, step, d);
    onChange(v2);
    setText(v2.toFixed(d));
  };

  return (
    <div className="mb-4">
      <div className="text-sm text-gray-700 mb-2">{label}</div>

      <div className="flex items-center justify-between gap-3 bg-white rounded-2xl shadow px-3 py-3">
        {/* 可手动输入 */}
        <input
          className="w-28 text-lg font-semibold outline-none bg-transparent"
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => commit(text)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(text);
          }}
        />

        {/* - / + 按钮 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-12 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl"
            onClick={() => inc(-step)}
          >
            −
          </button>
          <button
            type="button"
            className="w-12 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl"
            onClick={() => inc(step)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
