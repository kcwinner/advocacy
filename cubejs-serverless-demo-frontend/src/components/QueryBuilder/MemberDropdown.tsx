import React from 'react';
import { Menu } from 'antd';
import { ButtonDropdown } from './ButtonDropdown'; // Can't be a Pure Component due to Dropdown lookups overlay component type to set appropriate styles

function memberMenu(onClick: any, availableMembers: any) {
  return (
    <Menu>
      {
        availableMembers.length
          ? availableMembers.map((m: any) => (<Menu.Item key={m.name} onClick={() => onClick(m)}> {m.title} </Menu.Item>))
          : <Menu.Item disabled>No members found</Menu.Item>
      }
    </Menu>
  )
};


export function MemberDropdown({ onClick, availableMembers, ...buttonProps}: MemberDropdownProps) {
  return (
    <ButtonDropdown overlay={memberMenu(onClick, availableMembers)} {...buttonProps} />
  )
}

export interface MemberDropdownProps {
  onClick: (event: any) => void
  availableMembers: any[]
  [x: string]: any
}