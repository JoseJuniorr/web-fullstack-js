import { request } from "http";
import supertest from "supertest";
import app from ".././src/app";

describe("Testando rotas de autenticação", () => {
  it("POST /accounts/login - 200 OK", async () => {
    //mocking
    const newAccount = {
      id: 1,
      name: "Jose Junior",
      email: "jjerrorama@gmail.com",
      password: "123654",
      status: 100,
    };

    await supertest(app).post("/accounts/").send(newAccount);

    //testing
    const payload = {
      email: "jjerrorama@gmail.com",
      password: "123654",
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.auth).toBeTruthy();
    expect(resultado.body.token).toBeTruthy();
  });

  it("POST /accounts/login - 401 Unauthorized", async () => {
    const payload = {
      email: "jjerrorama@gmail.com",
      password: "abcabcas",
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(401);
  });

  it("POST /accounts/login - 422 Unprocessable Entity", async () => {
    const payload = {
      email: "jjerrorama",
      password: "abcabcas",
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("POST  /accounts/logout - 200 OK", async () => {
    const resultado = await supertest(app).post("/accounts/logout");

    expect(resultado.status).toEqual(200);
  });
});
