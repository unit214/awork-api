import { endOfMonth, format, startOfMonth } from 'date-fns';
import {
  Company,
  Project,
  ProjectTask,
  TimeEntry,
  TimeEntryRequest,
  TimeEntryResponse,
  User,
} from './models';

//  API CALLS
export class AworkAPI {
  readonly #apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('No Awork API Key provided');
    this.#apiKey = apiKey;
  }

  // UTILS
  async #fetchAwork(path: string): Promise<Response> {
    const url = `https://api.awork.com/api/v1${path}`;
    return fetch(url, {
      method: 'GET', // GET is the default method, but including for clarity
      headers: new Headers({
        Authorization: `Bearer ${this.#apiKey}`,
      }),
    });
  }

  async #postAwork<T>(path: string, body: T): Promise<Response> {
    const url = `https://api.awork.com/api/v1${path}`;
    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${this.#apiKey}`,
        ContentType: 'application/json',
      }),
      body: JSON.stringify(body),
    });
  }

  async #iterateAPI<T>(path: string, pageLimit: number = 100): Promise<T[]> {
    let page = 1;
    let hasNext = true;
    let tasks: T[] = [];
    while (hasNext) {
      const response = await this.#fetchAwork(
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

  #formatDate(rawDate: Date): string {
    return format(rawDate, 'yyyy-MM-dd') + 'T' + format(rawDate, 'HH:mm:ss');
  }

  // API Calls
  async getClients(): Promise<Company[]> {
    return this.#iterateAPI('/companies?');
  }

  async getClient(clientId: string): Promise<Company[]> {
    return this.#iterateAPI(`/companies?filterby=id eq guid'${clientId}'&`);
  }

  async getProjectsForClient(clientId: string): Promise<Project[]> {
    return this.#iterateAPI(
      `/projects?filterby=companyId eq guid'${clientId}'&`,
    );
  }

  async getProject(projectId: string): Promise<Project[]> {
    return this.#iterateAPI(`/projects?filterby=id eq guid'${projectId}'&`);
  }

  async getHoursByProjectForMonthAndYear(
    project: string,
    month: number,
    year: number,
  ): Promise<TimeEntry[]> {
    const baseDate = new Date(year, month, 1);
    const startDate = startOfMonth(baseDate);
    const endDate = endOfMonth(baseDate);
    return this.getHoursByProjectForStartDateAndEndDate(
      project,
      startDate,
      endDate,
    );
  }

  async getHoursByProjectForStartDateAndEndDate(
    projectId: string,
    startDate: Date,
    endDate: Date,
    billableAndBilled: boolean = false,
  ): Promise<TimeEntry[]> {
    const billable = billableAndBilled
      ? 'isBillable eq true or isBilled eq true'
      : 'isBillable eq true and isBilled eq false';
    return this.#iterateAPI(
      `/timeentries?filterby=startDateUtc ge datetime'${this.#formatDate(startDate)}' and startDateUtc le datetime'${this.#formatDate(endDate)}' and (projectId eq guid'${projectId}') and (${billable})&`,
    );
  }

  async getHoursByProject(project: string): Promise<TimeEntry[]> {
    return this.#iterateAPI(
      `/timeentries?filterby=(projectId eq guid'${project}') and (isBillable eq true and isBilled eq false)&`,
    );
  }

  async getYear(): Promise<TimeEntry[]> {
    return this.#iterateAPI(
      "/timeentries?orderby=startDateLocal desc,startTimeLocal desc&filterby=startDateUtc ge datetime'2022-01-01T00:00:00' and startDateUtc lt datetime'2022-12-31T23:59:59'&grouping=user&",
      1000,
    );
  }

  async getAllTrackings(): Promise<TimeEntry[]> {
    return this.#iterateAPI(
      '/timeentries?orderby=startDateLocal desc,startTimeLocal desc&grouping=user&',
      1000,
    );
  }

  async getUser(id: string): Promise<User[]> {
    return this.#fetchAwork(`/users/${id}`).then((response) => response.json());
  }

  async getTask(id: string): Promise<User[]> {
    return this.#fetchAwork(`/tasks/${id}`).then((response) => response.json());
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return this.#iterateAPI(`/projects/${projectId}/projecttasks?`);
  }

  async createTimeEntry(
    timeEntry: TimeEntryRequest,
  ): Promise<TimeEntryResponse> {
    return this.#postAwork<TimeEntryRequest>('/timeentries', timeEntry).then(
      (response) => response.json(),
    );
  }
}
