const UserService = require('../service/UserService');
const { validationResult } = require('express-validator');
const ApiError = require('../exeptions/ApiError');

class UserController {
  async registration(request, response, next) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array())
        );
      }
      const { email, password } = request.body;
      const userData = await UserService.registration(email, password);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(request, response, next) {
    try {
      const { email, password } = request.body;
      const userData = await UserService.login(email, password);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(request, response, next) {
    try {
      const { refreshToken } = request.cookies;
      const token = await UserService.logout(refreshToken);
      response.clearCookie('refreshToken');
      return response.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(request, response, next) {
    try {
      const activationLink = request.params.link;
      await UserService.activate(activationLink);
      return response.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(request, response, next) {
    try {
      const { refreshToken } = request.cookies;
      const userData = await UserService.refresh(refreshToken);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(request, response, next) {
    try {
      const users = await UserService.getAllUsers();
      return response.json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
