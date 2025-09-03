export default async function fetchJSON(url) {
  const res = await fetch(url);
  return await res.json();
}
