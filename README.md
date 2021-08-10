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

## Usage

```jsx
import React from "react";
import { sleep } from "./utils";
import { FormFull } from "form-full";
import "./styles.css";
import Input from "./fields/Input";
import Button from "./buttons/Button";

export default function App() {
  const [actualValues, setActualValues] = React.useState({});
  const [savedValues, setSavedValues] = React.useState();

  function simulateRequest() {
    setActualValues(null);
    sleep(2000).then(() => {
      setActualValues({
        name: "Form Full",
        age: "18",
      });
    });
  }

  return (
    <div className="App">
      <div className="form-container">
        <FormFull
          disabled={!actualValues}
          actualValues={actualValues}
          onSubmit={(data) => {
            console.log({ data });
            setSavedValues(data);
          }}
        >
          <div className="inputs-container">
            <Input name="name" label="Your name" required="Required field" />
            <Input name="age" label="Your age" />
            <Input
              name="defaultValue"
              label="Default Value"
              defaultValue="Some Value"
            />
          </div>
          <Button name="submit" actionType="submit">
            Submit
          </Button>
          <Button name="clear" actionType="clear">
            Clear All Values
          </Button>
          <Button name="clearDefault" actionType="clearDefault">
            Set All Values to Default
          </Button>
          <Button name="simulation" onClick={() => simulateRequest()}>
            Simulate data from API
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

You can preview using the form and how to create "form-full" components in this interactive demo:
[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/tsxir)

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
      <label for={name} className="form-input-label">
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
        className="form-input"
      />
      <span className="form-input-hint">{getHint(error, valid)}</span>
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
  actionType,
  name,
  onClick: onClickProps,
  ...props
}) {
  const { onClick, formLoading, formDisabled } = useFormFull.button({
    name,
    actionType,
    onClick: onClickProps,
  });

  return (
    <button
      {...props}
      className="button"
      disabled={formDisabled}
      onClick={formLoading ? null : onClick}
    >
      {formLoading ? "Loading..." : children}
    </button>
  );
}

export default React.memo(Button);
```

## Documentation

### FormFull

`props` passed to the component that manages the form:

| Name          | Type      | Required | Description                                                                                                                                                                                                                             |
| ------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actualValues  | object    | no       | Object that defines the current values ​​of each field in the form. example: `{ username: "form", password: "full123" }`. **important**: Values ​​will only be inserted into the field if they change from the previous "actualValues". |
| children      | ReactNode | `yes`    | Rendered components. All fields and buttons on the form must be children of the `FormFull` component                                                                                                                                    |
| clearOnSubmit | bool      | no       | If `true` is passed, the fields will be cleared (or filled in by default) when submitting the form                                                                                                                                      |
| disabled      | bool      | no       | If `true` is passed, all fields will be disabled                                                                                                                                                                                        |
| formRef       | func      | no       | Function to get the class that manages the form, normally used to handle exceptions and others advanced treatments                                                                                                                      |
| onSubmit      | func      | `yes`    | Function called when the form is submitted, receiving the values ​​in a object `{ key: value }`                                                                                                                                         |
| onChange      | func      | no       | Function called when the value of any field changes                                                                                                                                                                                     |
| submitOnClear | bool      | no       | If `true` is passed, the function `onSubmit` will be called when the form is cleared. \*\*Only works if all fields are optional                                                                                                         |

### useFormFull.field

Hook used to connect a **field** component to be controlled by `form-full`

Parameters:

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

Return values:
