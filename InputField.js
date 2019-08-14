import ErrorTooltip from "@/components/ErrorTooltip";
import React, { Component } from "react";
import { connect } from "dva";
import lodash from "lodash";
import { Form, Input } from "antd";
import { FormattedMessage } from "umi/locale";

@connect((_, { form, params }) => ({
  value: form.getFieldValue(params.key),
  error: form.getFieldError(params.key)
}))
class NumberField extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      disabled: nextDisabled,
      value: nextValue,
      error: nextError,
      params: nextParams
    } = nextProps;
    const { disabled, value, error, params } = this.props;

    return (
      !lodash.isEqual(nextDisabled, disabled) ||
      !lodash.isEqual(nextValue, value) ||
      !lodash.isEqual(nextError, error) ||
      !lodash.isEqual(nextParams, params)
    );
  }

  render() {
    const { form, disabled, params } = this.props;

    return (
      <Form.Item
        label={
          <ErrorTooltip
            form={form}
            formName={params.key}
            title={params.label}
            // title={<FormattedMessage id={params.label} />}
          />
        }
      >
        {form.getFieldDecorator(params.key, {
          initialValue: params.initialValue,
          rules: [
            {
              max: 240
            }
          ]
        })(<Input disabled={disabled} />)}
      </Form.Item>
    );
  }
}

export default NumberField;
