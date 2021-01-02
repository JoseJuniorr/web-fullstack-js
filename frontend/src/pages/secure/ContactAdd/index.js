import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import ContactsService from "../../../services/contacts";
import { withRouter, Link } from "react-router-dom";

class ContactsAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      error: "",
      isLoading: false,
    };
  }

  handleSave = async (event) => {
    event.preventDefault();

    const { name, email, phone } = this.state;

    if (!name || !email || !phone) {
      this.setState({
        error: "Informe todos os campos para adicionar um contato",
      });
    } else {
      try {
        const service = new ContactsService();

        await service.add({ name, email, phone });

        this.props.history.push("/contacts");
      } catch (error) {
        this.setState({
          error: "Ocorreu um erro ao criar o contato",
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
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Adicionar Contato</h3>
                <p>Informe todos os campos para adicionar um contato</p>
              </Col>
            </Row>
            <Row>
              <Col lg={6} sm={12}>
                {this.state.error && this.renderError()}
                <Form onSubmit={this.handleSave}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Nome"
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="email"
                      placeholder="E-mail"
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Telefone"
                      onChange={(e) => this.setState({ phone: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Adicionar Contato
                  </Button>

                  <Link className="btn btn-link" to="/contacts">
                    Voltar
                  </Link>
                </Form>
              </Col>
            </Row>
          </Container>
        </PageContent>
      </>
    );
  }
}

export default withRouter(ContactsAdd);
