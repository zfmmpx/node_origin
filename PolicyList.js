import React, { Component } from 'react';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import { Row, Col, Card, Button } from 'antd';
import PropTypes from 'prop-types';
import ButtonOfClaim from '@/components/ButtonOfClaim';
import PolicyListItem from './PolicyListItem';
import styles from './PolicyList.less';
import { formatMessageApi } from '@/utils/dictFormatMessage';

@connect(({ jpcrOfClaimRegistrationController }) => ({
  policyList: jpcrOfClaimRegistrationController.claimProcessData?.policyList,
  parentClaimNo: jpcrOfClaimRegistrationController.claimProcessData?.parentClaimNo,
  applicationList: lodash
    .chain(jpcrOfClaimRegistrationController.claimProcessData)
    .get('applicationList')
    .value(),
}))
class PolicyList extends Component {
  static contextTypes = {
    taskDetail: PropTypes.object,
    callAction: PropTypes.func,
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    const addItem = {
      claimNo: '',
      basicPlanName: '',
      benefitTypes: [],
      decision: 0,
      deleted: 0,
      external: 0,
      id: uuidv4(),
      insuredAddress: '',
      policyNo: '',
    };

    dispatch({
      type: 'jpcrOfClaimRegistrationController/addPolicyItem',
      payload: {
        addItem,
      },
    });
  };

  handleAddApplyList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'jpcrOfClaimRegistrationController/queryApplicationList',
    });
  };

  render() {
    const { policyList, parentClaimNo } = this.props;
    const {
      taskDetail: { taskStatus },
    } = this.context;
    const showButton = parentClaimNo !== '' || taskStatus === 'completed';

    const policyNotEditable = lodash.find(
      policyList,
      item => item.decision === 1 || item?.decision?.value,
    );
    return (
      <div className={styles.policyList}>
        <Card
          title={formatMessage({
            id: 'app.navigator.task-detail-of-data-capture.title.policy-information',
          })}
        >
          {policyList?.map?.(item => <PolicyListItem policyListItem={item} key={item.id} />)}
          {!showButton && (
            <Row type="flex" gutter={16} justify="center">
              <Col span={12}>
                <div>
                  <ButtonOfClaim
                    handleClick={this.handleAdd}
                    buttonText={formatMessage({
                      id: 'app.navigator.task-detail-of-data-capture.label.policy-no',
                    })}
                    buttonStyle={{ height: '36px' }}
                  />
                </div>
                <div className="listButton">
                  <Button
                    type="primary"
                    disabled={!policyNotEditable}
                    onClick={this.handleAddApplyList}
                  >
                    {formatMessageApi({
                      button: 'app.navigator.task-detail-of-data-capture.button.accept',
                    })}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    );
  }
}

export default PolicyList;
