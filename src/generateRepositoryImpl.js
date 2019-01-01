const repoImplPath = './src/server/infra/sequelizejs/mysql/repositories';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRepositoryImpl(component, domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);
  let content = `
  import { ${upper} } from '@domain/${domain}/${domain}.model';
  import { DestroyOptions, UpdateOptions } from 'sequelize';
  import { Filter } from '@common/models/QueryOption';
  import { ICountOptions } from 'sequelize-typescript';

  export class ${upper}RepositoryImpl {
    constructor() {}
  
    async save(${camel}: ${upper}) {
      const _ = ${upper}.build(${camel});
      return await _.save();
    }
  
    async findAll(filter: Filter) {
      return await ${upper}.findAll(filter);
    }
  
    async findById(id: number) {
      return await ${upper}.findByPrimary(id);
    }

    async getCount(filter: ICountOptions<${upper}>) {
      return await ${upper}.count(filter);
    }
  
    async update(
      ${camel}: Partial<${upper}>,
      option: UpdateOptions
    ): Promise<[number, ${upper}[]]> {
      return await ${upper}.update(${camel}, option);
    }
  
    async delete(option: DestroyOptions): Promise<number> {
      return await ${upper}.destroy(option);
    }
  }
  `;
  mkdirp.sync(`${repoImplPath}`);
  fs.writeFileSync(`${repoImplPath}/${domain}.repository.impl.ts`, content);

  return;
};
