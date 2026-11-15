const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getTripDuration,
  statusBreakdownMarkup,
  summarizeTrips,
  summarizeStatuses,
  tripCardMarkup,
  trips,
} = require("../app.js");

test("status summary reports counts and percentages", () => {
  assert.deepEqual(summarizeStatuses([trips[0], trips[0], trips[1]]), [
    { status: "Booked", count: 2, percentage: 67 },
    { status: "Planning", count: 1, percentage: 33 },
  ]);
  assert.deepEqual(summarizeStatuses([]), []);
});

test("status breakdown exposes accessible progress values", () => {
  const markup = statusBreakdownMarkup([trips[0], trips[0], trips[1]]);
  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /aria-valuemax="3"/);
  assert.match(markup, /aria-valuenow="2"/);
  assert.match(markup, /width: 67%/);
});

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
