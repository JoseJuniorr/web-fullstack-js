import React from "react";
import Header from "../../../shared/header";
import SettingsService from "../../../services/settings";
import { PageContent } from "../../../shared/styles";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

class SetingsEmailAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      name: "",
      email: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { name, email } = this.state;

    const service = new SettingsService();
    await service.addAccountEmail({ name, email });

    this.setState({ isLoading: true });

    this.props.history.push("/settings");
  }

  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <h4>Adicionar remetente</h4>
            <p>Informe o nome e e-mail do remetente de envio.</p>
            <p>Após isso você receberá um e-mail de confirmação da AWS.</p>
            <Row>
              <Col lg={6} sm={12}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Informe o nome"
                    className="mb-2"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Informe o e-mail"
                    className="mb-4"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />

                  <Button type="submit" variant="primary">
                    Salvar
                  </Button>
                  <Link className="btn btn-default float-right" to="/settings">
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

export default SetingsEmailAdd;
