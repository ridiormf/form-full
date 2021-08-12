import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { sleep } from "./utils/sleep";
import { ActualValuesType, FormFull } from "form-full";
import "./styles.css";
import Input from "./forms/InputComponent";
import Button from "./forms/ButtonComponent";
import { FFDataReturnType } from "form-full";

export default function App() {
  const [actualValues, setActualValues] =
    React.useState<ActualValuesType | null>({});
  const [savedValues, setSavedValues] = React.useState<FFDataReturnType>();

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
          actualValues={actualValues ?? {}}
          onSubmit={(data: FFDataReturnType) => {
            setSavedValues(data);
          }}
        >
          <div className="inputs-container">
            <Input name="name" label="Your name" required="Required field" />
            <Input name="age" label="Your age" />
            <Input
              name="defaultValue"
              label="Default Value"
              defaultValue="Some Default Value"
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

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
