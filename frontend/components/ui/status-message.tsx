export function StatusMessage({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm ${
        tone === "success"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {message}
    </div>
  );
}
