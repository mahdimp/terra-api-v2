const request = require("supertest");
const app = require("./app");

describe("get /wallet/balance", () => {
  it("should return balance", () => {
    return request(app)
      .get("/wallet/balance/terra186dzh7z2e2cphxvgt3vr7a7lmhl0un8rl8dyv8")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            balance: expect.any(String),
          })
        );
      });
  });
});
