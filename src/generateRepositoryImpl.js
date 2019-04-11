const repoImplPath = './src/infra/sequelizejs/mysql/repositories';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRepositoryImpl(component, domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);
  let content = `
  import { ${upper} } from '@domain/${domain}/${domain}.model';
  import { DestroyOptions, UpdateOptions, AggregateOptions, Transaction } from 'sequelize';
  import { IFilter } from '@common/models/QueryOption';
  import { ICountOptions } from 'sequelize-typescript';
  import { removeDotInJson } from '@frontalnh/json-dot-parser';

  export class ${upper}RepositoryImpl {
    constructor() {}
  
    async save(${camel}: ${upper}) {
      return await ${camel}.save();
    }
  
    async saveWithTx(${camel}: ${upper}, transaction: Transaction) {
      return await ${camel}.save({ transaction });
    }
  
    public async findAll(filter: IFilter<${upper}>) {
      if (filter.searchKey) {
        Object.assign(filter.where, { $or: [{ name: { $like: '%' + filter.searchKey + '%' } }] });
      }
      if (!filter.raw) return ${upper}.findAll(filter);
  
      let datas = await ${upper}.findAll(filter);
      for (let data of datas) {
        Object.assign(data, removeDotInJson(data));
      }
  
      return datas;
    }
  
    async findById(id: number) {
      return await ${upper}.findByPrimary(id);
    }

    async getCount(filter: ICountOptions<${upper}>) {
      return await ${upper}.count(filter);
    }

    public async getSum(prop, filter: AggregateOptions) {
      return ${upper}.sum(prop, filter);
    }
  
    async update(
      ${camel}: Partial<${upper}>,
      option: UpdateOptions
    ): Promise<number> {
      let [count] = await ${upper}.update(${camel}, option);

      return count;
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
