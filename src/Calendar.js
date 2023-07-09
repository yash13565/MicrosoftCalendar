import { useEffect, useState,useMemo } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { findIana } from 'windows-iana';
import { AuthenticatedTemplate } from '@azure/msal-react';
import { add, format, getDay, parseISO } from 'date-fns';
import { endOfWeek, startOfWeek } from 'date-fns/esm';

import { getUserWeekCalendar } from './GraphService';
import { useAppContext } from './AppContext';
import Scheduler from 'devextreme-react/scheduler';

import './Calendar.css';
const views = ['month'];
export default function Calendar() {
  const app = useAppContext();

  const [events, setEvents] = useState([]);
  const currentDate = new Date();

  const loadEvents = async () => {
    if (app.user && events.length === 0) {
      try {
        const ianaTimeZones = findIana(app.user.timeZone);
        const loadedEvents = await getUserWeekCalendar(app.authProvider, ianaTimeZones[0].valueOf());
        setEvents(loadedEvents);
      } catch (err) {
        const error = err;
        app.displayError(error.message);
      }
    }
  };
  useEffect(() => {

    loadEvents();
  }, [app.user, events]);

  const renderData = useMemo(() => {
    // Filtering events here
    // const filteredEvents = events?.filter(event => event.calendarId === selectedCalendar);
    const myData = events?.map(event => ({
      'id': event.id,
      'text': event.subject,
      'startDate': event.start.dateTime,
      'endDate': event.end.dateTime,
    }));
    // console.log(myData.filter(e => e.id === selected),'5')
    return myData ;
  }, [events]);

  return (
    <AuthenticatedTemplate>
      <div className="mb-3">
        <RouterNavLink to="/newevent" className="btn btn-dark btn-sm">New event</RouterNavLink>
        <RouterNavLink to="/allcalendar" className="btn btn-light btn-sm">
          All Calendar List
        </RouterNavLink>
      </div>
      <div>
      <Scheduler
        dataSource={renderData}
        defaultCurrentDate={currentDate}
        timeZone="Asia/Kolkata"
        editing={false}
        views={views}
        defaultCurrentView="month"
        height={700}
      />
      </div>
    </AuthenticatedTemplate>
  );
}
