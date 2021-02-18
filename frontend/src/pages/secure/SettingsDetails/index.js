import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Row, Col, Table } from "react-bootstrap";
import SettingsService from "../../../services/settings";

class SettingsDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dnsSettings: null,
      emailAddresses: [],
    };
  }

  async componentDidMount() {
    const service = new SettingsService();
    const { DKIM, SPF, Domain, EmailAddresses } = await service.get();

    this.setState({
      isLoading: false,
      dnsSettings: {
        DKIM,
        SPF,
        Domain,
        EmailAddresses,
      },
    });
  }

  render() {
    const { isLoading, dnsSettings } = this.state;
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <Col>
                <h3>Minha Conta</h3>
              </Col>
            </Row>
            <p>
              Para realizar o envio de mensagens pelo MailShrimp, você precisa
              possuir um domínio associado a sua conta
            </p>
            <p>
              Você precisa atualizar seus endereços DNS, adicionando as novas
              entradas e informando um e-mail válido para ser o remetente do
              envio.
            </p>

            <h4>Configurações no DNS</h4>
            {isLoading && <p>Carregando...</p>}
            <h5>Entrada TXT</h5>
            <p>Crie um entrada TXT com a seguinte informação:</p>
            <Table bordered striped hover>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <RenderLoaderRow />}
                {!isLoading && <RenderLines records={dnsSettings.Domain} />}
              </tbody>
            </Table>

            <h5>DKIM</h5>
            <p>
              Adicione uma entrada DKIM no seu provedor com a seguinte
              informação:
            </p>
            <Table bordered striped hover>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <RenderLoaderRow />}
                {!isLoading && <RenderLines records={dnsSettings.DKIM} />}
              </tbody>
            </Table>

            <h5>SPF</h5>
            <p>
              Crie ou atualize a entrada SPF no seu DNS. Para configuração do
              MX, adicione prioridade informada:
            </p>
            <Table bordered striped hover>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <RenderLoaderRow />}
                {!isLoading && <RenderLines records={dnsSettings.SPF} />}
              </tbody>
            </Table>
          </Container>
        </PageContent>
      </>
    );
  }
}

function RenderLines({ records }) {
  return (
    <>
      {records.dnsRecords.length === 0 && (
        <RenderEmptyRow message="Nenhum DNS disponível para configuração." />
      )}
      {records.verified ? (
        <RenderVerifiedRow />
      ) : (
        records.dnsRecords.map((item, index) => (
          <tr key={index}>
            <td>{item.type}</td>
            <td>{item.name}</td>
            <td>
              {item.priority
                ? `${item.value} - Prioridade ${item.priority}`
                : item.value}
            </td>
          </tr>
        ))
      )}
    </>
  );
}

function RenderEmptyRow({ message }) {
  return (
    <>
      <tr>
        <td colSpan="3">{message}</td>
      </tr>
    </>
  );
}

function RenderVerifiedRow() {
  return (
    <tr>
      <td colSpan="3">Configuração realizada com sucesso.</td>
    </tr>
  );
}

function RenderLoaderRow() {
  return (
    <tr>
      <td colSpan="3">
        <Loader />
      </td>
    </tr>
  );
}

function Loader() {
  return <>Carregando...</>;
}

export default SettingsDetails;
