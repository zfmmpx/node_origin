import React, { Component } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';

@connect((_, { form }) => ({
  value: form.getFieldValue('firstName'),
  error: form.getFieldError('firstName'),
}))
class FirstName extends Component {
  shouldComponentUpdate(nextProps) {
    const { value: nextValue, disabled: nextDisabled, error: nextError } = nextProps;
    const { value, disabled, error } = this.props;

    return (
      !lodash.isEqual(nextValue, value) ||
      !lodash.isEqual(nextDisabled, disabled) ||
      !lodash.isEqual(nextError, error)
    );
  }

  render() {
    const { form, disabled } = this.props;

    return (
      <Form.Item
        label={formatMessage({
          id: 'app.navigator.task-detail-of-data-capture.label.first-name',
        })}
      >
        {form.getFieldDecorator('firstName', {
          rules: [
            {
              required: true,
              message: 'Required!',
            },
            { max: 30 },
          ],
        })(<Input disabled={disabled} maxLength={30} />)}
      </Form.Item>
    );
  }
}

export default FirstName;
