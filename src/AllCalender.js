import React, { useState, useEffect } from 'react';
import { getAllCalendar } from './GraphService';
import { useAppContext } from './AppContext';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import './App.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AllCalendars = () => {
  const app = useAppContext();
  const [calData, setCalData] = useState([]);
  const navigate = useNavigate();

  const loadCalendars = async () => {
    if (app.user && !calData.length) {
      try {
        const loadedCalendars = await getAllCalendar(app.authProvider);
        setCalData(loadedCalendars);
        
      } catch (err) {
        app.displayError(err.message);
      }
    }
  };

  useEffect(() => {
    loadCalendars();
  }, [app.user, app.authProvider]);
  
  const handleNextClick = (values) => {
    console.log(values.selected)
    localStorage.setItem('usersCalendar',JSON.stringify(values))
    navigate(`/calendar?selected=${formik.values.selected}`);
  };

  const validationSchema = Yup.object({
    selected: Yup.string().required('Please select a calendar'),
  });

  const formik = useFormik({
    initialValues: {
      selected: '',
    },
    validationSchema,
    onSubmit: handleNextClick,
  });

 
  return (
    <form onSubmit={formik.handleSubmit}>
      {calData.value?.map((calendar) => (
        <div className="myinput" key={calendar.id}>
          <label>
            <input
              type="radio"
              name="selected"
              value={calendar.id}
              checked={formik.values.selected === calendar.id}
              onChange={formik.handleChange}
              className="myinput"
            />
            {calendar.name}
          </label>
        </div>
      ))}
      {formik.errors.selected && (
        <div className="error">{formik.errors.selected}</div>
      )}
      <button type="submit" className="btn btn-dark btn-sm">
        Next
      </button>
    </form>
  );
};

export default AllCalendars;
