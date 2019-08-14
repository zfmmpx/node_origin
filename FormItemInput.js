import React, { Component } from "react";
import { connect } from "dva";
import lodash from "lodash";
import { Form, Input } from "antd";
import { formatMessage } from "umi/locale";
import PropTypes from "prop-types";
import ErrorTooltip from "@/components/ErrorTooltip";

@connect((_, { form, formName }) => ({
  value: form.getFieldValue(formName),
  error: form.getFieldError(formName)
}))
class FormItemInput extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      disabled: nextDisabled,
      required: nextRquired,
      value: nextValue,
      error: nextError
    } = nextProps;
    const { value, disabled, error, required } = this.props;

    return (
      !lodash.isEqual(nextDisabled, disabled) ||
      !lodash.isEqual(nextRquired, required) ||
      !lodash.isEqual(nextValue, value) ||
      !lodash.isEqual(nextError, error)
    );
  }

  render() {
    const {
      form,
      disabled,
      required,
      formName,
      labelId,
      rules,
      maxLength
    } = this.props;

    return (
      <>
        <Form.Item
          label={
            <ErrorTooltip
              labelId={labelId}
              form={form}
              formName={formName}
              title={formatMessage({ id: labelId })}
            />
          }
        >
          {form.getFieldDecorator(formName, {
            rules: [
              {
                required,
                message: "Required!"
              },
              ...rules
            ]
          })(<Input disabled={disabled} maxLength={maxLength} />)}
        </Form.Item>
        <Form.Item
          label={
            <ErrorTooltip
              labelId={labelId}
              form={form}
              formName={formName}
              title={formatMessage({ id: labelId })}
            />
          }
        >
          {form.getFieldDecorator(formName, {
            rules: [
              {
                required,
                message: "Required!"
              },
              ...rules
            ]
          })(<Input disabled={disabled} maxLength={maxLength} />)}
        </Form.Item>
      </>
    );
  }
}

FormItemInput.defaultProps = {
  disabled: false,
  required: false,
  maxLength: undefined,
  rules: []
};

FormItemInput.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rules: PropTypes.array,
  maxLength: PropTypes.number,
  form: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired
};

export default FormItemInput;
