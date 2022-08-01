const dotenv = require("dotenv");
const axios = require("axios");
const {
  startOfMonth, endOfMonth, format
} = require('date-fns')

dotenv.config();

const apiKey = process.env.API_KEY;
const client = axios.create({
  baseURL: 'https://api.awork.io/api/v1',
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

async function iterateAPI(path, pageLimit = 100) {
  let page = 1;
  let hasNext = true;
  let tasks = [];
  while (hasNext) {
    const response = await client.get(
      `${path}page=${page}&pageSize=${pageLimit}`
    );

    tasks = [...tasks, ...response.data];
    // we can get pagination information from the headers
    const currentPage = response.headers["aw-page"];
    const totalItems = response.headers["aw-totalitems"];
    // the number of pages is the number of total items divided by the pageSize provided in the querystring plus 1
    hasNext = currentPage < totalItems / pageLimit + 1 && response.data.length;
    page++;
  }

  return tasks;
}

async function getClients() {
  return iterateAPI('/companies?')
}

async function getClient(clientId) {
  return iterateAPI(`/companies?filterby=id eq guid'${clientId}'&`)
}

async function getProjectsForClient(clientId) {
  return iterateAPI(`/projects?filterby=companyId eq guid'${clientId}'&`)
}

async function getProject(projectId) {
  return iterateAPI(`/projects?filterby=id eq guid'${projectId}'&`)
}

function formatDate(rawDate) {
  return format(rawDate, 'yyyy-MM-dd') + 'T' + format(rawDate, 'HH:mm:ss')
}

async function getHoursByProjectForMonthAndYear(project, month, year) {
  const baseDate = new Date(year, month, 1)
  const startDate = startOfMonth(baseDate)
  const endDate = endOfMonth(baseDate)
  return await getHoursByProjectForStartDateAndEndDate(startDate, endDate)
}

async function getHoursByProjectForStartDateAndEndDate(project, startDate, endDate) {
  return iterateAPI(`/timeentries?filterby=startDateUtc ge datetime'${formatDate(startDate)}' and startDateUtc le datetime'${formatDate(endDate)}' and (projectId eq guid'${project}') and (isBillable eq true and isBilled eq false)&`)
}

async function getHoursByProject(project) {
  return iterateAPI(`/timeentries?filterby=(projectId eq guid'${project}') and (isBillable eq true and isBilled eq false)&`)
}

async function getYear() {
  return iterateAPI('/timeentries?orderby=startDateLocal desc,startTimeLocal desc&filterby=startDateUtc ge datetime\'2022-01-01T00:00:00\' and startDateUtc lt datetime\'2022-12-31T23:59:59\'&grouping=user&', 1000)
}

async function getUser(id) {
  return client.get(`/users/${id}`).then(response => response.data);
}

async function getTask(id) {
  return client.get(`/tasks/${id}`).then(response => response.data);
}

module.exports = {
  getClients,
  getProjectsForClient,
  getHoursByProjectForMonthAndYear,
  getProject,
  getClient,
  getYear,
  getUser,
  getTask,
}
