import React from 'react';
import { Auth } from 'aws-amplify';
import { Modal, Input } from 'antd';
import * as API from '../lib/api';

export function TitleModal(props: TitleModalProps) {
  const [createDashboardItem] = API.CreateDashboardItem();
  const [updateDashboardItem] = API.UpdateDashboardItem();

  const onOk = async () => {
    props.setTitleModalVisible(false);
    props.setAddingToDashboard(true);

    const user = await Auth.currentUserInfo();

    try {
      await (props.itemId ? updateDashboardItem : createDashboardItem)({
        id: props.itemId,
        userID: user.attributes.sub,
        vizState: JSON.stringify(props.finalVizState),
        name: props.finalTitle
      });
      props.history.push('/');
    } finally {
      props.setAddingToDashboard(false);
    }
  }

  return (
    <Modal key="modal"
      title="Save Chart"
      visible={props.titleModalVisible}
      onOk={onOk}
      onCancel={() => props.setTitleModalVisible(false)}
    >
      <Input placeholder="Dashboard Item Name" value={props.finalTitle} onChange={e => props.setTitle(e.target.value)} />
    </Modal>
  )
}

export interface TitleModalProps {
  history: any
  itemId: any
  titleModalVisible: any
  setTitleModalVisible: any
  setAddingToDashboard: any
  finalVizState: any
  setTitle: any
  finalTitle: any
}