import React, { PureComponent } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import { formatMessage } from 'umi/locale';
import ButtonOfClaim from '@/components/ButtonOfClaim';
import ServiceListItemOfPayableListItem from './ServiceListItemOfPayableListItem';
import ServiceListItemOfPayableListItemAdd from './ServiceListItemOfPayableListItemAdd';

const mapStateToProps = (
  { daOfClaimAssessmentController },
  { treatmentId, invoiceId, serviceId },
) => {
  let allInvoicePayableList = [];
  lodash.map(daOfClaimAssessmentController.claimProcessData.claimPayableList, claimPayableItem => {
    lodash.map(claimPayableItem.treatmentPayableList, treatmentPayableItem => {
      if (
        treatmentPayableItem.treatmentId === treatmentId &&
        treatmentPayableItem.invoicePayableList &&
        treatmentPayableItem.invoicePayableList.length > 0
      ) {
        allInvoicePayableList = [
          ...allInvoicePayableList,
          ...treatmentPayableItem.invoicePayableList,
        ];
      }
    });
  });

  const invoiceGrouped = lodash.groupBy(allInvoicePayableList, 'invoiceId');
  const curInvoicePayableList = invoiceGrouped[invoiceId];

  let allServiceItemPayableList = [];
  lodash.map(curInvoicePayableList, payableItem => {
    lodash.map(payableItem.serviceItemPayableList, serviceItemPayableItem => {
      if (serviceItemPayableItem?.serviceItemId === serviceId) {
        allServiceItemPayableList = [...allServiceItemPayableList, serviceItemPayableItem];
      }
    });
  });

  return {
    curServicePayableList: allServiceItemPayableList,
    servicePayableAddItem: daOfClaimAssessmentController.servicePayableAddItem,
  };
};

@connect(mapStateToProps)
class ServiceListItemOfPayableList extends PureComponent {
  static contextTypes = {
    taskNotEditable: PropTypes.bool,
  };

  handleAdd = () => {
    const { dispatch, serviceItem, incidentId, treatmentId, invoiceId } = this.props;
    dispatch({
      type: 'daOfClaimAssessmentController/addServicePayableItem',
      payload: {
        serviceItem,
        incidentId,
        treatmentId,
        invoiceId,
      },
    });
  };

  render() {
    const {
      serviceId,
      curServicePayableList,
      servicePayableAddItem,
      incidentId,
      treatmentId,
      invoiceId,
    } = this.props;
    const { taskNotEditable } = this.context;
    const isBelongToCurrentItem = serviceId === servicePayableAddItem?.serviceItemId;

    return (
      <div>
        {curServicePayableList &&
          curServicePayableList.map(item => (
            <ServiceListItemOfPayableListItem serviceItemPayableDetail={item} key={item?.id} />
          ))}
        {servicePayableAddItem && isBelongToCurrentItem && (
          <ServiceListItemOfPayableListItemAdd
            incidentId={incidentId}
            treatmentId={treatmentId}
            invoiceId={invoiceId}
            serviceItemPayableDetail={servicePayableAddItem}
          />
        )}
        {!taskNotEditable && (
          <ButtonOfClaim
            handleClick={this.handleAdd}
            buttonText={formatMessage({
              id: 'app.navigator.task-detail-of-claim-assessment.button.service-payable',
            })}
          />
        )}
        {!taskNotEditable && (
          <ButtonOfClaim
            handleClick={this.handleAdd}
            buttonText={formatMessage({
              id: 'app.navigator.task-detail-of-claim-assessment.beneficiary.label.payee-identity-no',
            })}
          />
        )}
      </div>
    );
  }
}

export default ServiceListItemOfPayableList;
