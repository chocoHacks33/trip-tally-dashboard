const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getTripDuration,
  summarizeTrips,
  summarizeTravelModes,
  tripCardMarkup,
  travelModeMarkup,
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

test("travel mode summary ranks modes and calculates their shares", () => {
  assert.deepEqual(summarizeTravelModes(trips), [
    { mode: "Flight", count: 3, percentage: 75 },
    { mode: "Bus", count: 1, percentage: 25 },
  ]);
  assert.deepEqual(summarizeTravelModes([]), []);
});

test("travel mode insight includes accessible counts and percentages", () => {
  const markup = travelModeMarkup(trips);
  assert.match(markup, /Flight: 3 trips, 75%/);
  assert.match(markup, /Bus: 1 trip, 25%/);
  assert.match(markup, /width: 75%/);
});
