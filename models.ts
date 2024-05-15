export interface Company {
  name: string;
  description?: string;
  industry?: string;
  id: string;
  hasImage: boolean;
  companyContactInfos?: ContactInfo[];
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  resourceVersion: number;
  tags?: UserTag[];
  projectsCount: number;
  projectsInProgressCount: number;
}

interface TaskStatus {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  order?: number;
  icon?: string;
}

interface SmallProject {
  id: string;
  name?: string;
  projectStatus?: {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    isArchived: boolean;
  };
  company?: {
    id: string;
    name?: string;
    hasImage: boolean;
    description?: string;
  };
  projectType?: {
    id: string;
    name?: string;
    icon?: string;
    isArch: boolean;
  };
  isPrivate: boolean;
  hasImage: boolean;
}

interface Task {
  id: string;
  name?: string;
  baseType?: string;
  taskStatusId: string;
  typeOfWorkId: string;
  project?: SmallProject;
  projectId?: string;
  plannedDuration?: number;
  closedOn?: string;
  taskStatus?: TaskStatus;
  createdBy: string;
  correlationId: string;
  parentId?: string;
  parent?: {
    id: string;
    name?: string;
  };
}
export interface TimeEntry {
  isBillable: boolean;
  isBilled: boolean;
  taskId?: string;
  projectId?: string;
  note?: string;
  startDateUtc?: string;
  startTimeUtc?: string;
  endTimeUtc?: string;
  startDateLocal?: string;
  startTimeLocal?: string;
  endTimeLocal?: string;
  timezone: string;
  duration?: number;
  breakDuration?: number;
  typeOfWorkId: string;
  userId: string;
  id: string;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  typeOfWork: {
    id: string;
    name: string;
    icon: string;
    isArchived: boolean;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    hasImage: boolean;
  };
  task?: Task;
  project?: SmallProject;
  endDateUtc?: string;
  endDateLocal?: string;
  resourceVersion: number;
}

interface ProjectTag {
  id: string;
  name?: string;
  color?: string;
  entityId?: string;
}

interface ProjectType {
  id: string;
  name?: string;
  icon?: string;
  isArchived: boolean;
}

interface ProjectStatus {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  isArchived: boolean;
  typeOrder: number;
}

interface ProjectCompany {
  id: string;
  name?: string;
  hasImage: boolean;
  description?: string;
  tags?: UserTag[];
}

interface ProjectMember {
  id: string; // Assuming $uuid is a string type
  userId: string;
  firstName?: string;
  lastName?: string;
  hasImage?: boolean;
  projectRoleId: string;
  projectRoleName?: string;
  isResponsible: boolean;
  isDeactivated: boolean;
}

export interface ProjectTask {
  name: string;
  description?: string;
  isPrio: boolean;
  startOn?: string;
  dueOn?: string;
  laneOrder: number;
  plannedDuration: number;
  remainingDuration: number;
  id: string;
  isExternal: boolean;
  baseType: string;
  taskStatusId: string;
  taskStatus: TaskStatus;
  typeOfWorkId: string;
  typeOfWork: {
    id: string;
    name: string;
    icon: string;
    isArchived: boolean;
  };
  assignees: {
    id: string;
    firstName: string;
    lastName: string;
    hasImage: boolean;
    plannedEffort: number;
    isDistributedPlannedEffort: boolean;
    updatedOn: string;
    isExternal: boolean;
  }[];
  projectId: string;
  project: SmallProject;
  correlationId: string;
  parentId: string;
  parentTask: {
    id: string;
    name: string;
    userId: string;
    assigneeIds: string[];
  };
  isSubtask: boolean;
  numberOfSubtasks: number;
  hasAttachment: boolean;
  lists: {
    name: string;
    order: number;
    id: string;
    isArchived: boolean;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
    orderOfTask: number;
  }[];
  userId: string;
  tags: ProjectTag[];
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  closedOn: string;
  closedBy: string;
  order: number;
  subtaskOrder: number;
  createdFromTaskId: string;
  isRecurring: boolean;
  trackedDuration: number;
  totalTrackedDuration: number;
  totalPlannedDuration: number;
  totalRemainingDuration: number;
  resourceVersion: number;
  checklistItemsDoneCount: number;
  checklistItemsCount: number;
  taskSchedulesCount: number;
  isCompletelyScheduled: boolean;
  commentCount: number;
}

export interface Project {
  name: string;
  isPrivate: boolean;
  description?: string;
  startDate?: string;
  dueDate?: string;
  companyId?: string;
  timeBudget?: number;
  isBillableByDefault?: boolean;
  projectTypeId?: string;
  color?: string;
  projectStatusId?: string;
  projectTemplateId?: string;
  publicProjectTemplateId?: string;
  id: string;
  hasImage: boolean;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  closedOn?: string;
  closedBy?: string;
  createdByProjectTemplateId?: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  company: ProjectCompany;
  tags?: ProjectTag[];
  plannedDuration?: number;
  tasksCount?: number;
  tasksDoneCount?: number;
  members?: ProjectMember[];
  trackedDuration?: number;
  resourceVersion: number; // readOnly
  teams?: Team[];
}

interface ContactInfo {
  label?: string;
  value?: string;
  type: string;
  subType?: string;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  isAddress: boolean;
  id: string;
  isDeleted: boolean;
  createdOn: string;
  createdBy?: string;
  updatedOn: string;
  updatedBy?: string;
}

interface UserTag {
  id: string;
  name?: string;
  color?: string;
}

interface Team {
  id: string;
  name?: string;
  icon?: string;
  color?: string;
}

interface UserStatus {
  invitationAccepted: boolean;
  isDeactivated: boolean;
}

export interface User {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender: string;
  title?: string;
  position?: string;
  language?: string;
  id: string;
  status: UserStatus;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isArchived: boolean;
  isDeactivated: boolean;
  deactivatedOn?: string;
  hasImage: boolean;
  userContactInfos?: ContactInfo[];
  resourceVersion: number;
  tags?: UserTag[];
  teams?: Team[];
}
