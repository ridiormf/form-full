import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { sleep } from "./utils/sleep";
import { CurrentValuesType, FormFull } from "form-full";
import "./styles.css";
import Input from "./forms/InputComponent";
import Button from "./forms/ButtonComponent";
import InputCPF from "./forms/InputCPF";

type FormData = {
  name: string;
  age: string;
  defaultValue: string;
  submit: string;
  clear: string;
  clearDefault: string;
  simulation: string;
};

export default function App() {
  const [currentValues, setCurrentValues] = React.useState<CurrentValuesType>(
    {},
  );
  const [savedValues, setSavedValues] = React.useState<Partial<FormData>>();
  const [disabledForm, setDisabledForm] = React.useState(false);

  function simulateRequest() {
    setCurrentValues({});
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
        <FormFull<FormData>
          disabled={disabledForm}
          currentValues={currentValues ?? {}}
          onSubmit={(data) => {
            setSavedValues(data);
          }}>
          <div className='inputs-container'>
            <Input name='name' label='Your name' required='Required field' />
            <Input name='age' label='Your age' />
            <Input<FormData>
              name='defaultValue'
              label='Default Value'
              defaultValue='Some Default Value'
            />
            <InputCPF
              name='cpf'
              label='CPF'
              defaultValue='Some Default Value'
            />
          </div>
          <Button action='submit' feedback>
            Submit
          </Button>
          <Button action='clear'>Clear All Values</Button>
          <Button action='clearDefault' a>
            Set All Values to Default
          </Button>
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

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement,
);
