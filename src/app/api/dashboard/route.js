import { NextResponse } from "next/server";
import { getDashboardStats, getRecentActivity, getUserNotebooks,getStudyHeatmap } from "@/library/actions";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const stats = await getDashboardStats(userId);
    const recentActivity = await getRecentActivity(userId);
    const notebooks = await getUserNotebooks(userId);
    const studyHeatmap = await getStudyHeatmap(userId);
    return NextResponse.json({
      stats,
      recentActivity,
      notebooks,
      studyHeatmap
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}