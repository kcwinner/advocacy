import React from 'react';
import { Card, Menu, Button, Dropdown, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { Icon } from '@ant-design/compatible';

import * as API from '../lib/api';

interface DashboardItemDropdownProps {
  itemId: string
}

function DashboardItemDropdown(props: DashboardItemDropdownProps) {
  const [deleteDashboardItem] = API.DeleteDashboardItem();

  const dashboardItemDropdownMenu = <Menu>
    <Menu.Item>
      <Link to={`/explore?itemId=${props.itemId}`}>Edit</Link>
    </Menu.Item>
    <Menu.Item onClick={() => Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk() {
        deleteDashboardItem({ id: props.itemId });
      }

    })}>
      Delete
      </Menu.Item>
  </Menu>;

  return (
    <Dropdown overlay={dashboardItemDropdownMenu} placement="bottomLeft" trigger={['click']}>
      <Button shape="circle" icon={<Icon type="menu" />} />
    </Dropdown>
  )
}

export function DashboardItem(props: DashboardItemProps) {
  return (
    <Card title={props.title} style={{
      height: '100%',
      width: '100%'
    }} extra={<DashboardItemDropdown itemId={props.itemId} />}>
      {props.children}
    </Card>
  )
}

export interface DashboardItemProps {
  itemId: string
  children: any
  title: string
}