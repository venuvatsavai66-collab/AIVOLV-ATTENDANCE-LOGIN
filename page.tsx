import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import AnnouncementsClient from "./announcements-client";

export const revalidate = 0;

export default async function AnnouncementsPage() {
  const currentUser = await requireAuth();
  const isAdmin = currentUser.role?.code === "SUPER_ADMIN" || currentUser.role?.code === "HR_ADMIN";
  const employee = currentUser.employee;
  const roleId = currentUser.roleId;

  const [announcements, departments, roles] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        deletedAt: null,
        OR: [
          { targetType: "ALL" },
          { targetType: "ROLE", targetId: roleId },
          ...(employee?.departmentId ? [{ targetType: "DEPARTMENT", targetId: employee.departmentId }] : []),
        ],
      },
      include: {
        author: { include: { employee: true } },
        reads: { where: { userId: currentUser.id } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.department.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    }),
  ]);

  const processed = announcements.map((a) => ({
    ...a,
    isRead: a.reads.length > 0,
  }));

  return (
    <AnnouncementsClient
      announcements={processed}
      departments={departments}
      roles={roles}
      isAdmin={isAdmin}
    />
  );
}
