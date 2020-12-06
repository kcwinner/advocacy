import React, { useState, useContext } from 'react';
import { Alert, Button, Spin } from 'antd';

import { withRouter } from 'react-router-dom';
import ExploreQueryBuilder from '../components/QueryBuilder/ExploreQueryBuilder';

import { TitleModal } from '../components/TitleModal';

import * as API from '../lib/api';

import { CubeContext } from '@cubejs-client/react';

const ExplorePage = withRouter(({ history, location }) => {
  const { cubejsApi } = useContext(CubeContext);

  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const params = new URLSearchParams(location.search);
  const itemId = params.get('itemId');
  const { data, error, isFetching } = API.GetDashboardItem({ id: itemId || '' });

  const [vizState, setVizState] = useState(null);
  const finalVizState = vizState || itemId && !isFetching && data && JSON.parse(data.vizState || '') || {};
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const finalTitle = title != null ? title : itemId && !isFetching && data && data.name || 'New Chart';

  if (isFetching) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error.toString()} />;
  }

  return (
    <div>
      <TitleModal history={history} itemId={itemId} titleModalVisible={titleModalVisible} setTitleModalVisible={setTitleModalVisible} setAddingToDashboard={setAddingToDashboard} finalVizState={finalVizState} setTitle={setTitle} finalTitle={finalTitle} />
      <ExploreQueryBuilder vizState={finalVizState}
        setVizState={setVizState}
        cubejsApi={cubejsApi}
        chartExtra={[
          <Button key="button" type="primary" loading={addingToDashboard} onClick={() => setTitleModalVisible(true)}>
            {itemId ? 'Update' : 'Add to Dashboard'}
          </Button>
        ]}
      />
    </div>
  );
});

export default ExplorePage;