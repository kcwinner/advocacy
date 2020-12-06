import React from 'react';
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import { ButtonDropdown } from './ButtonDropdown';
import { MemberDropdown } from './MemberDropdown';
import { RemoveButtonGroup } from './RemoveButtonGroup';

const DateRanges = [
  { title: 'All time', value: undefined },
  { value: 'Today' },
  { value: 'Yesterday' },
  { value: 'This week' },
  { value: 'This month' },
  { value: 'This quarter' },
  { value: 'This year' },
  { value: 'Last 7 days' },
  { value: 'Last 30 days' },
  { value: 'Last week' },
  { value: 'Last month' },
  { value: 'Last quarter' },
  { value: 'Last year' }
];

export function TimeGroup(props: TimeGroupProps) {
  const granularityMenu = (member: any, onClick: any) => {
    return (
      <Menu>
        {
          member.granularities.length
            ? member.granularities.map((member: any) => <Menu.Item key={member.title} onClick={() => onClick(member)}>{member.title}</Menu.Item>)
            : <Menu.Item disabled>No members found</Menu.Item>
        }
      </Menu>
    )
  };

  const dateRangeMenu = (onClick: any) => {
    return (
      <Menu>
        {
          DateRanges.map(m => <Menu.Item key={m.title || m.value} onClick={() => onClick(m)}>
            {m.title || m.value}
          </Menu.Item>)
        }
      </Menu>
    )
  };

  return (
    <span>
      {
        props.members.map(m => [
          <RemoveButtonGroup onRemoveClick={() => props.updateMethods.remove(m)} key={`${m.dimension.name}-member`}>
            <MemberDropdown availableMembers={props.availableMembers}
              onClick={(updateWith: any) => props.updateMethods.update(m, { ...m, dimension: updateWith })}
            >
              {m.dimension.title}
            </MemberDropdown>
          </RemoveButtonGroup>,
          <b key={`${m.dimension.name}-for`}>FOR</b>,
          <ButtonDropdown key={`${m.dimension.name}-date-range`}
            style={{ marginLeft: 8, marginRight: 8 }}
            overlay={dateRangeMenu((dateRange: any) => props.updateMethods.update(m, { ...m, dateRange: dateRange.value }))}
          >
            {m.dateRange || 'All time'}
          </ButtonDropdown>,
          <b key={`${m.dimension.name}-by`}>BY</b>,
          <ButtonDropdown overlay={granularityMenu(m.dimension, (granularity: any) => props.updateMethods.update(m, {
            ...m,
            granularity: granularity.name
          }))}
            style={{ marginLeft: 8 }}
            key={`${m.dimension.name}-granularity`}
          >
            {m.dimension.granularities.find((g: any) => g.name === m.granularity) && m.dimension.granularities.find((g: any) => g.name === m.granularity).title}
          </ButtonDropdown>
        ])
      }
      {
        !props.members.length &&
        <MemberDropdown type="dashed" icon={<Icon type="plus" />}
          onClick={(member: any) => props.updateMethods.add({ dimension: member, granularity: 'day' })}
          availableMembers={props.availableMembers}
        >
          {props.addMemberName}
        </MemberDropdown>
      }
    </span>
  );
}

export interface TimeGroupProps {
  members: any[]
  availableMembers: any[]
  addMemberName: string
  updateMethods: any
}