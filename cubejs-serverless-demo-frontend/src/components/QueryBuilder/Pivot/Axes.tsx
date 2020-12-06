import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Row, Col, Divider } from 'antd';
import { DroppableArea } from './DroppableArea';

export function Axes({ pivotConfig, onMove }: any) {
  const [uiPivotConfig, setUIPivotConfig] = useState(pivotConfig);

  useEffect(() => {
    setUIPivotConfig(pivotConfig);
  }, [pivotConfig]);

  return (
    <DragDropContext onDragEnd={({ source, destination }: any) => {
      if (!destination) {
        return;
      }

      onMove({
        sourceIndex: source.index,
        destinationIndex: destination.index,
        sourceAxis: source.droppableId,
        destinationAxis: destination.droppableId,

        callback(updatedPivotConfig: any) {
          setUIPivotConfig(updatedPivotConfig);
        }
      });
    }}>
      <Row>
        <Col span={11}>
          <DroppableArea pivotConfig={uiPivotConfig} axis="x" />
        </Col>

        <Col span={2}>
          <Divider style={{
            height: '100%'
          }} type="vertical" />
        </Col>

        <Col span={11}>
          <DroppableArea pivotConfig={uiPivotConfig} axis="y" />
        </Col>
      </Row>
    </DragDropContext>
  );
}