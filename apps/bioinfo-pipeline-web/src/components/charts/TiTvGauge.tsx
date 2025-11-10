"use client";

import React from 'react';
import type { EChartsOption, GaugeSeriesOption } from 'echarts';
import EChart from '@/components/echarts/EChart';

export default function TiTvGauge({ value }: { value: number }) {
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 4,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.5, '#ef4444'],
              [0.75, '#f59e0b'],
              [1, '#22c55e'],
            ],
          },
        },
        pointer: { width: 4 },
        detail: { formatter: (v: number) => v.toFixed(2), fontSize: 16 },
        data: [{ value }],
      } as GaugeSeriesOption,
    ],
  };
  return <EChart option={option} />;
}
