import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import AnalyticCardSkeleton from "./AnalyticCardSkeleton";
import MockTheme from "~community/common/mocks/MockTheme"; // Import MockTheme

describe("AnalyticCardSkeleton", () => {
  test("renders the AnalyticCardSkeleton without errors", () => {
    render(
      <MockTheme>
        <AnalyticCardSkeleton />
      </MockTheme>
    );
  });
});
