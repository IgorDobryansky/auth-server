const ApiError = require('../exeptions/ApiError');
const TokenService = require('../service/TokenService');

module.exports = function (request, response, next) {
  try {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    request.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
