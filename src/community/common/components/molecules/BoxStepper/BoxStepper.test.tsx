import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import BoxStepper from "./BoxStepper";
import MockTheme from "~community/common/mocks/MockTheme";

describe("BoxStepper", () => {
  test("renders BoxStepper component", () => {
    render(
      <MockTheme>
        <BoxStepper activeStep={1} steps={["Step 1", "Step 2", "Step 3"]} onStepClick={() => {}} />
      </MockTheme>
    );
  });
});
