import React from 'react';
import Formsy from './../..';

class TestInput extends Formsy.Mixin {
  static defaultProps = {
    type: 'text'
  }

  updateValue = (event) => {
    this.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    const {type, ...rest} = this.removeFormsyProps(this.props);
    return (
      <input {...rest} type={type} value={this.getValue()} onChange={this.updateValue}/>
    )
  }
}

export default TestInput;
