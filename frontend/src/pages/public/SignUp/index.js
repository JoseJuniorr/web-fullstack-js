import React from "react";
import AccountsService from "../../../services/accounts";

import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../../assets/mail-send.svg";
import { BoxContent, BoxForm } from "../../../shared/styles";

class SignUp extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    domain: "",
    error: "",
    isLoading: false,
  };

  handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password, domain} = this.state;

    if (!name || !email || !domain || !password) {
      this.setState({ error: "Informe todos os campos para se cadastrar!" });
    } else {
      try {
        const service = new AccountsService();

        await service.signup({ name, email, password, domain });
        this.props.history.push("/signin");
      } catch (error) {
        console.log(error);
        this.setState({ error: "Ocorreu um erro durante a criação da conta!" });
      }
    }
  };

  renderError = () => {
    return <Alert variant="danger">{this.state.error}</Alert>;
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
              <h2>Cadastro</h2>
              <p>Informe todos os campos para realizar o cadastro</p>
              <Form onSubmit={this.handleSignUp}>
                {this.state.error && this.renderError()}
                <Form.Group controlId="nomeGroup">
                  <Form.Control
                    type="text"
                    placeholder="Nome"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="emailGroup">
                  <Form.Control
                    type="email"
                    placeholder="E-mail"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="domainGroup">
                  <Form.Control
                    type="url"
                    placeholder="Informe o seu domínio"
                    onChange={(e) => this.setState({ domain: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="passwordGroup">
                  <Form.Control
                    type="password"
                    placeholder="Crie a sua senha"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </Form.Group>

                <Button block variant="primary" type="submit">
                  Realizar Cadastro
                </Button>
              </Form>
            </BoxForm>
            <BoxContent>
              <Link className="button" to="/signin">
                Voltar para o Login
              </Link>
            </BoxContent>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SignUp);
