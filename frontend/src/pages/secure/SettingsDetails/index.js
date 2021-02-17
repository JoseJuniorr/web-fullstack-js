import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Row, Col } from "react-bootstrap";

class SettingsDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dnsSettings: null,
      emailAddresses: [],
    };
  }

  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Minha Conta</h3>
                <p>
                  Para realizar o envio de mensagens pelo MailShrimp, você
                  precisa possuir um domínio associado a sua conta
                </p>
                <p>
                  Você precisa atualizar seus endereços DNS, adicionando as
                  novas entradas e informando um e-mail válido para ser o
                  remetente do envio.
                </p>
              </Col>
            </Row>
          </Container>
        </PageContent>
      </>
    );
  }
}

export default SettingsDetails;
