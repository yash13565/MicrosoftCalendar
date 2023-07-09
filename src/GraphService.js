import { Client, PageIterator } from '@microsoft/microsoft-graph-client';
import { endOfYear, startOfYear } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

let graphClient = undefined;

function ensureClient(authProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider
    });
  }

  return graphClient;
}

export async function getUser(authProvider) {
  ensureClient(authProvider);

  const user = await graphClient.api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}

export async function getUserWeekCalendar(authProvider, timeZone) {
  ensureClient(authProvider);

  const now = new Date();
  const startDateTime = zonedTimeToUtc(startOfYear(now), timeZone).toISOString();
  const endDateTime = zonedTimeToUtc(endOfYear(now), timeZone).toISOString();

  const response = await graphClient.api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {
    var events = [];

    var options = {
      headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
    };

    var pageIterator = new PageIterator(graphClient, response, (event) => {
      events.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return events;
  } else {
    return response.value;
  }
}
export async function getAllCalendar(authProvider) {
  ensureClient(authProvider);
 
  const getCal = await graphClient.api(`/me/calendars`).get()
  return getCal;
}
export async function createEvent(authProvider, newEvent) {
  ensureClient(authProvider);

  return await graphClient.api('/me/events').post(newEvent);
}
