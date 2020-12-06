import { Checkbox } from 'antd';
import React from 'react';

export function Options({ pivotConfig, onUpdate }: any) {
  return (
    <Checkbox checked={pivotConfig.fillMissingDates}
      onChange={() => onUpdate({ fillMissingDates: !pivotConfig.fillMissingDates })}
    >
      Fill Missing Dates
    </Checkbox>
  );
}