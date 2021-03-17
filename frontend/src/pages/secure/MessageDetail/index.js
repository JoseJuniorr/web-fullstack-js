import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Badge, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import MessageService from "../../../services/messages";
import SettingsService from "../../../services/settings";

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

function RenderMessage({ message }) {
  return (
    <>
      <h2>Detalhes da mensagem</h2>
      <p>
        <b>Status:</b>
        <br />
        <RenderMessageStatus status={message.status} />
      </p>
      <p>
        <b>Assunto:</b>
        <br />
        {message.subject}
      </p>
      <p>
        <b>E-mail do remetente:</b>
        <br />
        {message.fromName} ({message.fromEmail})
      </p>
      <p>
        <b>Conteúdo:</b>
        <br />
        {message.body}
      </p>
    </>
  );
}

class MessageDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSending: false,
      message: null,
    };
  }

  async componentDidMount() {
    const {
      params: { messageId },
    } = this.props.match;

    const messageService = new MessageService();

    const settingsService = new SettingsService();

    const message = await messageService.getOne(messageId);
    const {
      name: fromName,
      email: fromEmail,
    } = await settingsService.getOneAccountEmail(message.accountEmailId);

    this.setState({
      message: { ...message, fromName, fromEmail },
      isLoading: false,
    });
  }

  handleSendMessage = async (messageId) => {
    this.setState({
      isSending: true,
    });

    const service = new MessageService();
    await service.send(messageId);

    this.setState({ isSending: false });

    this.props.history.push("messages");
  };

  render() {
    const { message, isLoading, isSending } = this.state;
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            {isLoading ? (
              <p>Carregando ...</p>
            ) : (
              <>
                <RenderMessage message={message} />
                <Button
                  disabled={isSending}
                  variant="primary"
                  onClick={() => {
                    this.handleSendMessage(message.id);
                  }}
                >
                  {isSending ? "Enviando ..." : "Enviar Mensagem"}
                </Button>
              </>
            )}
          </Container>
        </PageContent>
      </>
    );
  }
}

export default withRouter(MessageDetail);
