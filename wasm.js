
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  level: 'level',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  key: 'key',
  description: 'description',
  module: 'module',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  passwordHash: 'passwordHash',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  failedLoginAttempts: 'failedLoginAttempts',
  lockedUntil: 'lockedUntil',
  roleId: 'roleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  userAgent: 'userAgent',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt',
  lastActivityAt: 'lastActivityAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoginAttemptScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  success: 'success',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  reason: 'reason',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.DesignationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  isActive: 'isActive',
  departmentId: 'departmentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  employeeCode: 'employeeCode',
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  email: 'email',
  personalEmail: 'personalEmail',
  phone: 'phone',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  maritalStatus: 'maritalStatus',
  addressLine: 'addressLine',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  employmentType: 'employmentType',
  dateOfJoining: 'dateOfJoining',
  isActive: 'isActive',
  assignedDeviceName: 'assignedDeviceName',
  currentGrossSalary: 'currentGrossSalary',
  netTakeHome: 'netTakeHome',
  lastHikeDate: 'lastHikeDate',
  hikePercentage: 'hikePercentage',
  revisedGrossSalary: 'revisedGrossSalary',
  effectiveDate: 'effectiveDate',
  bankAccountNumber: 'bankAccountNumber',
  bankIfscCode: 'bankIfscCode',
  departmentId: 'departmentId',
  designationId: 'designationId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.EmergencyContactScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  name: 'name',
  relationship: 'relationship',
  phone: 'phone',
  email: 'email',
  addressLine: 'addressLine',
  isPrimary: 'isPrimary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  date: 'date',
  checkIn: 'checkIn',
  checkOut: 'checkOut',
  lunchBreakStart: 'lunchBreakStart',
  lunchBreakEnd: 'lunchBreakEnd',
  teaBreakStart: 'teaBreakStart',
  teaBreakEnd: 'teaBreakEnd',
  reCheckInStatus: 'reCheckInStatus',
  reCheckInReason: 'reCheckInReason',
  totalMinutes: 'totalMinutes',
  status: 'status',
  lateMinutes: 'lateMinutes',
  overtimeMinutes: 'overtimeMinutes',
  ipAddress: 'ipAddress',
  deviceId: 'deviceId',
  remarks: 'remarks',
  createdById: 'createdById',
  updatedById: 'updatedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AttendanceCorrectionScalarFieldEnum = {
  id: 'id',
  attendanceId: 'attendanceId',
  employeeId: 'employeeId',
  requestedCheckIn: 'requestedCheckIn',
  requestedCheckOut: 'requestedCheckOut',
  requestedStatus: 'requestedStatus',
  reason: 'reason',
  remarks: 'remarks',
  status: 'status',
  requestedById: 'requestedById',
  reviewedById: 'reviewedById',
  reviewedAt: 'reviewedAt',
  reviewComment: 'reviewComment',
  createdById: 'createdById',
  updatedById: 'updatedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttendanceSettingsScalarFieldEnum = {
  id: 'id',
  officeStartTime: 'officeStartTime',
  officeEndTime: 'officeEndTime',
  graceMinutes: 'graceMinutes',
  fullDayMinutes: 'fullDayMinutes',
  halfDayMinutes: 'halfDayMinutes',
  overtimeEnabled: 'overtimeEnabled',
  overtimeThresholdMinutes: 'overtimeThresholdMinutes',
  overtimeDailyCapMinutes: 'overtimeDailyCapMinutes',
  overtimeRate: 'overtimeRate',
  workingDays: 'workingDays',
  timezone: 'timezone',
  createdById: 'createdById',
  updatedById: 'updatedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeaveTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  annualQuota: 'annualQuota',
  isPaid: 'isPaid',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.LeaveBalanceScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  leaveTypeId: 'leaveTypeId',
  year: 'year',
  allocated: 'allocated',
  used: 'used',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeaveRequestScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  leaveTypeId: 'leaveTypeId',
  fromDate: 'fromDate',
  toDate: 'toDate',
  isHalfDay: 'isHalfDay',
  halfDayPeriod: 'halfDayPeriod',
  reason: 'reason',
  status: 'status',
  approvedById: 'approvedById',
  approvedAt: 'approvedAt',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HolidayScalarFieldEnum = {
  id: 'id',
  name: 'name',
  date: 'date',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  assigneeId: 'assigneeId',
  assignedById: 'assignedById',
  givenDate: 'givenDate',
  dueDate: 'dueDate',
  status: 'status',
  priority: 'priority',
  recurringInterval: 'recurringInterval',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskCommentScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  authorId: 'authorId',
  body: 'body',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskFileScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  uploadedById: 'uploadedById',
  fileName: 'fileName',
  storedName: 'storedName',
  mimeType: 'mimeType',
  sizeBytes: 'sizeBytes',
  createdAt: 'createdAt'
};

exports.Prisma.TaskAssigneeScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  employeeId: 'employeeId',
  createdAt: 'createdAt'
};

