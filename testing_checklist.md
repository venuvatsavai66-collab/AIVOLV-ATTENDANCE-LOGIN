# LAN Office Management System - Complete System Testing & QA Checklist

A comprehensive testing checklist covering functional requirements, security controls, role-based permissions, edge case scenarios, and operational workflows.

---

## 🔐 1. Authentication & Security Hardening
- [x] **Valid Sign-In**: User logs in with correct email/username and password -> Issued HTTP-Only encrypted JWT cookie (`lan_session_token`).
- [x] **Invalid Password**: 1 to 4 failed attempts display remaining attempts warning.
- [x] **5-Attempt Account Lockout (Edge Case)**: 5th failed attempt locks user account for 15 minutes (`locked_until`). Submissions during lockout return 403 Account Locked error.
- [x] **Password Hashing**: Passwords stored as salted bcrypt hashes in database (`password_hash`).
- [x] **Session Timeout**: JWT token expires after 8 hours (`SESSION_MAX_AGE_HOURS=8`).
- [x] **LAN IP & Device Allowlist**: Requests from non-whitelisted IPs or unauthorized MAC addresses are rejected with HTTP 403.

---

## 👥 2. Role-Based Access Control (RBAC)
- [x] **Super Admin (`SUPER_ADMIN`)**: Unrestricted global clearance. Access to system backups, user administration, global reports, and security audit logs.
- [x] **HR Admin (`HR_ADMIN`)**: Access to employee directory, department creation, designation management, attendance register corrections, leave approvals, and document verifications.
- [x] **Manager (`MANAGER`)**: Access restricted to assigned department employees, department team attendance, team leave approvals, and team task assignments.
- [x] **Employee (`EMPLOYEE`)**: Access restricted to self employee profile, attendance kiosk check-in/out, personal leave balances, and assigned tasks.
- [x] **Viewer (`VIEWER`)**: Read-only directory and reporting access.

---

## 💼 3. Employee Management Module
- [x] **Create Employee**: Uniqueness check on `employeeCode`. Generates `EMPLOYEE_CREATE` audit log.
- [x] **Edit Profile**: Updates phone, emergency contacts, job details, and status. Generates `EMPLOYEE_UPDATE` audit log.
- [x] **Status Toggles**: Toggle employee status (`ACTIVE`, `INACTIVE`, `ON_LEAVE`, `TERMINATED`).

---

## ⏱️ 4. Attendance Check-In / Check-Out & Rules Engine
- [x] **Single Daily Check-In**: Employee can check in once per calendar day.
- [x] **Duplicate Check-In Rejection (Edge Case)**: Second check-in attempt on the same day returns HTTP 400 (`"Already checked in for today"`).
- [x] **Single Daily Check-Out**: Employee can check out once per day. Second check-out attempt returns HTTP 400.
- [x] **Late Arrival Calculation**: Check-in after `officeStartTime + graceMinutes` (e.g. `09:15 AM`) computes `lateMinutes` and flags `LATE` status.
- [x] **Half-Day Duration**: Shift duration less than `halfDayMinutes` (`240` mins) flags `HALF_DAY`.
- [x] **Overtime Minutes**: Work exceeding `overtimeThresholdMinutes` (`540` mins) computes `overtimeMinutes`.

---

## 📝 5. Attendance Register & Manual Corrections
- [x] **Daily & Monthly Filters**: Filter register entries by Date, Month, Department, Employee, and Status.
- [x] **Mandatory Reason Validation**: Admin manual correction requires a non-empty `reason` string.
- [x] **Old-vs-New Audit Log**: `ATTENDANCE_MANUAL_CORRECTION` audit entry logs old check-in/out, old status vs new check-in/out, new status, and admin reason.

---

## 🌴 6. Leave Management & Monthly Quota Rules
- [x] **Leave Balances**: Tracks allocated, used, and remaining days for Sick Leave (Paid), Casual Leave (Paid), and Annual Leave (Paid).
- [x] **Monthly Quota Limit (Edge Case)**: Enforces maximum 1 Sick Leave day and 1 Casual Leave day per calendar month per employee. Second attempt in same month returns HTTP 400.
- [x] **Admin Approval**: Approved paid leave deducts days from `LeaveBalance` and logs `LEAVE_REQUEST_APPROVED`.
- [x] **Admin Rejection (Edge Case)**: Rejected leave requires rejection reason, preserves balance untouched, and logs `LEAVE_REQUEST_REJECTED`.

---

## 📅 7. Holiday Calendar Module
- [x] **Admin Holiday Controls**: Create, edit, activate, and deactivate office holidays. Generates audit logs.
- [x] **Dashboard Integration**: Displays next 4 scheduled closures in "Upcoming Holidays" widget.

---

## 📋 8. Task Tracking Module
- [x] **Status Workflows**: Transition task status (`TO_DO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `ON_HOLD`).
- [x] **Overdue Calculation (Edge Case)**: Tasks with `dueDate < now()` and `status != COMPLETED` flag `isOverdue: true`.
- [x] **Work Logs & Comments**: Submit working hours (`WorkLog`) and post comment threads (`TaskComment`).

---

## 📄 9. Employee Document Management Module
- [x] **Local Storage**: Uploads saved to `./public/uploads/documents/` on local disk.
- [x] **Admin Verification**: HR Admin toggles document verification (`isVerified: true/false`).
- [x] **Role Access Control**: Employees view own documents; Admins manage all staff documents.

---

## 📢 10. Company Announcement Module
- [x] **Targeted Broadcasts**: Target to `ALL`, specific `DEPARTMENT`, or specific `ROLE`.
- [x] **Mark as Read**: Employee clicks Mark as Read -> Records timestamped `announcement_reads` entry.
- [x] **Admin Read/Unread Report**: Inspects read vs unread roster per announcement.

---

## 💾 11. System Backup & Restore
- [x] **Super Admin Manual Backup**: One-click manual backup creates database dump and uploads archive in `/app/backups`.
- [x] **Backup History**: Lists archives with size, creation date, and status.
- [x] **Restricted Restore (Edge Case)**: Restore action strictly restricted to `SUPER_ADMIN`.
