const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateBudgetProgress,
  formatCurrency,
  getTripDuration,
  summarizeTrips,
  tripCardMarkup,
  trips,
} = require("../app.js");

test("starter dashboard includes four upcoming trips", () => {
  assert.equal(trips.length, 4);
  assert.deepEqual(trips.map((trip) => trip.id), [
    "penang-weekend",
    "bali-reset",
    "kyoto-spring",
    "sydney-winter",
  ]);
});

test("trip duration uses calendar days without local timezone drift", () => {
  assert.equal(getTripDuration("2026-11-28", "2026-12-01"), 3);
  assert.equal(getTripDuration("2027-03-18", "2027-03-25"), 7);
});

test("summary totals nights and travel costs", () => {
  assert.deepEqual(summarizeTrips(trips), {
    tripCount: 4,
    nights: 21,
    budget: 7720,
    booked: 1490,
  });
});

test("currency is presented in Singapore dollars", () => {
  assert.match(formatCurrency(2600), /^\$2,600$|^SGD\s2,600$/);
});

test("trip card exposes destination, status, and duration", () => {
  const markup = tripCardMarkup(trips[0]);
  assert.match(markup, /George Town/);
  assert.match(markup, /Booked/);
  assert.match(markup, /3 nights/);
});

test("budget progress reports booked percentage and remaining spend", () => {
  assert.deepEqual(calculateBudgetProgress(trips), {
    percentage: 19,
    remaining: 6230,
  });
});

test("budget progress handles empty and overbooked plans", () => {
  assert.deepEqual(calculateBudgetProgress([]), { percentage: 0, remaining: 0 });
  assert.deepEqual(
    calculateBudgetProgress([
      { startDate: "2027-01-01", endDate: "2027-01-02", budget: 100, booked: 125 },
    ]),
    { percentage: 100, remaining: 0 },
  );
});
