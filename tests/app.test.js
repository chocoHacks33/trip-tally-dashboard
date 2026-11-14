const test = require("node:test");
const assert = require("node:assert/strict");

const {
  escapeCsvCell,
  formatCurrency,
  getTripDuration,
  summarizeTrips,
  tripCardMarkup,
  tripsToCsv,
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

test("CSV export includes a header and one row per trip", () => {
  const lines = tripsToCsv(trips).split("\r\n");
  assert.equal(lines.length, trips.length + 1);
  assert.equal(lines[0], '"Destination","Country","Start date","End date","Travel mode","Status","Budget SGD","Booked SGD"');
  assert.match(lines[1], /"George Town","Malaysia"/);
});

test("CSV cells escape quotes and neutralize spreadsheet formulas", () => {
  assert.equal(escapeCsvCell('Seoul, "South"'), '"Seoul, ""South"""');
  assert.equal(escapeCsvCell("=2+3"), '"\'=2+3"');
  assert.equal(escapeCsvCell("-10+20"), '"\'-10+20"');
});
