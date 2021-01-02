import React from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../../assets/mail-send.svg";
import AccountsService from "../../../services/accounts";

import { login } from "../../../services/auth";

import { BoxForm, BoxContent } from "../../../shared/styles";

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleSignIn = async (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Informe todos os campos para acessar!" });
    } else {
      try {
        const service = new AccountsService();

        const response = await service.login(email, password);

        login(response.data.token);
        this.props.history.push("/");
      } catch (error) {
        console.log(error);
        this.setState({
          error: "Ocorreu um erro durante a tentativa de login!",
        });
      }
    }
  };

  renderError = () => {
    const { error } = this.state;
    return <Alert variant="danger">{error}</Alert>;
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <BoxContent>
              <img src={Logo} alt="MailShrimp" width="120px" />

              <p className="lead">
                MailShrimp - Sua nova plataforma de E-mail Marketing
              </p>
            </BoxContent>
            <BoxForm>
              <h2>Login</h2>
              <p>Informe seus dados para se autenticar</p>
              <Form onSubmit={this.handleSignIn}>
                {this.state.error && this.renderError()}
                <Form.Group controlId="emailGroup">
                  <Form.Control
                    type="email"
                    placeholder="Seu E-mail"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="passwordGroup">
                  <Form.Control
                    type="password"
                    placeholder="Digite sua Senha"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </Form.Group>
                <Button block variant="secondary" type="submit">
                  Fazer Login
                </Button>
              </Form>
            </BoxForm>
            <BoxContent>
              <p>Novo na plataforma?</p>
              <Link className="button" to="/signup">
                Crie sua conta agora
              </Link>
            </BoxContent>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SignIn);
