const trips = [
  {
    id: "penang-weekend",
    destination: "George Town",
    country: "Malaysia",
    startDate: "2026-11-28",
    endDate: "2026-12-01",
    travelMode: "Bus",
    status: "Booked",
    budget: 620,
    booked: 410,
  },
  {
    id: "bali-reset",
    destination: "Ubud",
    country: "Indonesia",
    startDate: "2026-12-18",
    endDate: "2026-12-23",
    travelMode: "Flight",
    status: "Planning",
    budget: 1400,
    booked: 760,
  },
  {
    id: "kyoto-spring",
    destination: "Kyoto",
    country: "Japan",
    startDate: "2027-03-18",
    endDate: "2027-03-25",
    travelMode: "Flight",
    status: "Researching",
    budget: 2600,
    booked: 320,
  },
  {
    id: "sydney-winter",
    destination: "Sydney",
    country: "Australia",
    startDate: "2027-06-09",
    endDate: "2027-06-15",
    travelMode: "Flight",
    status: "Wish list",
    budget: 3100,
    booked: 0,
  },
];

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00Z`);
}

function getTripDuration(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((parseDate(endDate) - parseDate(startDate)) / millisecondsPerDay));
}

function summarizeTrips(items) {
  return items.reduce(
    (summary, trip) => ({
      tripCount: summary.tripCount + 1,
      nights: summary.nights + getTripDuration(trip.startDate, trip.endDate),
      budget: summary.budget + trip.budget,
      booked: summary.booked + trip.booked,
    }),
    { tripCount: 0, nights: 0, budget: 0, booked: 0 },
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTripDate(dateString) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDate(dateString));
}

function sortTrips(items, sortBy = "departure-asc") {
  const comparisons = {
    "departure-asc": (a, b) => a.startDate.localeCompare(b.startDate),
    "destination-asc": (a, b) => a.destination.localeCompare(b.destination, "en-SG"),
    "budget-desc": (a, b) => b.budget - a.budget,
    "booked-desc": (a, b) => b.booked - a.booked,
  };

  return [...items].sort(comparisons[sortBy] ?? comparisons["departure-asc"]);
}

function tripCardMarkup(trip) {
  const start = parseDate(trip.startDate);
  const month = new Intl.DateTimeFormat("en-SG", { month: "short", timeZone: "UTC" }).format(start);
  const day = new Intl.DateTimeFormat("en-SG", { day: "2-digit", timeZone: "UTC" }).format(start);
  const nights = getTripDuration(trip.startDate, trip.endDate);

  return `
    <article class="trip-card">
      <div class="date-block" aria-label="Starts ${formatTripDate(trip.startDate)}">
        <span>${month}</span>
        <strong>${day}</strong>
      </div>
      <div>
        <h3>${trip.destination}</h3>
        <div class="trip-meta">
          <span>${trip.country}</span>
          <span>${nights} ${nights === 1 ? "night" : "nights"}</span>
          <span>${trip.travelMode}</span>
        </div>
        <span class="status">${trip.status}</span>
        <div class="trip-costs">
          <span>Budget ${formatCurrency(trip.budget)}</span>
          <span>Booked ${formatCurrency(trip.booked)}</span>
        </div>
      </div>
    </article>`;
}

function renderDashboard(items = trips, sortBy = "departure-asc") {
  const summary = summarizeTrips(items);
  const orderedTrips = sortTrips(items, sortBy);
  const nextTrip = sortTrips(items, "departure-asc")[0];

  document.querySelector("#trip-count").textContent = summary.tripCount;
  document.querySelector("#night-count").textContent = summary.nights;
  document.querySelector("#budget-total").textContent = formatCurrency(summary.budget);
  document.querySelector("#booked-total").textContent = formatCurrency(summary.booked);
  document.querySelector("#next-stop").textContent = nextTrip?.destination ?? "No trips";
  document.querySelector("#trip-summary").textContent = `${summary.tripCount} upcoming ${summary.tripCount === 1 ? "trip" : "trips"}`;
  document.querySelector("#trip-list").innerHTML = orderedTrips.map(tripCardMarkup).join("");
}

if (typeof document !== "undefined") {
  renderDashboard();
  document.querySelector("#trip-sort").addEventListener("change", (event) => {
    renderDashboard(trips, event.currentTarget.value);
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    formatCurrency,
    formatTripDate,
    getTripDuration,
    sortTrips,
    summarizeTrips,
    tripCardMarkup,
    trips,
  };
}
