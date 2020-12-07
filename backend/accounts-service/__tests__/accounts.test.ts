import { Response } from "express";
import supertest from "supertest";
import app from "./../src/app";

describe("testando rotas do accounts-service", () => {
  it("GET /accounts/ - Retorna statusCode 200", async () => {
    const resultado = await supertest(app).get("/accounts/");

    expect(resultado.status).toEqual(200);

    expect(Array.isArray(resultado.body)).toBeTruthy;
  });

  it("POST /accounts/ - Deve retornar status 201", async () => {
    const payload = {
      id: 1,
      name: "Junior",
      email: "jjerrorama@gmail.com",
      password: "123654654",
      status: 200,
    };

    const resultado = await supertest(app).post("/accounts/").send(payload);

    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBe(1);
  });

  it("POST /accounts/ - Deve retornar statusCode 422", async () => {
    const payload = {
      sa: 1,
      street: "Av perimetral",
      cidade: "campo mourão",
    };

    const resultado = await supertest(app).post("/accounts/").send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("PATCH /accounts/:id - Deve retornar statusCode 200", async () => {
    const payload = {
      
      name: "Jose Junior",
      email: "jjerrorama2@gmail.com",
      password: "123654",
    };

    const resultado = await supertest(app).patch("/accounts/1").send(payload);

    expect(resultado.status).toEqual(200);
    // expect(resultado.body.id).toEqual(1);
  });

  it("PATCH /accounts:id/ - Deve retornar statusCode 400", async () => {
    const payload = {
      name: "Jose Junior",
      email: "jjerrorama@gmail.com",
      password: "123654654@",
    };

    const resultado = await supertest(app).patch("/accounts/abc").send(payload);

    expect(resultado.status).toEqual(400);
  });

  it("PATCH /accounts:id/ - Deve retornar statusCode 404", async () => {
    const payload = {
      name: "Jose Junior",
      email: "jjerrorama@gmail.com",
      password: "123654654@",
    };

    const resultado = await supertest(app).patch("/accounts/-1").send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("GET /accounts/:id - Deve retornar statusCode 200", async () => {
    const resultado = await supertest(app).get("/accounts/1");

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toBe(1);
  });

  it("GET /accounts/:id - Deve retornar statusCode 404", async () => {
    const resultado = await supertest(app).get("/accounts/2");

    expect(resultado.status).toEqual(404);
  });

  it("GET /accounts/:id - Deve retornar statusCode 400", async () => {
    const resultado = await supertest(app).get("/accounts/abc");

    expect(resultado.status).toEqual(400);
  });
});
