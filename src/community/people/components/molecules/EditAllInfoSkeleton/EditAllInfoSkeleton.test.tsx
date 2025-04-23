import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import EditAllInfoSkeleton from "./EditAllInfoSkeleton";
import MockTheme from "~community/common/mocks/MockTheme";

describe("EditAllInfoSkeleton", () => {
  test("renders the skeleton component", () => {
    render(
      <MockTheme>
        <EditAllInfoSkeleton />
      </MockTheme>
    );
  });
});
