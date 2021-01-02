import React from "react";
import { PageContent } from "../../../shared/styles";
import { Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import MainMenu from "../../../shared/header";

class Dashboard extends React.Component {
  render() {
    return (
      <>
        <MainMenu />
        <PageContent>
          <Container>
            <h2>Dashboard</h2>
            <p>
              Aqui podemos listar os últimos envios, contatos adicionados ou
              estatíticas
            </p>
          </Container>
        </PageContent>
      </>
    );
  }
}

export default withRouter(Dashboard);
