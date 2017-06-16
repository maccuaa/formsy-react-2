var React = global.React || require('react');

import Mixin from './Mixin.js';

const getDisplayName = (Component) => {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' ? Component : 'Component')
  );
}

export default (Component) => class extends Mixin {
  displayName = `Formsy(${getDisplayName(Component)})`

  render() {
    const { innerRef } = this.props;
    const formsyProps = {
      setValidations: this.setValidations,
      setValue: this.setValue,
      getValue: this.getValue,
      hasValue: this.hasValue,
      getErrorMessage: this.getErrorMessage,
      getErrorMessages: this.getErrorMessages,
      isFormDisabled: this.isFormDisabled,
      isValid: this.isValid,
      isPristine: this.isPristine,
      isFormSubmitted: this.isFormSubmitted,
      isRequired: this.isRequired,
      showRequired: this.showRequired,
      showError: this.showError,
      isValidValue: this.isValidValue,
      resetValue: this.resetValue,
    };

    return (
      <Component ref={innerRef} {...this.props} {...formsyProps}/>
    )
  }
}
