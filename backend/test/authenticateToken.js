import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;

describe("authenticateToken Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      query: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  it("should return 403 if no token is provided", () => {
    authenticateToken(req, res, next);
    expect(res.status.calledOnceWith(403)).to.be.true;
    expect(res.json.calledOnceWith({ msg: "Token not provided" })).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 403 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid_token";

    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    authenticateToken(req, res, next);

    expect(res.status.calledOnceWith(403)).to.be.true;
    expect(res.json.calledOnceWith({ msg: "Invalid token" })).to.be.true;
    expect(next.called).to.be.false;

    jwt.verify.restore();
  });

  it("should call next if token is valid", () => {
    const decodedToken = { userId: "12345" };
    req.headers.authorization = `Bearer valid_token`;

    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      callback(null, decodedToken);
    });

    authenticateToken(req, res, next);

    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal(decodedToken);

    jwt.verify.restore();
  });
});
