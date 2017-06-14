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
    return (
      <Component ref={innerRef} {...this.props} />
    )
  }
}
