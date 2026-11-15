const test = require("node:test");
const assert = require("node:assert/strict");

const {
  filterTrips,
  formatCurrency,
  getTripDuration,
  summarizeTrips,
  tripCardMarkup,
  trips,
} = require("../app.js");

test("trip search matches destinations, countries, statuses, and transport", () => {
  assert.deepEqual(filterTrips(trips, "japan").map((trip) => trip.id), ["kyoto-spring"]);
  assert.deepEqual(filterTrips(trips, "flight").map((trip) => trip.id), [
    "bali-reset",
    "kyoto-spring",
    "sydney-winter",
  ]);
  assert.deepEqual(filterTrips(trips, "  BOOKED ").map((trip) => trip.id), ["penang-weekend"]);
  assert.equal(filterTrips(trips, "train").length, 0);
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
