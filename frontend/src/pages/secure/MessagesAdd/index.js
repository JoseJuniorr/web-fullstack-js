import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import MessageService from "../../../services/messages";
import SettingsService from "../../../services/settings";

class MessagesAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      subject: "",
      body: "",
      error: "",
      accountEmailId: "",
      emailsFrom: [],
    };
  }

  async componentDidMount() {
    const service = new SettingsService();

    this.setState({
      isLoading: true,
    });
    const result = await service.getAllAccountEmail();
    console.log(result);

    this.setState({
      isLoading: false,
      emailsFrom: result,
    });
  }

  handleSave = async (event) => {
    event.preventDefault();

    const { subject, body, accountEmailId } = this.state;

    if (!subject || !body || !accountEmailId) {
      this.setState({
        error: "Informe todos os campos para adicionar a mensagem",
      });
    } else {
      try {
        const service = new MessageService();
        await service.add({ subject, body, accountEmailId });

        this.props.history.push("/messages");
      } catch (error) {
        this.setState({
          error: "Ocorreu um erro durante a criação da mensagem",
        });
      }
    }
  };

  renderError = () => {
    return <Alert variant="danger">{this.state.error}</Alert>;
  };

  render() {
    const { isLoading, emailsFrom, accountEmailId } = this.state;
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Adicionar Mensagem</h3>
                <p>Informe todos os campos para adicionar uma mensagem</p>
              </Col>
            </Row>
            <Row>
              <Col lg={6} sm={12}>
                <Form onSubmit={this.handleSave}>
                  {this.state.error && this.renderError()}
                  <Form.Group>
                    <Form.Label>Assunto:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Informe o assunto da mensagem"
                      onChange={(e) =>
                        this.setState({ subject: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Remetente:</Form.Label>
                    <Form.Control
                      as="select"
                      disabled={isLoading}
                      value={!isLoading && accountEmailId}
                      onChange={(e) =>
                        this.setState({ accountEmailId: e.target.value })
                      }
                    >
                      <option key="0" value="">
                        Selecione
                      </option>
                      {!isLoading &&
                        emailsFrom.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.email}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Corpo da mensagem:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Digite aqui o conteúdo da  mensagem"
                      onChange={(e) => this.setState({ body: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Salvar mensagem
                  </Button>
                  <Link className="btn btn-light float-right" to="/messages">
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

export default withRouter(MessagesAdd);
