import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { demos } from "../../db/schema";
import { getChatGPTUser } from "../../auth/chatgpt-auth";
import {
  act,
  createDemo,
  project,
  publicTracking,
  DomainError,
} from "../../server/domain.mjs";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
async function load() {
  const user = await getChatGPTUser();
  if (!user)
    throw new DomainError("Vui lòng đăng nhập để mở bản demo riêng tư.", 401);
  const db = getDb();
  let [row] = await db
    .select()
    .from(demos)
    .where(eq(demos.userId, user.userId));
  if (!row) {
    await db
      .insert(demos)
      .values({
        userId: user.userId,
        state: JSON.stringify(createDemo()),
        version: 0,
      })
      .onConflictDoNothing();
    [row] = await db.select().from(demos).where(eq(demos.userId, user.userId));
  }
  return { db, row, state: JSON.parse(row.state), user };
}
function failure(error: unknown) {
  if (error instanceof DomainError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers },
    );
  console.error(
    "SYNERA request failed",
    error instanceof Error ? error.name : "Unknown",
  );
  return Response.json(
    { error: "Chưa tải được dữ liệu demo. Vui lòng thử lại." },
    { status: 500, headers },
  );
}
export async function GET(request: Request) {
  try {
    const { state, row } = await load();
    state.version = row.version;
    const token = new URL(request.url).searchParams.get("tracking");
    return Response.json(
      token ? publicTracking(state, token) : project(state),
      { headers },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (Number(request.headers.get("content-length") || 0) > 100000)
      throw new DomainError("Yêu cầu quá lớn.", 413);
    const value = await request.json();
    if (!origin || origin !== new URL(request.url).origin)
      throw new DomainError("Nguồn yêu cầu không hợp lệ.", 403);
    if (
      !value ||
      typeof value !== "object" ||
      !("action" in value) ||
      typeof value.action !== "string" ||
      !("version" in value) ||
      !Number.isSafeInteger(value.version)
    )
      throw new DomainError("Yêu cầu không hợp lệ.", 400);
    const body = value as {
      action: string;
      version: number;
      payload?: Record<string, unknown>;
    };
    const { db, row, state, user } = await load();
    if (body.version !== row.version)
      throw new DomainError(
        "Dữ liệu đã đổi ở cửa sổ khác. Tải lại rồi thử tiếp.",
        409,
      );
    const next = act(state, body.action, body.payload);
    if (body.action === "quote") return Response.json(next, { headers });
    next.version = row.version + 1;
    const saved = await db
      .update(demos)
      .set({ state: JSON.stringify(next), version: next.version })
      .where(and(eq(demos.userId, user.userId), eq(demos.version, row.version)))
      .returning({ version: demos.version });
    if (!saved.length)
      throw new DomainError(
        "Có cập nhật đồng thời. Tải lại rồi thử tiếp.",
        409,
      );
    return Response.json(project(next), { headers });
  } catch (error) {
    return failure(error);
  }
}
