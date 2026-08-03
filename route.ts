import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const priorityParam = searchParams.get("priority");

    const roleCode = currentUser.role?.code;
    const employee = currentUser.employee;

    const where: any = { deletedAt: null };

    if (statusParam && statusParam !== "ALL") where.status = statusParam;
    if (priorityParam && priorityParam !== "ALL") where.priority = priorityParam;

    // Role-based Task Scoping
    if (roleCode === "EMPLOYEE" && employee) {
      where.assigneeId = employee.id;
    } else if (roleCode === "MANAGER" && employee && employee.departmentId) {
      where.OR = [
        { departmentId: employee.departmentId },
        { creatorId: currentUser.id },
        { assigneeId: employee.id },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { include: { department: true, designation: true } },
        creator: true,
        department: true,
        comments: {
          include: { user: { include: { employee: true } } },
          orderBy: { createdAt: "asc" },
        },
        files: true,
        workLogs: {
          include: { employee: true },
          orderBy: { logDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const processedTasks = tasks.map((t) => ({
      ...t,
      isOverdue: Boolean(t.dueDate && new Date(t.dueDate) < now && t.status !== "COMPLETED"),
    }));

    return NextResponse.json({ success: true, data: processedTasks });
  } catch (error: any) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, assigneeId, departmentId, dueDate, priority } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Task title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        assigneeId: assigneeId || null,
        creatorId: currentUser.id,
        departmentId: departmentId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "MEDIUM",
        status: "TO_DO",
      },
      include: {
        assignee: true,
        department: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: "TASK_CREATE",
        module: "TASKS",
        details: `Created task "${task.title}" (Priority: ${task.priority}).`,
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
