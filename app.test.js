const request = require('supertest');
const app = require('./app');

describe('get /wallet/balance', () => {
  it('should return balance', () => request(app)
    .get('/wallet/balance/terra186dzh7z2e2cphxvgt3vr7a7lmhl0un8rl8dyv8')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          balance: expect.any(String),
        }),
      );
    }));
});

describe('get /wallet/new', () => {
  it('should has a mneumonic', () => request(app)
    .get('/wallet/new')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          mnemonic: expect.any(String),
        }),
      );
    }));

  it('should has a accountAddress', () => request(app)
    .get('/wallet/new')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          accountAddress: expect.any(String),
        }),
      );
    }));
});

describe('get /transactions/in/:address', () => {
  it('should return transactions', () => request(app)
    .get('/transactions/in/terra13zrr0axd0ef347zqeksrfpagsq0yf358r6mexr')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          transactions: expect.any(Object),
        }),
      );
    }));
});
