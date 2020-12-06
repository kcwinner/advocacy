import React from 'react';
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import { ButtonDropdown } from './ButtonDropdown';

const ChartTypes = [
  { name: 'line', title: 'Line', icon: 'line-chart' },
  { name: 'area', title: 'Area', icon: 'area-chart' },
  { name: 'bar', title: 'Bar', icon: 'bar-chart' },
  { name: 'pie', title: 'Pie', icon: 'pie-chart' },
  { name: 'table', title: 'Table', icon: 'table' },
  { name: 'number', title: 'Number', icon: 'info-circle' }
];

export function SelectChartType(props: SelectChartTypeProps) {
  const foundChartType = ChartTypes.find(t => t.name === props.chartType);
  const menu = (
    <Menu>
      {
        ChartTypes.map(m => {
          return (
            <Menu.Item key={m.title} onClick={() => props.updateChartType(m.name)}>
              <Icon type={m.icon} />
              {m.title}
            </Menu.Item>
          )
        })
      }
    </Menu>
  );

  return (
    <ButtonDropdown overlay={menu} icon={<Icon type={foundChartType?.icon} />}>
      {foundChartType?.title}
    </ButtonDropdown>
  );
}

export interface SelectChartTypeProps {
  chartType: string
  updateChartType: Function
}

export default SelectChartType;