formsy-react-2
============

A form input builder and validator for React JS.

Forked from [formsy-react-2](https://github.com/christianalfoni/formsy-react-2) to add support for:

- React 15.5.0
- ES6 classes
- New validation rules
- Variable substitution in validation errors

**Deprecation notice**

- Formsy.Mixin is no longer a mixin.  It is now an ES6 class.  To use it just create a new class that extends it.

```js
class MyInput extends Formsy.Mixin {
  static defaultProps = {
    type: 'text'
  }

  updateValue = (event) => {
    this.setValue(event.target.value);
  }

  render() {
    const {type, ...rest} = this.removeFormsyProps(this.props);
    return (
      <input {...rest} type={type} value={this.getValue()} onChange={this.updateValue}/>
    )
  }
}

...

// Using your new component

<Formsy.Form>
  <MyInput name='foo' />
</Formsy.Form>
```

Eventually Mixin will be renamed to something that makes more sense but for now for backwards compatibility I have left it named as such.

Formsy.HOC and Formsy.Decorator probably don't work right now. The focus was to get the Mixin class working so I haven't really touched those files.  I will gladly accept a PR for them if anyone would like to contribute.

The examples and API docs have not been updated yet.

If the original [formsy-react-2](https://github.com/christianalfoni/formsy-react-2) maintainers become more active and incorporate these features then I will gladly remove this package.

For examples you can look at my other project [formsy-mui](https://github.com/st-andrew/formsy-mui)

## Installation

`npm install formsy-react-2`

The following is the original README.  I have updated the links for this repo, it will be updated eventually.

| [How to use](#how-to-use) | [API](/API.md) | [Examples](/examples) |
|---|---|---|

## <a name="background">Background</a>
I wrote an article on forms and validation with React JS, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this extension.

The main concept is that forms, inputs and validation is done very differently across developers and projects. This extension to React JS aims to be that "sweet spot" between flexibility and reusability.

## What you can do

  1. Build any kind of form element components. Not just traditional inputs, but anything you want and get that validation for free

  2. Add validation rules and use them with simple syntax

  3. Use handlers for different states of your form. Ex. "onSubmit", "onError", "onValid" etc.

  4. Pass external errors to the form to invalidate elements

  5. You can dynamically add form elements to your form and they will register/unregister to the form

## Default elements
You can look at examples in this repo or use the [formsy-react-2-components](https://github.com/twisty/formsy-react-2-components) project to use bootstrap with formsy-react-2, or use [formsy-material-ui](https://github.com/mbrookes/formsy-material-ui) to use [Material-UI](http://material-ui.com/) with formsy-react-2.

## Install

  1. Download from this REPO and use globally (Formsy) or with requirejs
  2. Install with `npm install formsy-react-2` and use with browserify etc.
  3. Install with `bower install formsy-react-2`

## Changes

[Check out releases](https://github.com/st-andrew/formsy-mui/releases)

[Older changes](CHANGES.md)

## How to use

See [`examples` folder](/examples) for examples. [Codepen demo](http://codepen.io/semigradsky/pen/dYYpwv?editors=001).

Complete API reference is available [here](/API.md).

#### Formsy gives you a form straight out of the box

```jsx
  import Formsy from 'formsy-react-2';

  const MyAppForm = createReactClass({
    getInitialState() {
      return {
        canSubmit: false
      }
    },
    enableButton() {
      this.setState({
        canSubmit: true
      });
    },
    disableButton() {
      this.setState({
        canSubmit: false
      });
    },
    submit(model) {
      someDep.saveEmail(model.email);
    },
    render() {
      return (
        <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <MyOwnInput name="email" validations="isEmail" validationError="This is not a valid email" required/>
          <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
        </Formsy.Form>
      );
    }
  });
```

This code results in a form with a submit button that will run the `submit` method when the submit button is clicked with a valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) or the value is not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

#### Building a form element (required)
```jsx
  import Formsy from 'formsy-react-2';

  const MyOwnInput = createReactClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue(event) {
      this.setValue(event.currentTarget.value);
    },

    render() {
      // Set a specific className based on the validation
      // state of this component. showRequired() is true
      // when the value is empty and the required prop is
      // passed to the input. showError() is true when the
      // value typed is invalid
      const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

      // An error message is returned ONLY if the component is invalid
      // or the server has returned an error message
      const errorMessage = this.getErrorMessage();

      return (
        <div className={className}>
          <input type="text" onChange={this.changeValue} value={this.getValue()}/>
          <span>{errorMessage}</span>
        </div>
      );
    }
  });
```
The form element component is what gives the form validation functionality to whatever you want to put inside this wrapper. You do not have to use traditional inputs, it can be anything you want and the value of the form element can also be anything you want. As you can see it is very flexible, you just have a small API to help you identify the state of the component and set its value.

## Related projects
- [formsy-material-ui](https://github.com/mbrookes/formsy-material-ui) - A formsy-react-2 compatibility wrapper for [Material-UI](http://material-ui.com/) form components.
- [formsy-react-2-components](https://github.com/twisty/formsy-react-2-components) - A set of React JS components for use in a formsy-react-2 form.
- ...
- Send PR for adding your project to this list!

## Contribute
- Fork repo
- `npm install`
- `npm run examples` runs the development server on `localhost:8080`
- `npm test` runs the tests

## License

[The MIT License (MIT)](/LICENSE)
