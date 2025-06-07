const map = L.map("map").setView([19.076, 72.8777], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);


L.marker([lat,lon])
  .addTo(map)
  .bindPopup(loc)
  .openPopup();
