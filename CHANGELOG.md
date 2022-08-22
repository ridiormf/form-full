## 4.0.0 (August 21, 2022)

### Validations

- The `validation` and `asyncValidation` props have been removed and replaced by the `validations` prop;
- The prop `validations` will work receiving an `array` of functions that will perform the validations simultaneously, accepting synchronous and asynchronous validations;
- Error messages will be defined according to the order of the informed functions. The first in the order that returns an error will define the return message.

### Types

- Updated generic form type for better usability;
- Now the `name` prop is defined from a key in the generic data type.

### General

- Removing unnecessary hooks calls from `useField`;
- Added listeners for changing props in fields dynamically changing form behavior (`validations`, `defaultValue`, `mask`, `maskForSubmit`).
