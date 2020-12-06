import React from 'react';
import { Icon } from '@ant-design/compatible';
import { MemberDropdown } from './MemberDropdown';
import { RemoveButtonGroup } from './RemoveButtonGroup';

export function MemberGroup(props: MemberGroupProps) {
  return (
    <span>
      {
        props.members.map(m => (
          <RemoveButtonGroup key={m.index || m.name} onRemoveClick={() => props.updateMethods.remove(m)}>
            <MemberDropdown availableMembers={props.availableMembers}
              onClick={(updateWith: any) => props.updateMethods.update(m, updateWith)}
            >
              {m.title}
            </MemberDropdown>
          </RemoveButtonGroup>
        ))
      }
      <MemberDropdown
        onClick={(m: any) => props.updateMethods.add(m)} availableMembers={props.availableMembers} type="dashed" icon={<Icon type="plus" />}
      >
        {props.addMemberName}
      </MemberDropdown>
    </span>
  )
}

export interface MemberGroupProps {
  members: any[]
  availableMembers: any[]
  addMemberName: string
  updateMethods: any
}