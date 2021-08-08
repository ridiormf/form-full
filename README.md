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
