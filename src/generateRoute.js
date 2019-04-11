const routePath = './src/interfaces/http';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRoute(component, domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);
  const content = `
  import { FindResult } from '@common/models/FindResult';
  import { IFilter } from '@common/models/QueryOption';
  import { Route } from '@common/models/Route';
  import { FilterSchema } from '@common/validateSchemas/FilterSchema';
  import { ${upper} } from '@domain/${domain}/${domain}.model';
  import { authGuard } from '@infra/guard/auth.guard';
  import { I${upper}Repository } from '@domain/${domain}/${domain}.repository';
  import { httpSuccessResponse } from '@utils/httpSender';
  import * as express from 'express';
  import Joi from 'joi';

  export class ${upper}Route implements Route {
    private router: express.Router;
    constructor(private ${camel}Repository: I${upper}Repository) {

      this.router = express.Router();
    }
    handle() {
      /**
       * @swagger
       * /${domain}s:
       *   post:
       *     description: ${upper} API
       *     summary: ${upper} API
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
       *     summary: ${upper} API
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
       *     summary: ${upper} API
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
       *     description: where 절에 어떤 프로퍼티가 어떤 값을 가진 데이터를 수정할지 명시한다.
       *     summary: where 절에 어떤 프로퍼티가 어떤 값을 가진 데이터를 수정할지 명시한다.
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
       *             where:
       *               $ref: '#/definitions/${upper}'
       *     responses:
       *       200:
       *         description: Success
       *         schema:
       *           properties:
       *             count:
       *               type: integer
       */
      this.router.put('', (...args) => this.update(...args));
  
      /**
       * @swagger
       * /${domain}s:
       *   delete:
       *     description: Delete ${camel}
       *     summary: Delete ${camel}
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
  
    @authGuard
    private async findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
      try {
        let { value, error }: { value: IFilter<${upper}>; error: Error } = Joi.validate(req.query, FilterSchema, {
          convert: true
        });
  
        if (error) return next(error);
  
        let payload = await this.${camel}Repository.findAll(value);
        let totalCount = await this.${camel}Repository.getCount({ where: value.where || {} });
  
        let findResult = new FindResult(totalCount, payload);
  
        return httpSuccessResponse(res, findResult);
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
        let { data, where } = req.body;
        const count = await this.${camel}Repository.update(data, { where });
  
        return httpSuccessResponse(res, { count });
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
