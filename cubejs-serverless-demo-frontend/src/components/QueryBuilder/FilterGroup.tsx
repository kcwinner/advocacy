import React from 'react';
import { Select } from 'antd';
import { Icon } from '@ant-design/compatible';
import { MemberDropdown } from './MemberDropdown';
import { RemoveButtonGroup } from './RemoveButtonGroup';
import { FilterInput } from './FilterInput';

export function FilterGroup(props: FilterGroupProps) {
  return (
    <span>
      {
        props.members.map(m => (
          <div style={{ marginBottom: 12 }} key={m.index}>
            <RemoveButtonGroup onRemoveClick={() => props.updateMethods.remove(m)}>
              <MemberDropdown onClick={updateWith => props.updateMethods.update(m, {
                ...m,
                dimension: updateWith
              })} availableMembers={props.availableMembers} style={{
                width: 150,
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {m.dimension.title}
              </MemberDropdown>
            </RemoveButtonGroup>
            <Select value={m.operator} onChange={operator => props.updateMethods.update(m, {
              ...m,
              operator
            })}
              style={{ width: 200, marginRight: 8 }}
            >
              {
                m.operators.map((operator: any) => (
                  <Select.Option key={operator.name} value={operator.name}>
                    {operator.title}
                  </Select.Option>
                ))
              }
            </Select>
            <FilterInput member={m} key="filterInput" updateMethods={props.updateMethods} />
          </div>
        ))}
      <MemberDropdown onClick={m => props.updateMethods.add({
        dimension: m
      })} availableMembers={props.availableMembers} type="dashed" icon={<Icon type="plus" />}>
        {props.addMemberName}
      </MemberDropdown>
    </span>
  );
}

export interface FilterGroupProps {
  members: any[]
  availableMembers: any[]
  addMemberName: string
  updateMethods: any
}