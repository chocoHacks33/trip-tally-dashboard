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
          <span><small>Budget</small><strong>${formatCurrency(trip.budget)}</strong></span>
          <span><small>Booked</small><strong>${formatCurrency(trip.booked)}</strong></span>
        </div>
      </div>
    </article>`;
}

function renderDashboard(items = trips) {
  const summary = summarizeTrips(items);
  const orderedTrips = [...items].sort((a, b) => a.startDate.localeCompare(b.startDate));

  document.querySelector("#trip-count").textContent = summary.tripCount;
  document.querySelector("#night-count").textContent = summary.nights;
  document.querySelector("#budget-total").textContent = formatCurrency(summary.budget);
  document.querySelector("#booked-total").textContent = formatCurrency(summary.booked);
  document.querySelector("#next-stop").textContent = orderedTrips[0]?.destination ?? "No trips";
  document.querySelector("#trip-summary").textContent = `${summary.tripCount} upcoming ${summary.tripCount === 1 ? "trip" : "trips"}`;
  document.querySelector("#trip-list").innerHTML = orderedTrips.map(tripCardMarkup).join("");
}

if (typeof document !== "undefined") {
  renderDashboard();
}

if (typeof module !== "undefined") {
  module.exports = {
    formatCurrency,
    formatTripDate,
    getTripDuration,
    summarizeTrips,
    tripCardMarkup,
    trips,
  };
}
