import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function hasPermission(user: any, permissionCode: string): boolean {
  if (!user || !user.role) return false;
  
  // Super Admin has unrestricted access to all modules
  if (user.role.code === "SUPER_ADMIN") return true;

  if (!user.role.rolePermissions) return false;

  return user.role.rolePermissions.some(
    (rp: any) => rp.permission && rp.permission.code === permissionCode
  );
}

export async function requirePermission(permissionCode: string) {
  const user = await requireAuth();
  
  if (!hasPermission(user, permissionCode)) {
    redirect("/unauthorized");
  }
  
  return user;
}

export function canAccessEmployee(currentUser: any, targetEmployeeId: string, targetDepartmentId?: string | null): boolean {
  if (!currentUser) return false;

  const roleCode = currentUser.role?.code;

  // 1. Super Admin and HR Admin have global employee access
  if (roleCode === "SUPER_ADMIN" || roleCode === "HR_ADMIN") {
    return true;
  }

  // 2. Manager has access to employees in their managed department(s)
  if (roleCode === "MANAGER") {
    if (!currentUser.employee) return false;
    
    // If the manager manages the department of the target employee
    const managedDepts = currentUser.employee.managedDepartments || [];
    const managesTargetDept = managedDepts.some((d: any) => d.id === targetDepartmentId);
    
    // Or if checking self
    const isSelf = currentUser.employee.id === targetEmployeeId;

    return isSelf || managesTargetDept;
  }

  // 3. Employee: Self-access only
  if (roleCode === "EMPLOYEE") {
    return currentUser.employee?.id === targetEmployeeId;
  }

  // 4. Viewer: Read-only access allowed for basic directory
  if (roleCode === "VIEWER") {
    return true;
  }

  return false;
}
