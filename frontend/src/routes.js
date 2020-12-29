import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";

function Contacts() {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Menu />
      <h1>Contatos</h1>

      <ul>
        <li>
          <Link to={`${url}/1`}>Contato A</Link>
        </li>
        <li>
          <Link to="/contacts">Contato B</Link>
        </li>
        <li>
          <Link to="/contacts">Contato C</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={path} />
        <Route exact path={`${path}/:contactId`}>
          <Contact />
        </Route>
      </Switch>
    </div>
  );
}

function Contact() {
  let { contactId } = useParams();
  return (
    <div>
      <h3>Contato: {contactId}</h3>
    </div>
  );
}

function Message() {
  let { messageId } = useParams();
  return (
    <div>
      <h3>Mensagem: {messageId}</h3>
    </div>
  );
}

function Messages() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <h1> Lista de Mensagens</h1>
      <ul>
        <li>
          <Link to={`${url}/1`}>Mensagem A</Link>
        </li>
        <li>
          <Link to="#">Mensagem B</Link>
        </li>
        <li>
          <Link to="#">Mensagem C</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={path} />
        <Route exact path={`${path}/:messageId`}>
          <Message />
        </Route>
      </Switch>
    </div>
  );
}

function Menu() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contacts">Contacts</Link>
        </li>
        <li>
          <Link to="/signin">Login</Link>
        </li>
        <li>
          <Link to="/signup">Cadastro</Link>
        </li>
        <li>
          <Link to="/messages">Mensagens</Link>
        </li>
      </ul>
    </div>
  );
}

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/contacts" exact component={Contacts} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/messages" exact component={Messages} />
      </Switch>
    </Router>
  );
}
