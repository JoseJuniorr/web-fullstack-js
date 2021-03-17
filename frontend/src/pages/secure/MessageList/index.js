import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Table, Row, Col, Badge } from "react-bootstrap";
import { Link, withRouter, useRouteMatch } from "react-router-dom";
import MessageService from "../../../services/messages";

function RenderMessageStatus({ status }) {
  let statusName = {};

  switch (status) {
    case 100:
      statusName = { title: "CRIADA", css: "primary" };
      break;
    case 150:
      statusName = { title: "AGENDADA", css: "warning" };
      break;
    case 200:
      statusName = { title: "ENVIADA", css: "success" };
      break;
    case 300:
      statusName = { title: "REMOVIDA", css: "danger" };
      break;

    default:
      statusName = { title: "INDEFINIDA", css: "light" };
      break;
  }

  return (
    <Badge pill variant={statusName.css}>
      {statusName.title}{" "}
    </Badge>
  );
}

function RenderEmptyRow({ mensagem }) {
  return (
    <tr>
      <td colSpan="2">{mensagem}</td>
    </tr>
  );
}

function RenderLine({ message }) {
  let { url } = useRouteMatch();
  return (
    <tr>
      <td>
        <Link to={`${url}/${message.id}`}>{message.subject}</Link>
      </td>
      <td>
        <RenderMessageStatus status={message.status} />
      </td>
    </tr>
  );
}

function RenderTable({ messages }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Assunto</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {messages.length === 0 && (
          <RenderEmptyRow mensagem="Nenhuma mensagem foi adicionada" />
        )}
        {messages.map((item) => (
          <RenderLine key={item.id} message={item} />
        ))}
      </tbody>
    </Table>
  );
}

function RenderButtonAdd() {
  let { url } = useRouteMatch();

  return (
    <Link className="btn btn-primary float-right " to={`${url}/add`}>
      Adicionar Mensagem
    </Link>
  );
}

class MessageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      messages: [],
    };
  }

  async componentDidMount() {
    const service = new MessageService();
    const result = await service.getAll();

    this.setState({ messages: result, isLoading: false });
  }

  render() {
    const { messages, isLoading } = this.state;
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Mensagens</h3>
              </Col>
              <Col>
                <RenderButtonAdd />
              </Col>
            </Row>
            <p>Lista de mensagens enviadas</p>
            {isLoading ? (
              <p>Carregando ...</p>
            ) : (
              <RenderTable messages={messages} />
            )}
          </Container>
        </PageContent>
      </>
    );
  }
}

export default withRouter(MessageList);
