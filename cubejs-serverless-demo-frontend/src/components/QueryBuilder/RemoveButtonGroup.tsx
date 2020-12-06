import React from 'react';
import { Button } from 'antd';
import { Icon } from '@ant-design/compatible';

export function RemoveButtonGroup({ onRemoveClick, children, ...props }: RemoveButtonGroupProps) {
  return (
    <Button.Group style={{ marginRight: 8 }} {...props}>
      {children}
      <Button type="default" onClick={onRemoveClick}>
        <Icon type="close" />
      </Button>
    </Button.Group>
  )
}

export interface RemoveButtonGroupProps {
  onRemoveClick: (event: React.MouseEvent) => void
  children: any
  [x: string]: any
}