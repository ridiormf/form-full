<h1 align="center">Form-Full</h1>

<p align="center">
A complete form package for your React project.
</p>

## Installation

Form-Full is available as an [npm package](https://www.npmjs.com/package/form-full).

```sh
// with npm
npm install form-full

// with yarn
yarn add form-full
```

## How It Works

First, it is important to understand how each part interacts with the other.

There are four main parts which are as follows:

[FormFull documentation](#formfull)
React component that must encompass the entire form that will manage

[useFormFull.field documentation](#use-formfull-field)
Hook that will connect a new value input component (`TextField`, `RadioButton`, `Checkbox`... and everything else your project needs to use in the form)

[useFormFull.button documentation](#use-formfull-button)
Hook that will connect a new action component (`Buttons` and components that use `onClick` and need to interact with the form)

[Handler Methods documentation](#custom_anchor_name) _// In process of development_
Class that manages all form behavior (Accessible by saving with the `formRef` of the `FormFull` component or in calls like `onChange` and `onBlur` of the input or field validations (`validation` or `asyncValidation`).

You can preview using the form and how to create `form-full` components in this interactive demo:
[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/tsxir)

## Usage

```jsx
import React from "react";
import { sleep } from "./utils";
import { FormFull } from "form-full";
import "./styles.css";
import Input from "./fields/Input";
import Button from "./buttons/Button";

export default function App() {
  const [currentValues, setCurrentValues] = React.useState({});
  const [savedValues, setSavedValues] = React.useState();
  const [disabledForm, setDisabledForm] = React.useState(false);

  function simulateRequest() {
    setCurrentValues(null);
    sleep(2000).then(() => {
      setCurrentValues({
        name: "Form Full",
        age: "18",
      });
    });
  }

  return (
    <div className='App'>
      <div className='form-container'>
        <FormFull
          disabled={disabledForm}
          currentValues={currentValues}
          onSubmit={(data) => {
            setSavedValues(data);
          }}>
          <div className='inputs-container'>
            <Input name='name' label='Your name' required='Required field' />
            <Input name='age' label='Your age' />
            <Input
              name='defaultValue'
              label='Default Value'
              defaultValue='Some Value'
            />
          </div>
          <Button action='submit' feedback>
            Submit
          </Button>
          <Button action='clear'>Clear All Values</Button>
          <Button action='clearDefault'>Set All Values to Default</Button>
          <Button onClick={() => simulateRequest()}>
            Simulate data from API
          </Button>
          <Button onClick={() => setDisabledForm(!disabledForm)}>
            {disabledForm ? "Enable Form" : "Disable Form"}
          </Button>
        </FormFull>
      </div>

      <div>
        <h3>
          {!!savedValues
            ? "Values ​​that were saved when sending the data."
            : "Submit the values ​​correctly to view the data that was sent."}
        </h3>
        {!!savedValues && <p>{JSON.stringify(savedValues)}</p>}
      </div>
    </div>
  );
}
```

First of all it will be necessary to create components that connect with `form-full`

### Example of an "Input" component

```jsx
import React from "react";
import { useFormFull } from "form-full";

function getErrorClassname(base, error, valid) {
  const className = base;
  if (error) return `${className} invalid`;
  if (valid) return `${className} valid`;
  return className;
}

function getHint(error, valid) {
  if (error) return error;
  if (valid) return "Valid value.";
  return null;
}

function Input(props) {
  const {
    value,
    error,
    valid,
    onSubmit,
    onBlur,
    onChange,
    testFieldError,
    ref,
    formDisabled,
    formLoading,
    // ffHandler, If some extra treatment is needed
  } = useFormFull.field(props);

  const { label, required, name } = props;

  return (
    <div className={getErrorClassname("form-control", error, valid)}>
      <label for={name} className='form-input-label'>
        {label} {!!required ? "*" : ""}
      </label>
      <input
        name={name}
        label={label}
        value={value}
        ref={ref}
        required={!!required}
        disabled={formDisabled || formLoading}
        onKeyPress={onSubmit}
        onChange={(event) => {
          onChange(event, event.target.value);
          if (props.validateOnChange) {
            testFieldError();
          }
        }}
        onBlur={onBlur}
        className='form-input'
      />
      <span className='form-input-hint'>{getHint(error, valid)}</span>
    </div>
  );
}

export default React.memo(Input);
```

### Example of an "Button" component

```jsx
import { useFormFull } from "form-full";

function Button({
  children,
  action,
  feedback,
  onClick: onClickProps,
  ...props
}) {
  const { onClick, formLoading, formDisabled } = useFormFull.button({
    feedback,
    action,
    onClick: onClickProps,
  });

  return (
    <button
      {...props}
      className='button'
      disabled={formDisabled}
      onClick={formLoading ? null : onClick}>
      {formLoading ? "Loading..." : children}
    </button>
  );
}

export default React.memo(Button);
```

## Documentation

### FormFull

`props` passed to the component that manages the form:

| Name          | Type      | Required | Description                                                                                                                                                                                                                              |
| ------------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| currentValues | object    | no       | Object that defines the current values ​​of each field in the form. example: `{ username: "form", password: "full123" }`. **important**: Values ​​will only be inserted into the field if they change from the previous `currentValues`. |
| children      | ReactNode | `yes`    | Rendered components. All fields and buttons on the form must be children of the `FormFull` component                                                                                                                                     |
| clearOnSubmit | bool      | no       | If `true` is passed, the fields will be cleared (or filled in by default) when submitting the form                                                                                                                                       |
| disabled      | bool      | no       | If `true` is passed, all fields will be disabled                                                                                                                                                                                         |
| formRef       | func      | no       | Function to get the class that manages the form, normally used to handle exceptions and others advanced treatments                                                                                                                       |
| onSubmit      | func      | `yes`    | Function called when the form is submitted, receiving the values ​​in a object `{ key: value }`                                                                                                                                          |
| onChange      | func      | no       | Function called when the value of any field changes                                                                                                                                                                                      |
| submitOnClear | bool      | no       | If `true` is passed, the function `onSubmit` will be called when the form is cleared. \*\*Only works if all fields are optional                                                                                                          |

### Use FormFull Field

`useFormFull.field`
Hook used to connect a **field** component to be controlled by `form-full`

Receives an object as a parameter with the properties:

| Name            | Type   | Required | Description                                                                                                                                                                                                        |
| --------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| asyncValidation | func   | no       | used to validate input asynchronously (such as validating the existence of the username in a registration). **Important**: Like `validation`, need to return a string (if invalid) or null / undefined (if valid). |
| defaultValue    | any    | no       | Default field value. Value the component starts when it is first rendered                                                                                                                                          |
| label           | string | no/`yes` | Label used to concat errors message in a single object. Used to display all errors in a custom way. **Important**: `label` is required if `placeholder` is not passed                                              |
| mask            | func   | no       | Function to format the end-user visible value                                                                                                                                                                      |
| maskToSubmit    | func   | no       | Function to treat value when the form is submitted, converting it to the most suitable value for the developer                                                                                                     |
| maxLength       | number | no       | Limits the number of characters in the field. It is a native parameter, but `form-full` also uses it                                                                                                               |
| name            | string | `yes`    | Field name to be managed by the form. When the form is submitted the value will be inserted in a key of this name                                                                                                  |
| onBlur          | func   | no       | Function that will be called when the input loses focus. It is necessary to pass to `useFormFull.field` and not use it directly in the field                                                                       |
| onChange        | func   | no       | Function that will be called when the input value changes. It is necessary to pass to `useFormFull.field` and not use it directly in the field                                                                     |
| placeholder     | string | no/`yes` | Replaces and is required if the `label` is not passed                                                                                                                                                              |
| required        | string | no       | Error message that defines the field as required. It will be shown whenever the field validation is called and only if it is not filled.                                                                           |
| submitOnBlur    | bool   | no       | If`true`is passed the form will be submitted when field loses focus.                                                                                                                                               |
| validation      | func   | no       | Used to validate input. **Important**: Like`asyncValidation`, need to return a string (if invalid) or null / undefined (if valid).                                                                                 |

Returns an object with properties:

| Name           | Type                   | Description                                                                                                                                                                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| error          | string / null          | Error message to control field input feedback. string (if invalid) or null / undefined (if valid)                                                                                                            |
| ffHandler      | object                 | Form handler ref to treat exceptions if needed                                                                                                                                                               |
| formDisabled   | bool                   | Control boolean if the form is disabled. **Suggestion of use**: Block user action with the field                                                                                                             |
| formLoading    | bool                   | Control boolean if the field is loading (with async validations). **Suggestion of use**: Block user action with the field and show visual loading feedback                                                   |
| onBlur         | func                   | Controls `onBlur` treatments on fields that use this listener. Needs to be passed as props for the field: `onBlur={onBlur}`                                                                                  |
| onChange       | func                   | Controls the change of field value. receives the event change as the first parameter and the new value as the second. the event is not used internally, it is passed on for external use only, if necessary. |
| onSubmit       | func                   | Controls the submission of the form from an action in the field: `onKeyPress={onSubmit}` (React JS) or `onSubmitEditing={onSubmit}` (React Native)                                                           |
| ref            | React.MutableRefObject | React ref to control field focus when get validation error                                                                                                                                                   |
| testFieldError | func                   | Function to call field validation. **Important**: Used only when the field does not have the `onBlur` listener and don't use the `onBlur` that the `useFormFull.field` returns                               |
| valid          | bool                   | Controls whether the field is valid. Used to provide visual feedback when the field is filled in correctly                                                                                                   |
| value          | any                    | Value saved in the form. Example: `value={value}`                                                                                                                                                            |

### Use FormFull Button

`useFormFull.button`
Hook used to connect a **button** component to be controlled by `form-full`

Receives an object as a parameter with the properties:

| Name     | Type          | Required | Description                                                                                                                                                                                                                                                                                                                       |
| -------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action   | string / null | no       | Defines what type of action the button will perform when clicked. Possible values: `submit` (calls FormFull's onSubmit), `clear` (clear all field values) and `clearDefault` (clear all values to default values). If none is passed it will not take any action, it is necessary to pass an `onClick` for it to have some action |
| feedback | boolean       | no`      | If true, button will receive update in styles and will be blocked while form is being submitted                                                                                                                                                                                                                                   |
| onClick  | func          | no       | Function that will be called when the button is clicked. It is necessary to pass to `useFormFull.button` and not use it directly in the button rendered                                                                                                                                                                           |

Returns an object with properties:

| Name         | Type   | Description                                                                                                                                                |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ffHandler    | object | Form handler ref to treat exceptions if needed                                                                                                             |
| formDisabled | bool   | Control boolean if the form is disabled. **Suggestion of use**: Block user action with the button                                                          |
| formLoading  | bool   | Control boolean if the form is loading (with async validations). **Suggestion of use**: Block user action with the button and show visual loading feedback |
| onClick      | func   | Controls `onClick` treatments on button. Needs to be passed as props for the button: `onClick={onClick}` (React JS) or `onPress={onClick}` (React Native)  |

### Handler Methods

| Method Name             | Params                                              | Return                                                          | Description |
| ----------------------- | --------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| clearFields             | (setDefault: boolean = true)                        | void                                                            | //TODO      |
| clearSpecificFields     | (names: Array<string>, setDefault: boolean = true)  | void                                                            | //TODO      |
| clearValue              | (name: string, setDefault: bool = true)             | void                                                            | //TODO      |
| getActualValue          | (name: string)                                      | any                                                             | //TODO      |
| getDisabledForm         |                                                     | bool                                                            | //TODO      |
| getFieldRef             |                                                     | React.MutableRefObject / null                                   | //TODO      |
| getValidValues          | (valuesWithMaskToSubmit: boolean)                   | Object<[name: string]: any>                                     | //TODO      |
| getValue                | (name: string, withMaskToSubmit: boolean)           | void                                                            | //TODO      |
| getValues               |                                                     | Object<[name: string]: any>                                     | //TODO      |
| removeButton            | (name: string)                                      | void                                                            | //TODO      |
| removeField             | (name: string)                                      | void                                                            | //TODO      |
| setCurrentValues        | (currentValues: Object<[name: string]: any>)        | void                                                            | //TODO      |
| setFieldAsyncValidation | (name: string, asyncValidation: func)               | void                                                            | //TODO      |
| setFieldDefaultValue    | (name: string, defaultValue: any)                   | void                                                            | //TODO      |
| setFieldFocus           | (name: string)                                      | void                                                            | //TODO      |
| setFieldLabel           | (name: string, label: string)                       | void                                                            | //TODO      |
| setFieldMask            | (name: string, mask: func)                          | void                                                            | //TODO      |
| setFieldMaskToSubmit    | (name: string, maskToSubmit: func)                  | void                                                            | //TODO      |
| setFieldRequired        | (name: string, required: string / null / undefined) | void                                                            | //TODO      |
| setFieldValidation      | (name: string, asyncValidation: func)               | void                                                            | //TODO      |
| setFormDisabled         | (disabled: boolean)                                 | void                                                            | //TODO      |
| setFormValue            | (name: string, value: any)                          | void                                                            | //TODO      |
| setNewButton            | (name: string, buttonParams: Object<params>)        | void                                                            | //TODO      |
| setNewField             | (name: string, buttonParams: Object<params>)        | void                                                            | //TODO      |
| setValue                | (name: string, value: any)                          | void                                                            | //TODO      |
| submit                  |                                                     | Promise<void>                                                   | //TODO      |
| testErrorsAndReturnData |                                                     | Promise<{hasError: boolean;data: Object<[name: string]: any>;}> | //TODO      |
| testFieldError          | (name: string, shouldUpdateInput: boolean = true)   | Promise<string / null / undefined>                              | //TODO      |
