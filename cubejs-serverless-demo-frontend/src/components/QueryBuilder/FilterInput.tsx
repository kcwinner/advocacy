import React from 'react';
import { Select, Input } from 'antd';

interface FilterInputStringProps {
  values: any[]
  onChange: (value?: any, option?: any) => void
}

interface FilterInputNumberProps {
  values: any[]
  onChange: (value?: any, option?: any) => void
}

const FilterInputs: any = {
  string: ({ values, onChange }: FilterInputStringProps) => (
    <Select key="input"
      style={{ width: 300 }}
      mode="tags"
      onChange={onChange} value={values}
    />
  ),
  number: ({ values, onChange }: FilterInputNumberProps) => (
    <Input key="input"
      style={{ width: 300 }}
      onChange={e => onChange([e.target.value])} value={values && values[0] || ''}
    />
  )
};

export function FilterInput(props: FilterInputProps) {
  const Filter = FilterInputs[props.member.dimension.type] || FilterInputs.string;
  return (
    <Filter key="filter"
      values={props.member.values}
      onChange={(values: any) => props.updateMethods.update(props.member, { ...props.member, values })}
    />
  );
}

export interface FilterInputProps {
  member: any
  updateMethods: any
}