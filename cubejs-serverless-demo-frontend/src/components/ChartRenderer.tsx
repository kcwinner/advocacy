import React from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import { Spin, Row, Col, Statistic, Table } from 'antd';
import { CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line } from 'recharts';

interface CartesianChartProps {
  resultSet: any
  children: any
  ChartComponent: any
}

function CartesianChart(props: CartesianChartProps) {
  const ChartComponent = props.ChartComponent;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartComponent data={props.resultSet.chartPivot()}>
        <XAxis dataKey="x" />
        <YAxis />
        <CartesianGrid />
        {props.children}
        <Legend />
        <Tooltip />
      </ChartComponent>
    </ResponsiveContainer>
  )
}

const colors = ['#FF6492', '#141446', '#7A77FF'];

const TypeToChartComponent: any = {
  line: ({ resultSet }: any) => (
    <CartesianChart resultSet={resultSet} ChartComponent={LineChart}>
      {resultSet.seriesNames().map((series: any, i: any) => <Line key={series.key} dataKey={series.key} name={series.title} stroke={colors[i]} />)}
    </CartesianChart>
  ),
  bar: ({ resultSet }: any) => (
    <CartesianChart resultSet={resultSet} ChartComponent={BarChart}>
      {resultSet.seriesNames().map((series: any, i: any) => <Bar key={series.key} stackId="a" dataKey={series.key} name={series.title} fill={colors[i]} />)}
    </CartesianChart>
  ),
  area: ({ resultSet }: any) => (
    <CartesianChart resultSet={resultSet} ChartComponent={AreaChart}>
      {resultSet.seriesNames().map((series: any, i: any) => <Area key={series.key} stackId="a" dataKey={series.key} name={series.title} stroke={colors[i]} fill={colors[i]} />)}
    </CartesianChart>
  ),
  pie: ({ resultSet }: any) => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie isAnimationActive={false} data={resultSet.chartPivot()} nameKey="x" dataKey={resultSet.seriesNames()[0].key} fill="#8884d8">
          {resultSet.chartPivot().map((_: any, index: any) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ),
  number: ({ resultSet }: any) => (
    <Row justify="center" align="middle" style={{ height: '100%' }}>
      <Col>
        {resultSet.seriesNames().map((s: any) => <Statistic value={resultSet.totalRow()[s.key]} />)}
      </Col>
    </Row>
  ),
  table: ({ resultSet, pivotConfig }: any) => <Table pagination={false} columns={resultSet.tableColumns(pivotConfig)} dataSource={resultSet.tablePivot(pivotConfig)} />
};

const TypeToMemoChartComponent = Object.keys(TypeToChartComponent).map((key: any) => ({
  [key]: React.memo(TypeToChartComponent[key])
})).reduce((a, b) => ({ ...a, ...b }));

const renderChart = (Component: any) => ({
  resultSet,
  error,
  pivotConfig
}: any) => resultSet && <Component resultSet={resultSet} pivotConfig={pivotConfig} /> || error && error.toString() || <Spin />;

export function ChartRenderer(props: ChartRendererProps) {
  const { query, chartType, pivotConfig } = props.vizState;
  const component = TypeToMemoChartComponent[chartType];
  const renderProps = useCubeQuery(query);

  return component && renderChart(component)({
    ...renderProps,
    pivotConfig
  })
}

export interface ChartRendererProps {
  vizState: any
}

export default ChartRenderer;