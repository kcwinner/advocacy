import React, { Fragment } from 'react';
import { Row, Col, Divider, Card, Popover, Button } from 'antd';
import { SortAscendingOutlined, BorderInnerOutlined } from '@ant-design/icons';
import { CubejsApi } from '@cubejs-client/core';
import { QueryBuilder } from '@cubejs-client/react';
import ChartRenderer from '../ChartRenderer';
import { MemberGroup } from './MemberGroup';
import { FilterGroup } from './FilterGroup';
import { TimeGroup } from './TimeGroup';
import { SelectChartType } from './SelectChartType';
import { OrderGroup } from './Order/OrderGroup';
import { Pivot } from './Pivot/Pivot';

export default function ExploreQueryBuilder(props: ExploreQueryBuilderProps) {
  return (
    <QueryBuilder vizState={props.vizState}
      setVizState={props.setVizState}
      cubejsApi={props.cubejsApi}
      wrapWithQueryRenderer={false}
      render={({
        validatedQuery,
        isQueryPresent,
        chartType,
        updateChartType,
        measures,
        availableMeasures,
        updateMeasures,
        dimensions,
        availableDimensions,
        updateDimensions,
        segments,
        availableSegments,
        updateSegments,
        filters,
        updateFilters,
        timeDimensions,
        availableTimeDimensions,
        updateTimeDimensions,
        orderMembers,
        updateOrder,
        pivotConfig,
        updatePivotConfig
      }: any) => {
        return (
          <Fragment>
            <Row justify="space-around" align="top" gutter={24} style={{ marginBottom: 12 }}>
              <Col span={24}>
                <Card>
                  <Row justify="space-around" align="top" gutter={24} style={{ marginBottom: 12 }}>
                    <Col span={24}>
                      <MemberGroup members={measures} availableMembers={availableMeasures} addMemberName="Measure" updateMethods={updateMeasures} />
                      <Divider type="vertical" />
                      
                      <MemberGroup members={dimensions} availableMembers={availableDimensions} addMemberName="Dimension" updateMethods={updateDimensions} />
                      <Divider type="vertical" />
                      
                      <MemberGroup members={segments} availableMembers={availableSegments} addMemberName="Segment" updateMethods={updateSegments} />
                      <Divider type="vertical" />

                      <TimeGroup members={timeDimensions} availableMembers={availableTimeDimensions} addMemberName="Time" updateMethods={updateTimeDimensions} />
                    </Col>
                  </Row>

                  <Row justify="space-around" align="top" gutter={24} style={{ marginBottom: 12 }}>
                    <Col span={24}>
                      <FilterGroup members={filters} availableMembers={availableDimensions.concat(availableMeasures)} addMemberName="Filter" updateMethods={updateFilters} />
                    </Col>
                  </Row>

                  <Row justify="space-around" align="top" gutter={24}>
                    <Col span={24}>
                      <SelectChartType chartType={chartType} updateChartType={updateChartType} />

                      <Divider type="vertical" />

                      <Popover content={<OrderGroup orderMembers={orderMembers} onReorder={updateOrder.reorder} onOrderChange={updateOrder.set} />} placement="bottomLeft" trigger="click">
                        <Button disabled={!isQueryPresent} icon={<SortAscendingOutlined />}>
                          Order
                        </Button>
                      </Popover>

                      <Divider type="vertical" />

                      <Popover content={<Pivot pivotConfig={pivotConfig} onMove={updatePivotConfig.moveItem} onUpdate={updatePivotConfig.update} />} placement="bottomLeft" trigger="click">
                        <Button disabled={!isQueryPresent} icon={<BorderInnerOutlined />}>
                          Pivot
                        </Button>
                      </Popover>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row justify="space-around" align="top" gutter={24}>
              <Col span={24}>
                {
                  isQueryPresent
                    ? <Card style={{ minHeight: 420 }} extra={props.chartExtra}>
                      <ChartRenderer vizState={{ query: validatedQuery, chartType, pivotConfig }} />
                    </Card>
                    : <h2 style={{ textAlign: 'center' }}> Choose a measure or dimension to get started </h2>
                }
              </Col>
            </Row>
          </Fragment>
        );
      }}
    />
  );
}

export interface ExploreQueryBuilderProps {
  vizState: any
  cubejsApi: CubejsApi
  setVizState: any // I think it's a function
  chartExtra: any[]
}