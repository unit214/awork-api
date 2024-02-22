import 'dotenv/config';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Company, Project, TimeEntry, User } from './models';

const apiKey = process.env.API_KEY;

async function fetchAwork(path: string): Promise<Response> {
  const url = `https://api.awork.com/api/v1${path}`;
  return fetch(url, {
    method: 'GET', // GET is the default method, but including for clarity
    headers: new Headers({
      Authorization: `Bearer ${apiKey}`,
    }),
  });
}

// UTILS
async function iterateAPI<T>(
  path: string,
  pageLimit: number = 100,
): Promise<T[]> {
  let page = 1;
  let hasNext = true;
  let tasks: T[] = [];
  while (hasNext) {
    const response = await fetchAwork(
      `${path}page=${page}&pageSize=${pageLimit}`,
    );
    const data = (await response.json()) as T[];

    tasks = [...tasks, ...data];
    // we can get pagination information from the headers
    const currentPage = parseInt(response.headers.get('aw-page'));
    const totalItems = parseInt(response.headers.get('aw-totalitems'));
    // the number of pages is the number of total items divided by the pageSize provided in the querystring plus 1
    hasNext = currentPage < totalItems / pageLimit + 1 && !!data.length;
    page++;
  }

  return tasks;
}

function formatDate(rawDate: Date): string {
  return format(rawDate, 'yyyy-MM-dd') + 'T' + format(rawDate, 'HH:mm:ss');
}

//  API CALLS

export async function getClients(): Promise<Company[]> {
  return iterateAPI('/companies?');
}

export async function getClient(clientId: string): Promise<Company[]> {
  return iterateAPI(`/companies?filterby=id eq guid'${clientId}'&`);
}

export async function getProjectsForClient(
  clientId: string,
): Promise<Project[]> {
  return iterateAPI(`/projects?filterby=companyId eq guid'${clientId}'&`);
}

export async function getProject(projectId: string): Promise<Project[]> {
  return iterateAPI(`/projects?filterby=id eq guid'${projectId}'&`);
}
export async function getHoursByProjectForMonthAndYear(
  project: string,
  month: number,
  year: number,
): Promise<TimeEntry[]> {
  const baseDate = new Date(year, month, 1);
  const startDate = startOfMonth(baseDate);
  const endDate = endOfMonth(baseDate);
  return getHoursByProjectForStartDateAndEndDate(project, startDate, endDate);
}

export async function getHoursByProjectForStartDateAndEndDate(
  projectId: string,
  startDate: Date,
  endDate: Date,
  billableAndBilled: boolean = false,
): Promise<TimeEntry[]> {
  const billable = billableAndBilled
    ? 'isBillable eq true or isBilled eq true'
    : 'isBillable eq true and isBilled eq false';
  return iterateAPI(
    `/timeentries?filterby=startDateUtc ge datetime'${formatDate(startDate)}' and startDateUtc le datetime'${formatDate(endDate)}' and (projectId eq guid'${projectId}') and (${billable})&`,
  );
}

export async function getHoursByProject(project: string): Promise<TimeEntry[]> {
  return iterateAPI(
    `/timeentries?filterby=(projectId eq guid'${project}') and (isBillable eq true and isBilled eq false)&`,
  );
}

export async function getYear(): Promise<TimeEntry[]> {
  return iterateAPI(
    "/timeentries?orderby=startDateLocal desc,startTimeLocal desc&filterby=startDateUtc ge datetime'2022-01-01T00:00:00' and startDateUtc lt datetime'2022-12-31T23:59:59'&grouping=user&",
    1000,
  );
}

export async function getAllTrackings(): Promise<TimeEntry[]> {
  return iterateAPI(
    '/timeentries?orderby=startDateLocal desc,startTimeLocal desc&grouping=user&',
    1000,
  );
}

export async function getUser(id: string): Promise<User[]> {
  return fetchAwork(`/users/${id}`).then((response) => response.json());
}

export async function getTask(id: string): Promise<User[]> {
  return fetchAwork(`/tasks/${id}`).then((response) => response.json());
}
