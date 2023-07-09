// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <WelcomeSnippet>
import {
  Button,
  Container
} from 'react-bootstrap';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './AppContext';
import {NavLink as RouterNavLink } from 'react-router-dom'
import './App.css'

export default function Welcome() {
  const app = useAppContext();

  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <Container fluid>
        <h1>React Graph Tutorial</h1>
        <p className="lead">
          Welcome ms calendars api services.
        </p>
        <AuthenticatedTemplate>
        <div className='parent'>                                                                                                             
            <h4>Welcome {app.user?.displayName || ''}!</h4>
            <Button variant="dark"   onClick={app.signOut}>Sign out</Button>
            <RouterNavLink to="/calendar" className="nav-link">
            <Button variant="info">Calendar</Button>
                </RouterNavLink>
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Button color="primary" onClick={app.signIn}>Sign in</Button>
        </UnauthenticatedTemplate>
      </Container>
    </div>
  );
}
// </WelcomeSnippet>
