import './body.css';
import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '@ant-design/compatible';

import { Layout } from 'antd';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';

import Header from './components/Header';

import ExplorePage from './pages/ExplorePage';
import DashboardPage from './pages/DashboardPage';

import { withAuthenticator } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports.js';
Amplify.configure(aws_exports);

const API_URL = '<YOUR_API_URL>'
const CUBEJS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDY3NDY5MjcsImV4cCI6MTYwOTMzODkyN30.k9kkeIbLsQ7JtaSVfE-UxPrAJUUK2ZhTtuBT0sKPOOk';
const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`
});

function AppLayout(props: any) {
  return (
    <Layout style={{ height: '100%' }}>
      <Header />
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  )
}

function App(props: any) {
  return (
    <Router>
      <CubeProvider cubejsApi={cubejsApi}>
        <AppLayout>
          {props.children}
          <Route key="index" exact path="/" component={DashboardPage} />
          <Route key="explore" path="/explore" component={ExplorePage} />
        </AppLayout>
      </CubeProvider>
    </Router>
  );
}


export default withAuthenticator(App);