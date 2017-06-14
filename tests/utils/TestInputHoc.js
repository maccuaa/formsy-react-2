import React from 'react'
import Formsy from './../..'

class TestInput extends React.Component {
  methodOnWrappedInstance (param) {
    return param
  }

  render () {
    const {
      getErrorMessage,
      getErrorMessages,
      getValue,
      hasValue,
      innerRef,
      isFormDisabled,
      isFormSubmitted,
      isPristine,
      isRequired,
      isValid,
      isValidValue,
      resetValue,
      setValidations,
      setValue,
      showError,
      showRequired,
      validationError,
      validationErrors,
      validations,
      ...rest
    } = this.props;
    return <input {...rest} />
  }
}

export default Formsy.HOC(TestInput)
