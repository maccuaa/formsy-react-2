import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import Formsy from './..';
import TestInput from './utils/TestInput';
import TestInputHoc from './utils/TestInputHoc';
import sinon from 'sinon';
import validationRules from './../lib/validationRules';

export default {

  'Setting up a form': {
    'should expose the users DOM node through an innerRef prop': function (test) {
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form>
              <TestInputHoc name="name" innerRef={(c) => { this.name = c; }} />
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = form.name;
      test.equal(input.methodOnWrappedInstance('foo'), 'foo');

      test.done();
    },

    'should render a form into the document': function (test) {

      const form = TestUtils.renderIntoDocument(<Formsy.Form></Formsy.Form>);
      test.equal(ReactDOM.findDOMNode(form).tagName, 'FORM');

      test.done();

    },

    'should set a class name if passed': function (test) {

      const form = TestUtils.renderIntoDocument( <Formsy.Form className="foo"></Formsy.Form>);
      test.equal(ReactDOM.findDOMNode(form).className, 'foo');

      test.done();

    },

    'should allow for null/undefined children': function (test) {
      let model = null;

      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form onSubmit={(formModel) => (model = formModel)}>
              <h1>Test</h1>
              { null }
              { undefined }
              <TestInput name="name" value={ 'foo' } />
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.deepEqual(model, {name: 'foo'});

      test.done()
    },

    'should allow for inputs being added dynamically': async function (test) {
      const inputs = [];

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          {inputs}
        </Formsy.Form>
      );

      test.deepEqual(form.getModel(), {});

      inputs.push(<TestInput name="test" value="" key={inputs.length}/>);

      await form.forceUpdate();

      test.ok('test' in form.getModel());

      test.done();
    },

    'should allow dynamically added inputs to update the form-model': async function (test) {
      const inputs = [];

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          {inputs}
        </Formsy.Form>
      );

      test.deepEqual(form.getModel(), {});

      inputs.push(<TestInput name="test" value="" key={inputs.length}/>);

      await form.forceUpdate();

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

      TestUtils.Simulate.change(input, {target: {value: 'foo'}});

      await form.forceUpdate();

      test.deepEqual(form.getModel(), {test: 'foo'});

      test.done();
    }
  },

  'validations': {

    'should run when the input changes': function (test) {

      const runRule = sinon.spy();
      const notRunRule = sinon.spy();

      Formsy.addValidationRule('runRule', runRule);
      Formsy.addValidationRule('notRunRule', notRunRule);

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput name="one" validations="runRule" value="foo"/>
        </Formsy.Form>
      );

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});

      test.equal(runRule.calledWith({one: 'bar'}, 'bar', true), true);

      test.equal(notRunRule.called, false);

      test.done();

    },

    'should allow the validation to be changed': function (test) {

      const ruleA = sinon.spy();
      const ruleB = sinon.spy();
      Formsy.addValidationRule('ruleA', ruleA);
      Formsy.addValidationRule('ruleB', ruleB);

      class TestForm extends React.Component {
        state = {
          rule: 'ruleA'
        }
        changeRule() {
          this.setState({
            rule: 'ruleB'
          });
        }
        render() {
          return (
            <Formsy.Form>
              <TestInput name="one" validations={this.state.rule} value="foo"/>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      test.equal(ruleA.called, true);

      form.changeRule();
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(input, {target: {value: 'bar'}});

      test.equal(ruleB.calledWith({one: 'bar'}, 'bar', true), true);

      test.done();

    },

    'should not allow a custom validation to be overwritten': function (test) {

      const ruleC = sinon.spy();
      const ruleD = sinon.spy();

      Formsy.addValidationRule('ruleC', ruleC);

      class TestForm extends React.Component {
        state = { rule: 'ruleC' }
        changeRule() {
          this.setState({
            rule: 'ruleC'
          });
        }
        render() {
          return (
            <Formsy.Form>
              <TestInput name="one" validations={this.state.rule} value="foo"/>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      test.equal(ruleC.called, true);

      Formsy.addValidationRule('ruleC', ruleD);

      form.changeRule();

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

      TestUtils.Simulate.change(input, {target: {value: 'bar'}});

      test.equal(ruleD.called, false);

      test.done();

    },

    'should invalidate a form if dynamically inserted input is invalid': function (test) {

      const isInValidSpy = sinon.spy();

      class TestForm extends React.Component {
        state = {
          showSecondInput: false
        }
        render() {
          return (
            <Formsy.Form onInvalid={isInValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {this.state.showSecondInput && <TestInput name="two" validations="isEmail" value="foo@bar"/>}
            </Formsy.Form>
          );
        }
      };

      const testForm = TestUtils.renderIntoDocument(<TestForm/>);

      const formsy = TestUtils.findRenderedComponentWithType(testForm, Formsy.Form);

      test.equal(formsy.state.isValid, true);

      testForm.setState({
        showSecondInput: true
      });

      test.equal(isInValidSpy.called, true);

      test.done();

    },

    'should validate a form when removing an invalid input': function (test) {

      const isValidSpy = sinon.spy();

      class TestForm extends React.Component {
        state = {
          showSecondInput: true
        }
        render() {
          return (
            <Formsy.Form ref="formsy" onValid={isValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {this.state.showSecondInput && <TestInput name="two" validations="isEmail" value="foo@bar"/>}
            </Formsy.Form>
          );
        }
      }

      const testForm = TestUtils.renderIntoDocument(<TestForm/>);

      const formsy = TestUtils.findRenderedComponentWithType(testForm, Formsy.Form);

      test.equal(formsy.state.isValid, false);

      testForm.setState({
        showSecondInput: false
      });

      test.equal(isValidSpy.called, true);

      test.done();

    },

    'runs multiple validations': function (test) {

      const ruleD = sinon.spy();
      const ruleE = sinon.spy();
      Formsy.addValidationRule('ruleD', ruleD);
      Formsy.addValidationRule('ruleE', ruleE);

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput name="one" validations="ruleD,ruleE" value="foo" />
        </Formsy.Form>
      );

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(ruleD.calledWith({one: 'bar'}, 'bar', true), true);
      test.equal(ruleE.calledWith({one: 'bar'}, 'bar', true), true);
      test.done();

    }

  },

  'onChange': {

    'should not trigger onChange when form is mounted': function (test) {
      const hasChanged = sinon.spy();

      class TestForm extends React.Component {
        render() {
          return <Formsy.Form onChange={hasChanged}></Formsy.Form>;
        }
      }

      TestUtils.renderIntoDocument(<TestForm/>);
      test.equal(hasChanged.called, false);
      test.done();
    },

    'should trigger onChange once when form element is changed': function (test) {

      const hasChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy.Form onChange={hasChanged}>
          <TestInput name="foo"/>
        </Formsy.Form>
      );
      TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
      test.equal(hasChanged.calledOnce, true);
      test.done();

    },

    'should trigger onChange once when new input is added to form': function (test) {
      const hasChanged = sinon.spy();

      class TestForm extends React.Component {
        state = {
          showInput: false
        };

        render() {
          return (
            <Formsy.Form onChange={hasChanged}>
              {this.state.showInput && <TestInput name="test"/>}
            </Formsy.Form>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      form.setState({showInput: true});

      test.equal(hasChanged.calledOnce, true);

      test.done();
    }

  },

  'Update a form': {

    'should allow elements to check if the form is disabled': function (test) {
      class TestForm extends React.Component {
        state = { disabled: true };
        render() {
          return (
            <Formsy.Form disabled={this.state.disabled}>
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.isFormDisabled(), true);

      form.setState({disabled: false})
      test.equal(input.isFormDisabled(), false);
      test.done();
    },

    'should be possible to pass error state of elements by changing an errors attribute': function (test) {
      class TestForm extends React.Component {
        state = { validationErrors: { foo: 'bar' } };

        onChange = (values) => {
            this.setState(values.foo ? { validationErrors: {} } : { validationErrors: {foo: 'bar'} });
        };

        render() {
          return (
            <Formsy.Form onChange={this.onChange} validationErrors={this.state.validationErrors}>
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.getErrorMessage(), 'bar');
      input.setValue('gotValue');
      test.equal(input.getErrorMessage(), null);
      test.done();
    },

    'should trigger an onValidSubmit when submitting a valid form': function (test) {
      let isCalled = sinon.spy();

      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form onValidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar.com"/>
            </Formsy.Form>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(FoundForm));
      test.equal(isCalled.called,true);
      test.done();
    },

    'should trigger an onInvalidSubmit when submitting an invalid form': function (test) {
      let isCalled = sinon.spy();

      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form onInvalidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar"/>
            </Formsy.Form>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(FoundForm));
      test.equal(isCalled.called, true);

      test.done();
    }

  },

  'value === false': {

    'should call onSubmit correctly': function (test) {
      const onSubmit = sinon.spy();

      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form onSubmit={onSubmit}>
              <TestInput name="foo" value={false} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();
    },

    'should allow dynamic changes to false': function (test) {
      const onSubmit = sinon.spy();

      class TestForm extends React.Component {
        state = {
          value: true
        };

        render() {
          return (
            <Formsy.Form onSubmit={onSubmit}>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      form.setState({value: false});
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();
    },

    'should say the form is submitted': function (test) {
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={true} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.isFormSubmitted(), false);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(input.isFormSubmitted(), true);
      test.done();
    },

    'should be able to reset the form to its pristine state': function (test) {
      class TestForm extends React.Component {
        state = {
          value: true
        };
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);
      test.equal(input.getValue(), true);
      form.setState({value: false});
      test.equal(input.getValue(), false);
      formsyForm.reset();
      test.equal(input.getValue(), true);

      test.done();
    },

    'should be able to reset the form using custom data': function (test) {
      class TestForm extends React.Component {
        state = {
          value: true
        };
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);

      test.equal(input.getValue(), true);
      form.setState({value: false});
      test.equal(input.getValue(), false);
      formsyForm.reset({
        foo: 'bar'
      });
      test.equal(input.getValue(), 'bar');
      test.done();
    },

    'should be able to reset the form to empty values': function (test) {
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value="42" type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);

      formsyForm.reset({
        foo: ''
      });
      test.equal(input.getValue(), '');
      test.done();
    }

  },

  '.isChanged()': {

    'initially returns false': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
      );
      test.equal(form.isChanged(), false);
      test.equal(hasOnChanged.called, false);
      test.done();

    },

    'returns true when changed': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
      );
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(form.isChanged(), true);
      test.equal(hasOnChanged.calledWith({one: 'bar'}), true);
      test.done();

    },

    'returns false if changes are undone': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
      );
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(hasOnChanged.calledWith({one: 'bar'}, true), true);

      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'foo'}});
      test.equal(form.isChanged(), false);
      test.equal(hasOnChanged.calledWith({one: 'foo'}, false), true);
      test.done();

    }
  }
}
