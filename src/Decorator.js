var React = global.React || require('react');

import HOC from './HOC';

export default () => (Component) => HOC((props) => {
  return (
    <Component {...props} />
  )
})
