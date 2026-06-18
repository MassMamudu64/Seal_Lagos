import { buildEntityCSV } from "@/lib/admin/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const csv = await buildEntityCSV("quotes", {
    status: url.searchParams.get("status") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quotes.csv"`,
    },
  });
}
