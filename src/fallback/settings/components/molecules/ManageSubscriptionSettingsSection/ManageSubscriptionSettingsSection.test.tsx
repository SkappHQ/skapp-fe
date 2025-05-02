import { render } from "@testing-library/react";

import ManageSubscriptionSettingsSection from "./ManageSubscriptionSettingsSection";

describe("ManageSubscriptionSettingsSection", () => {
  it("renders without crashing", () => {
    const { container } = render(<ManageSubscriptionSettingsSection />);
    expect(container.firstChild).toBeDefined();
  });

  it("renders an empty fragment", () => {
    const { container } = render(<ManageSubscriptionSettingsSection />);
    expect(container.firstChild).toBeNull();
  });
});