exports.Prisma.TaskLinkScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  label: 'label',
  url: 'url',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.WorkLogScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  employeeId: 'employeeId',
  logDate: 'logDate',
  hours: 'hours',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  body: 'body',
  isActive: 'isActive',
  publishedAt: 'publishedAt',
  expiresAt: 'expiresAt',
  audience: 'audience',
  departmentId: 'departmentId',
  roleId: 'roleId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnnouncementReadScalarFieldEnum = {
  id: 'id',
  announcementId: 'announcementId',
  userId: 'userId',
  readAt: 'readAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  title: 'title',
  category: 'category',
  description: 'description',
  fileName: 'fileName',
  storedName: 'storedName',
  mimeType: 'mimeType',
  sizeBytes: 'sizeBytes',
  source: 'source',
  verificationStatus: 'verificationStatus',
  verifiedAt: 'verifiedAt',
  verifiedById: 'verifiedById',
  rejectionReason: 'rejectionReason',
  isRequest: 'isRequest',
  requestedAt: 'requestedAt',
  requestedById: 'requestedById',
  visibility: 'visibility',
  uploadedById: 'uploadedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentRoleAccessScalarFieldEnum = {
  id: 'id',
  documentId: 'documentId',
  roleId: 'roleId',
  createdAt: 'createdAt'
};

exports.Prisma.PayrollRunScalarFieldEnum = {
  id: 'id',
  month: 'month',
  status: 'status',
  employeeCount: 'employeeCount',
  notes: 'notes',
  processedAt: 'processedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuthorizedDeviceScalarFieldEnum = {
  id: 'id',
  deviceIdentifier: 'deviceIdentifier',
  name: 'name',
  userAgent: 'userAgent',
  isActive: 'isActive',
  lastSeenAt: 'lastSeenAt',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AuthorizedIpScalarFieldEnum = {
  id: 'id',
  ipAddress: 'ipAddress',
  label: 'label',
  isActive: 'isActive',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BackupHistoryScalarFieldEnum = {
  id: 'id',
  operation: 'operation',
  type: 'type',
  status: 'status',
  fileName: 'fileName',
  filePath: 'filePath',
  sizeBytes: 'sizeBytes',
  databaseIncluded: 'databaseIncluded',
  filesIncluded: 'filesIncluded',
  errorMessage: 'errorMessage',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  sourceBackupId: 'sourceBackupId',
  triggeredById: 'triggeredById',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  description: 'description',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Gender = exports.$Enums.Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
  UNDISCLOSED: 'UNDISCLOSED'
};

exports.MaritalStatus = exports.$Enums.MaritalStatus = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED'
};

exports.EmploymentType = exports.$Enums.EmploymentType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERN: 'INTERN'
};

exports.ReCheckInStatus = exports.$Enums.ReCheckInStatus = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  HALF_DAY: 'HALF_DAY',
  ON_LEAVE: 'ON_LEAVE',
  HOLIDAY: 'HOLIDAY',
  WEEKEND: 'WEEKEND'
};

exports.CorrectionStatus = exports.$Enums.CorrectionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.HalfDayPeriod = exports.$Enums.HalfDayPeriod = {
  FIRST_HALF: 'FIRST_HALF',
  SECOND_HALF: 'SECOND_HALF'
};

exports.LeaveRequestStatus = exports.$Enums.LeaveRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.AnnouncementAudience = exports.$Enums.AnnouncementAudience = {
  ALL: 'ALL',
  DEPARTMENT: 'DEPARTMENT',
  ROLE: 'ROLE'
};

exports.DocumentSource = exports.$Enums.DocumentSource = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
};

exports.DocumentVerificationStatus = exports.$Enums.DocumentVerificationStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

exports.DocumentVisibility = exports.$Enums.DocumentVisibility = {
  EMPLOYEE: 'EMPLOYEE',
  ADMIN_ONLY: 'ADMIN_ONLY',
  ROLE_RESTRICTED: 'ROLE_RESTRICTED'
};

exports.PayrollRunStatus = exports.$Enums.PayrollRunStatus = {
  DRAFT: 'DRAFT',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  PAID: 'PAID'
};

exports.BackupOperation = exports.$Enums.BackupOperation = {
  BACKUP: 'BACKUP',
  RESTORE: 'RESTORE'
};

exports.BackupType = exports.$Enums.BackupType = {
  MANUAL: 'MANUAL',
  SCHEDULED: 'SCHEDULED'
};

exports.BackupStatus = exports.$Enums.BackupStatus = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  Role: 'Role',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  User: 'User',
  Session: 'Session',
  LoginAttempt: 'LoginAttempt',
  Department: 'Department',
  Designation: 'Designation',
  Employee: 'Employee',
  EmergencyContact: 'EmergencyContact',
  Attendance: 'Attendance',
  AttendanceCorrection: 'AttendanceCorrection',
  AttendanceSettings: 'AttendanceSettings',
  LeaveType: 'LeaveType',
  LeaveBalance: 'LeaveBalance',
  LeaveRequest: 'LeaveRequest',
  Holiday: 'Holiday',
  Task: 'Task',
  TaskComment: 'TaskComment',
  TaskFile: 'TaskFile',
  TaskAssignee: 'TaskAssignee',
  TaskLink: 'TaskLink',
  WorkLog: 'WorkLog',
  Announcement: 'Announcement',
  AnnouncementRead: 'AnnouncementRead',
  Document: 'Document',
  DocumentRoleAccess: 'DocumentRoleAccess',
  PayrollRun: 'PayrollRun',
  Setting: 'Setting',
  AuthorizedDevice: 'AuthorizedDevice',
  AuthorizedIp: 'AuthorizedIp',
  BackupHistory: 'BackupHistory',
  AuditLog: 'AuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
