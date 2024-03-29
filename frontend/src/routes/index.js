import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SignInPage from "../pages/public/SignIn";
import SignUpPage from "../pages/public/SignUp";

import DashboardPage from "../pages/secure/Dashboard";

import ContactsListPage from "../pages/secure/ContactsList";
import ContactsAddPage from "../pages/secure/ContactAdd";
import ContactDetail from "../pages/secure/ContactDetail";
import RoutePrivate from "./route-wrapper";

import MessageListPage from "../pages/secure/MessageList";
import MessageAddPage from "../pages/secure/MessagesAdd";
import MessageDetailPage from "../pages/secure/MessageDetail";

import SettingsDetailPage from "../pages/secure/SettingsDetails";
import SettingsEmailAddPage from "../pages/secure/SettingsEmailAdd";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <RoutePrivate exact path="/" component={DashboardPage} />
        <RoutePrivate exact path="/contacts" component={ContactsListPage} />
        <RoutePrivate exact path="/contacts/add" component={ContactsAddPage} />
        <RoutePrivate
          exact
          path="/contacts/:contactId"
          component={ContactDetail}
        />
        <RoutePrivate exact path="/messages" component={MessageListPage} />
        <RoutePrivate exact path="/messages/add" component={MessageAddPage} />
        <RoutePrivate
          exact
          path="/messages/:messageId"
          component={MessageDetailPage}
        />
        <RoutePrivate exact path="/settings" component={SettingsDetailPage} />
        <RoutePrivate
          exact
          path="/settings/email/add"
          component={SettingsEmailAddPage}
        />
        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </Switch>
    </Router>
  );
}
