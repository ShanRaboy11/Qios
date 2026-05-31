import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireEmployeePermission } from "@/lib/serverPermissions";
import { formatManilaDate, formatManilaTime } from "@/lib/salesDashboard";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------
type OrderItemRow = {
  id: string;
  quantity: number;
  unit_price: number | string | null;
  menu_items?: { id: string; name: string } | null;
};

type OrderRow = {
  id: string;
  qr_hash: string | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total_price: number | string;
  created_at: string;
  table_number: string | null;
  order_items?: OrderItemRow[] | null;
};

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildTransactions(orders: OrderRow[]) {
  return orders.map((order) => {
    const items = (order.order_items ?? [])
      .map(
        (item) =>
          `${item.quantity}x ${item.menu_items?.name ?? "Unknown Item"}`,
      )
      .join(", ");

    return {
      id: order.id,
      orderNumber: order.qr_hash ?? order.id,
      date: formatManilaDate(order.created_at),
      time: formatManilaTime(order.created_at),
      createdAt: order.created_at,
      items,
      method: order.payment_method ?? "Pending",
      status: order.status,
      paymentStatus: order.payment_status,
      total: toNumber(order.total_price),
      tableNumber: order.table_number,
    };
  });
}

function buildTransactionSearchText(
  order: OrderRow,
  transaction: ReturnType<typeof buildTransactions>[number],
) {
  return [
    order.id,
    order.qr_hash ?? "",
    order.status,
    order.payment_status,
    order.payment_method ?? "",
    String(order.total_price ?? ""),
    order.created_at,
    order.table_number ?? "",
    transaction.orderNumber,
    transaction.date,
    transaction.time,
    transaction.items,
    transaction.method,
    transaction.status,
    transaction.paymentStatus,
    String(transaction.total),
  ]
    .join(" ")
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// GET /api/tenants/[tenantId]/employee/transactions
// ---------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await context.params;
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;

  // Employees need "Payment Confirmation" permission; admins and super_admins bypass automatically.
  const auth = await requireEmployeePermission(
    tenantId,
    "Payment Confirmation",
    token,
  );

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createSupabaseAdminClient();
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "all";
  const paymentStatus = searchParams.get("paymentStatus")?.trim() ?? "all";
  const includeAll = searchParams.get("all") === "true";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10),
  );
  const limit = Math.max(
    1,
    Math.min(100, Number.parseInt(searchParams.get("limit") ?? "10", 10)),
  );

  try {
    let query = admin
      .from("orders")
      .select(
        `
        id,
        qr_hash,
        status,
        payment_status,
        payment_method,
        total_price,
        created_at,
        table_number,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name
          )
        )
      `,
        { count: "exact" },
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    if (includeAll || search) {
      query = query.range(0, 9999);
    } else {
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalise Supabase nested relations
    const normalised = (data ?? []).map(
      (raw: any): OrderRow => ({
        id: String(raw.id),
        qr_hash: raw.qr_hash ?? null,
        status: String(raw.status ?? ""),
        payment_status: String(raw.payment_status ?? ""),
        payment_method: raw.payment_method ?? null,
        total_price: raw.total_price ?? 0,
        created_at: String(raw.created_at ?? new Date().toISOString()),
        table_number: raw.table_number ?? null,
        order_items: (raw.order_items ?? []).map((it: any) => ({
          id: String(it.id),
          quantity: Number(it.quantity ?? 0),
          unit_price: it.unit_price ?? null,
          menu_items: Array.isArray(it.menu_items)
            ? (it.menu_items[0] ?? null)
            : (it.menu_items ?? null),
        })),
      }),
    );

    const transactions = buildTransactions(normalised);
    const searchTerm = search.toLowerCase();
    const filteredTransactions = search
      ? transactions.filter((transaction, index) =>
          buildTransactionSearchText(normalised[index], transaction).includes(
            searchTerm,
          ),
        )
      : transactions;

    const offset = (page - 1) * limit;
    const paginatedTransactions = includeAll
      ? filteredTransactions
      : search
        ? filteredTransactions.slice(offset, offset + limit)
        : transactions;
    const total = search ? filteredTransactions.length : (count ?? 0);

    // fetch tenant business name so employees can export proper header
    const { data: tenant } = await admin
      .from("tenants")
      .select("business_name")
      .eq("id", tenantId)
      .maybeSingle();

    return NextResponse.json({
      businessName:
        typeof tenant?.business_name === "string" ? tenant.business_name : "",
      data: paginatedTransactions,
      total,
      page: includeAll ? 1 : page,
      limit: includeAll ? Math.max(paginatedTransactions.length, 1) : limit,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load transactions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
