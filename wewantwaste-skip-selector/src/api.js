export const fetchSkips = async () => {
  const response = await fetch(
    "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
  );
  const data = await response.json();
  return data;
};
