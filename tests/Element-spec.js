import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

import Formsy from './..';
import TestInput from './utils/TestInput';

export default {

  'should fail if no name is passed to Mixin': function (test) {
    const fails = () => {
      return TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput/>
        </Formsy.Form>
      );
    };
    test.throws(fails, Error);

    test.done();

  },

  'should return passed and setValue() value when using getValue()': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.getValue(), 'foo');

    testInput.setValue('foobar');

    test.equal(testInput.getValue(), 'foobar');

    test.done();


  },

  'should set back to pristine value when running reset': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.getValue(), 'foo');

    testInput.setValue('foobar');

    test.equal(testInput.getValue(), 'foobar');

    testInput.resetValue();

    test.equal(testInput.getValue(), 'foo');

    test.done();

  },

  'should return error message passed when calling getErrorMessage()': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.getErrorMessage(), 'Has to be email');

    test.done();

  },

  'should return true or false when calling isValid() depending on valid state': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.isValid(), false);

    testInput.setValue('foo@foo.com');

    test.equal(testInput.isValid(), true);

    test.done();

  },

  'should return true or false when calling isRequired() depending on passed required attribute': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value=""/>
        <TestInput name="foo" value="" required/>
        <TestInput name="foo" value="foo" required="isLength:3"/>
      </Formsy.Form>
    );

    test.equal(form.inputs[0].isRequired(), false);
    test.equal(form.inputs[1].isRequired(), true);
    test.equal(form.inputs[2].isRequired(), true);

    test.done();

  },

  'should return true or false when calling showRequired() depending on input being empty and required is passed, or not': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" value="foo"/>
        <TestInput name="B" value="" required/>
        <TestInput name="C" value=""/>
      </Formsy.Form>
    );

    test.equal(form.inputs[0].showRequired(), false);
    test.equal(form.inputs[1].showRequired(), true);
    test.equal(form.inputs[2].showRequired(), false);

    test.done();

  },

  'should display requiredError when form is submitted and a required field is missing': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" value="" required requiredError="foo" />
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.isRequired(), true);
    test.equal(testInput.isValid(), false);
    test.equal(testInput.getErrorMessage(), null);

    TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));

    test.equal(testInput.getErrorMessage(), 'foo');

    test.done();

  },

  'should return true or false when calling isPristine() depending on input has been "touched" or not': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" value="foo"/>
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(testInput.isPristine(), true);

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});

    test.equal(testInput.isPristine(), false);

    test.done();

  },

  'should allow an undefined value to be updated to a value': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" value={undefined} />
      </Formsy.Form>
    );

    const testInput = TestUtils.findRenderedComponentWithType(form, TestInput);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

    test.equal(testInput.getValue(), undefined);

    TestUtils.Simulate.change(input, {target: {value: 'foo'}});

    test.equal(testInput.getValue(), 'foo');

    test.done();
  },

  'should be able to test a values validity': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" validations="isEmail"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(input.isValidValue('foo@bar.com'), true);
    test.equal(input.isValidValue('foo@bar'), false);

    test.done();
  },

  'should be able to use an object as validations property': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" validations={{ isEmail: true }}/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(input.isValidValue('foo@bar.com'), true);
    test.equal(input.isValidValue('foo@bar'), false);

    test.done();
  },

  'should be able to pass complex values to a validation rule': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="A" validations={{ matchRegexp: /foo/ }} value="foo"/>
      </Formsy.Form>
    );

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);

    test.equal(inputComponent.isValid(), true);

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

    TestUtils.Simulate.change(input, {target: {value: 'bar'}});

    test.equal(inputComponent.isValid(), false);

    test.done();
  },

  'should be able to run a function to validate': function (test) {

    class TestForm extends React.Component {
      customValidationA = (values, value) => {
        return value === 'foo';
      };

      customValidationB = (values, value) => {
        return value === 'foo' && values.A === 'foo';
      };

      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              custom: this.customValidationA
            }} value="foo"/>
            <TestInput name="B" validations={{
              custom: this.customValidationB
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    test.equal(inputComponent[0].isValid(), true);
    test.equal(inputComponent[1].isValid(), true);
    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input[0], {target: {value: 'bar'}});
    test.equal(inputComponent[0].isValid(), false);
    test.equal(inputComponent[1].isValid(), false);

    test.done();
  },

  'should not override error messages with error messages passed by form if passed eror messages is an empty object': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form validationErrors={{}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar3');

    test.done();
  },

  'should override all error messages with error messages passed by form': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form validationErrors={{A: 'bar'}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar');

    test.done();
  },

  'should override validation rules with required rules': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{isEmail: 'bar2', isLength: 'bar3'}}
              value="f"
              required={{
                isLength: 1
              }}
            />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar3');

    test.done();
  },

  'should fall back to default error message when non exist in validationErrors map': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{foo: 'bar'}}
              value="foo"
            />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar');

    test.done();
  },

  'should validation parameters passed to validation errors messages': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput
          name="A"
          validations={{
            'minLength': 3,
            'maxLength': 5
          }}
          validationErrors={{
            'minLength': 'The field must be at least {0} characters in length',
            'maxLength': 'The field must not exceed {0} characters in length'
          }}
        />
      </Formsy.Form>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'xx'}});
    test.equal(inputComponent.getErrorMessage(), 'The field must be at least 3 characters in length');
    TestUtils.Simulate.change(input, {target: {value: 'xxxxxx'}});
    test.equal(inputComponent.getErrorMessage(), 'The field must not exceed 5 characters in length');

    test.done();

  },

  'should not be valid if it is required and required rule is true': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" required />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), false);

    test.done();
  },

  'should handle objects and arrays as values': function (test) {
    class TestForm extends React.Component {
      state = {
        foo: {foo: 'bar'},
        bar: ['foo']
      };

      render() {
        return (
          <Formsy.Form>
            <TestInput name="foo" value={this.state.foo}/>
            <TestInput name="bar" value={this.state.bar}/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    form.setState({
      foo: {foo: 'foo'},
      bar: ['bar']
    });

    const inputs = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    test.deepEqual(inputs[0].getValue(), {foo: 'foo'});
    test.deepEqual(inputs[1].getValue(), ['bar']);

    test.done();
  },

  'should handle isFormDisabled with dynamic inputs': function (test) {
    class TestForm extends React.Component {
      state = {
        bool: true
      };

      flip = () => {
        this.setState({
          bool: !this.state.bool
        });
      };

      render() {
        return (
          <Formsy.Form disabled={this.state.bool}>
            {this.state.bool ?
              <TestInput name="foo" /> :
              <TestInput name="bar" />
            }
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.isFormDisabled(), true);
    form.flip();
    test.equal(input.isFormDisabled(), false);

    test.done();
  },

  'should allow for dot notation in name which maps to a deep object': function (test) {
    class TestForm extends React.Component {
      onSubmit = (model) => {
        test.deepEqual(model, {foo: {bar: 'foo', test: 'test'}});
      };

      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo.bar" value="foo"/>
            <TestInput name="foo.test" value="test"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    test.expect(1);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

    test.done();
  },

  'should allow for application/x-www-form-urlencoded syntax and convert to object': function (test) {
    class TestForm extends React.Component {
      onSubmit = (model) => {
        test.deepEqual(model, {foo: ['foo', 'bar']});
      };

      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo[0]" value="foo"/>
            <TestInput name="foo[1]" value="bar"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    test.expect(1);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

    test.done();
  },

  'input should rendered once with PureComponent': function (test) {

    var renderSpy = sinon.spy();

    const Input = class extends TestInput {
      render() {
        renderSpy();
        return <input type={this.props.type} value={this.getValue()} onChange={() => {}} />;
      }
    };

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo"/>
      </Formsy.Form>
    );

    test.equal(renderSpy.calledOnce, true);
    test.done();

  }

};
