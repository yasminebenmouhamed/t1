export function Card({ children }) {
  return <div className="border rounded shadow p-4">{children}</div>;
}
export function CardHeader({ children }) {
  return <div className="font-bold text-lg">{children}</div>;
}
export function CardTitle({ children }) {
  return <div className="text-gray-700">{children}</div>;
}
export function CardContent({ children }) {
  return <div>{children}</div>;
}
