import React from "react";

import { Container, Navbar, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import { Header, Logo } from "./styles";
import Icone from "../../assets/mail-send.svg";

import { logout } from "../../services/auth";

function MainMenu({ history }) {
  async function handleLogout() {
    await logout();

    history.push("/");
  }

  return (
    <Header>
      <Navbar>
        <Container>
          <Navbar.Brand href="/">
            <Logo src={Icone} alt="MailShrimp" />
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/contacts">Contatos</Nav.Link>
            <Nav.Link href="/messages">Mensagens</Nav.Link>
            <Nav.Link href="/settings">Minha Conta</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </Header>
  );
}

export default withRouter(MainMenu);
