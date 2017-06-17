# formsy-react-2

(insert badges)

---

Formsy React 2 is a form input builder and validator for React JS.  It is the successor to the [formsy-react](https://github.com/christianalfoni/formsy-react) libary that was forked to add support for:

- React 15.5.x
- ES6 classes
- New validation rules
- Variable substitution in validation errors

For help migrating from formsy-react to formsy-react-2 see the [Migrating from formsy-react](#migrating-from-formsy-react) section.

### Installation

To get started with formsy-react-2, you can simply install it with npm:

```bash
npm i --save formsy-react-2
```

or with yarn

```bash
yarn add formsy-react-2
```

formsy-react-2 is currently compatible with React 15.5x.  For React 15.4.x and below it is recommended that you install [formsy-react](https://github.com/christianalfoni/formsy-react) instead.

### What you can do

1. Build any kind of form element components. Not just traditional inputs, but anything you want and get that validation for free

2. Add validation rules and use them with simple syntax

3. Use handlers for different states of your form. Ex. "onSubmit", "onError", "onValid" etc.

4. Pass external errors to the form to invalidate elements

5. You can dynamically add form elements to your form and they will register/unregister to the form

Complete API reference is available [here](/API.md).

### Basic Usage

```jsx
import Formsy from 'formsy-react-2';

class MyInput extends Formsy.Mixin {
  static defaultProps = {
    type: 'text'
  }

  updateValue = (event) => {
    this.setValue(event.target.value);
  }

  render() {
    const {type, ...rest} = this.removeFormsyProps(this.props);
    const errorMessage = this.getErrorMessage();
    return (
      <input {...rest} type={type} value={this.getValue()} onChange={this.updateValue} />
      <span>{errorMessage}</span>
    )
  }
}

class MyInputHOC extends React.Component  {
  updateValue = (event) => {
    this.props.setValue(event.target.value);
  }

  render() {
    const errorMessage = this.getErrorMessage();
    return (
      <input type='text' value={this.props.getValue()} onChange={this.updateValue} />
      <span>{errorMessage}</span>
    )
  }
}

export Formsy.HOC(MyInputHOC);

// Using your new component

class MyForm extends React.component {
  state = {
    formIsValid: false
  }

  enableSubmit() {
    this.setState({formIsValid: true});
  }

  disableSubmit() {
    this.setState({formIsValid: false});
  }

  submit(model) {
    console.log(model);
    // model = {
    //   foo: 'foo@foo.com',
    //   bar: 10
    // }
  }

  // This code results in a form with a submit button that will run the `submit`
  // method when the submit button is clicked with a valid email. The submit button
  // is disabled as long as
  // - the foo input is empty or the value is not an email; and
  // - the bar input is not an integer.
  // On validation error it will show the error message.

  render() {
    <Formsy.Form onValidSubmit={this.submit} onValid={this.enableSubmit} onInvalid={this.disableSubmit}>
      <MyInput name='foo' validations='isEmail' validationError='This is not a valid email' required />
      <MyInputHOC name='bar' validations='isInt' validationError'This is not an integer' />
      <button type="submit" disabled={!this.state.formIsValid}>Submit</button>
    </Formsy.Form>
  }
}

```

### Migrating from formsy-react

Formsy.Mixin is no longer a mixin.  It is now an ES6 class.  To use it just create a new class that extends it.  See the [Basic Usage](#basic-usage) section for an example.

Eventually Mixin will be renamed to something that makes more sense but for now for backwards compatibility I have left it named as such.

The examples and API docs have not been updated yet.

If the original [formsy-react](https://github.com/christianalfoni/formsy-react) maintainers become more active and incorporate these features then I will gladly remove this package.

For examples you can look at my other project [formsy-mui](https://github.com/st-andrew/formsy-mui)

### Contributing
- Fork repo
- `npm install`
- `npm run build`
- `npm test` runs the tests

## License

[The MIT License (MIT)](/LICENSE)
