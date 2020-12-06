import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import * as API from '../lib/api';

const ReactGridLayout = WidthProvider(RGL);

export function Dashboard(props: DashboardProps) {
  const [updateDashboardItem] = API.UpdateDashboardItem();

  const onLayoutChange = (newLayout: any) => {
    newLayout.forEach((l: any) => {
      const item = props.dashboardItems.find((i: any) => i.id.toString() === l.i);
      const toUpdate = JSON.stringify({
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h
      });

      if (item && toUpdate !== item.layout) {
        updateDashboardItem({ id: item.id, layout: toUpdate });
      }
    });
  }
  return (
    <ReactGridLayout cols={12} rowHeight={50} onLayoutChange={onLayoutChange}>
      {props.children}
    </ReactGridLayout>
  )
}

export interface DashboardProps {
  children: any
  dashboardItems: any
}