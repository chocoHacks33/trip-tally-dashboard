const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getTripDuration,
  sortTrips,
  summarizeTrips,
  tripCardMarkup,
  trips,
} = require("../app.js");

test("trip sorting supports useful planning orders without mutating source data", () => {
  const originalOrder = trips.map((trip) => trip.id);

  assert.deepEqual(sortTrips(trips, "destination-asc").map((trip) => trip.destination), [
    "George Town",
    "Kyoto",
    "Sydney",
    "Ubud",
  ]);
  assert.deepEqual(sortTrips(trips, "budget-desc").map((trip) => trip.id), [
    "sydney-winter",
    "kyoto-spring",
    "bali-reset",
    "penang-weekend",
  ]);
  assert.deepEqual(trips.map((trip) => trip.id), originalOrder);
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
