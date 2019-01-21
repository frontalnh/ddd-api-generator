const routePath = './src/server/interfaces/http';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRoute(component, domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);
  const content = `
  import { Route } from 'server/common/models/Route';
  import * as express from 'express';
  import { httpSuccessResponse } from '@utils/httpSender';
  import { ${upper}Repository } from '@domain/${domain}/${domain}.repository';
  import { FilterSchema } from '@common/validateSchemas/FilterSchema';
  import Joi from 'joi';
  import { ${upper} } from '@domain/${domain}/${domain}.model';

  export class ${upper}Route implements Route {
    private router: express.Router;
    constructor(private ${camel}Repository: ${upper}Repository) {
      this.${camel}Repository = ${camel}Repository;
      this.router = express.Router();
    }
    handle() {
      /**
       * @swagger
       * /${domain}s:
       *   post:
       *     description: ${upper} API
       *     tags:
       *       - ${upper}s
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: body
       *         name: body
       *         schema:
       *           $ref: '#/definitions/${upper}'
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           $ref: '#/definitions/${upper}'
       */
      this.router.post('', (...args) => this.create(...args));
      /**
       * @swagger
       * /${domain}s:
       *   get:
       *     description: ${upper} API
       *     tags:
       *       - ${upper}s
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: query
       *         name: where
       *         type: object
       *         description: Where clause explains about the constraints used in find data
       *       - in: query
       *         name: limit
       *         type: integer
       *         description: How many data do you want?
       *       - in: query
       *         name: offset
       *         type: integer
       *         description: Where to start find data
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           type: object
       *           properties:
       *             payload:
       *               type: array
       *               items:
       *                 $ref: '#/definitions/${upper}'
       */
      this.router.get('', (...args) => this.findAll(...args));
      /**
       * @swagger
       * /${domain}s/{id}:
       *   get:
       *     description: ${upper} API
       *     tags:
       *       - ${upper}s
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: path
       *         name: id
       *         type: number
       *         description: Single ${camel}
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           $ref: '#/definitions/${upper}'
       */
      this.router.get('/:id', (...args) => this.findById(...args));
      /**
       * @swagger
       * /${domain}s:
       *   put:
       *     description: Update ${camel}
       *     tags:
       *       - ${upper}s
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: body
       *         name: body
       *         schema:
       *           properties:
       *             data:
       *               $ref: '#/definitions/${upper}'
       *             option:
       *               type: object
       *               schema:
       *                 type: object
       *                 properties:
       *                   where:
       *                     type: string
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           $ref: '#/definitions/${upper}'
       */
      this.router.put('', (...args) => this.update(...args));
  
      /**
       * @swagger
       * /${domain}s:
       *   delete:
       *     description: Delete ${camel}
       *     tags:
       *       - ${upper}s
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: body
       *         name: body
       *         schema:
       *           $ref: '#/definitions/${upper}'
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           properties:
       *             count:
       *               type: integer
       */
      this.router.delete('', (...args) => this.remove(...args));
      return this.router;
    }
  
    private async create(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      try {        
        let ${camel} = new ${upper}(req.body)
        let created = await this.${camel}Repository.save(${camel});
        return res.send(created);
      } catch (err) {
        return next(err);
      }
    }
  
    // @authGuard
    private async findAll(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      try {
        let { value, error } = Joi.validate(req.query, FilterSchema, {
          convert: true
        });
  
        if (error) return next(error);
        
        let payload = await this.${camel}Repository.findAll(value);
        return httpSuccessResponse(res, {payload});
      } catch (err) {
        return next(err);
      }
    }
  
    private async findById(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      try {
        let id = req.params.id;
        let ${camel} = await this.${camel}Repository.findById(id);
  
        return res.send(${camel});
      } catch (err) {
        return next(err);
      }
    }
  
    private async update(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      try {
        let { data, option } = req.body;
        let [count, payload] = await this.${camel}Repository.update(data, option);
  
        return httpSuccessResponse(res, {payload, count});
      } catch (err) {
        return next(err);
      }
    }
  
    private async remove(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      try {
        let option = req.body;
        let count = await this.${camel}Repository.delete(option);
  
        return httpSuccessResponse(res, { count })
      } catch (err) {
        return next(err);
      }
    }
  }
  `;
  mkdirp.sync(`${routePath}`);
  fs.writeFileSync(`${routePath}/${domain}.route.ts`, content);

  return;
};
