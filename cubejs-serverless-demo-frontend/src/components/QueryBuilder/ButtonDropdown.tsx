import React from 'react';
import { Button, Dropdown } from 'antd';

export function ButtonDropdown({ overlay, ...buttonProps }: ButtonDropdownProps) {
    return (
        <Dropdown overlay={overlay} placement="bottomLeft" trigger={['click']}>
            <Button {...buttonProps} />
        </Dropdown>
    )
}

export interface ButtonDropdownProps {
    overlay: any
    [x: string]: any
}