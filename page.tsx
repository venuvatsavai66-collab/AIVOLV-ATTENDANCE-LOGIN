import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardView from "@/components/dashboards/admin-dashboard";
import EmployeeDashboardView from "@/components/dashboards/employee-dashboard";

export const revalidate = 0;

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const roleCode = currentUser?.role?.code || "EMPLOYEE";
  const employee = currentUser?.employee;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  // Common Queries
  const [
    userCount,
    employeeCount,
    departmentCount,
    presentCount,
    lateCount,
    pendingLeaves,
    activeTasksCount,
    overdueTasksCount,
    recentAuditLogs,
    upcomingHolidays,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.employee.count({ where: { deletedAt: null } }),
    prisma.department.count({ where: { deletedAt: null, isActive: true } }),
    prisma.attendance.count({ where: { date: { gte: startOfDay }, status: "PRESENT" } }),
    prisma.attendance.count({ where: { date: { gte: startOfDay }, status: "LATE" } }),
    prisma.leaveRequest.findMany({
      where: { status: "PENDING" },
      include: { employee: true, leaveType: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where: { deletedAt: null, status: { not: "COMPLETED" } } }),
    prisma.task.count({
      where: {
        deletedAt: null,
        status: { not: "COMPLETED" },
        dueDate: { lt: now },
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.holiday.findMany({
      where: { isActive: true, date: { gte: now } },
      take: 4,
      orderBy: { date: "asc" },
    }),
  ]);

  if (roleCode === "SUPER_ADMIN" || roleCode === "HR_ADMIN" || roleCode === "MANAGER") {
    return (
      <AdminDashboardView
        employeeCount={employeeCount}
        userCount={userCount}
        departmentCount={departmentCount}
        presentCount={presentCount}
        lateCount={lateCount}
        pendingLeaves={pendingLeaves}
        activeTasksCount={activeTasksCount}
        overdueTasksCount={overdueTasksCount}
        recentAuditLogs={recentAuditLogs}
        upcomingHolidays={upcomingHolidays}
      />
    );
  }

  // Employee Dashboard Data
  let todayAttendance = null;
  let userBalances: any[] = [];
  let myTasks: any[] = [];

  if (employee) {
    [todayAttendance, userBalances, myTasks] = await Promise.all([
      prisma.attendance.findFirst({
        where: { employeeId: employee.id, date: { gte: startOfDay } },
      }),
      prisma.leaveBalance.findMany({
        where: { employeeId: employee.id, year: 2026 },
        include: { leaveType: true },
      }),
      prisma.task.findMany({
        where: { assigneeId: employee.id, status: { not: "COMPLETED" } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
  }

  return (
    <EmployeeDashboardView
      employee={employee || { firstName: currentUser?.email || "User", lastName: "", employeeCode: "LAN-USR" }}
      todayAttendance={todayAttendance}
      userBalances={userBalances}
      myTasks={myTasks}
      upcomingHolidays={upcomingHolidays}
    />
  );
}
