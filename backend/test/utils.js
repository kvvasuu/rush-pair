import { expect } from "chai";
import sinon from "sinon";

import { calculateYearsSince } from "../utils.js";

describe("Calculate years since provided date", () => {
  it("should calculate the correct number of years", () => {
    const today = new Date("2024-12-08");
    const dateString = "2000-06-15";

    expect(calculateYearsSince(dateString, today)).to.equal(24);
  });

  it("should return 0 for the same year and day", () => {
    const today = new Date("2024-12-08");
    const dateString = "2024-12-08";

    expect(calculateYearsSince(dateString, today)).to.equal(0);
  });

  it("should calculate negative years for future dates", () => {
    const today = new Date("2024-12-08");
    const dateString = "2025-01-01";

    expect(calculateYearsSince(dateString, today)).to.equal(-1);
  });
});
