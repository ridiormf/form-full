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

## FormFull

`props` passed to the component that manages the form:

| Name          | Type      | Default      | Description                                                                                                                     |
| ------------- | --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| actualValues  | object    |              | Object that defines the current values ​​of each field in the form. example: `{ username: "form", password: "full123" }`        |
| children      | ReactNode |              | Rendered components. All fields and buttons on the form must be children of the `FormFull` component                            |
| clearOnSubmit | bool      |              | If `true` is passed, the fields will be cleared (or filled in by default) when submitting the form                              |
| disabled      | bool      |              | If `true` is passed, all fields will be disabled                                                                                |
| formRef       | func      |              | Function to get the class that manages the form, normally used to handle exceptions                                             |
| onSubmit      | func      | **required** | Function called when the form is submitted, receiving the values ​​in a object `{ key: value }`                                 |
| onChange      | func      |              | Function called when the value of any field changes                                                                             |
| submitOnClear | bool      |              | If `true` is passed, the function `onSubmit` will be called when the form is cleared. \*\*Only works if all fields are optional |

### More documentation and guides are under development and will be made available upon release of version 1.0.0

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
    validationLoading,
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
        disabled={formDisabled || validationLoading}
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
