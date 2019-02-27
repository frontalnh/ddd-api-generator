const commonPath = 'src/server/common';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateCommon() {
  console.log('Generate common');
  let content = `import { FindOptionsAttributesArray, Transaction } from 'sequelize';
  import { IWhereOptions } from 'sequelize-typescript/lib/interfaces/IWhereOptions';
  
  export interface IFilter<T> {
    where?: IWhereOptions<T>;
    fields?;
    order?: any;
    limit?: number;
    skip?: number;
    offset?: number;
    include?: any[];
    attributes?: FindOptionsAttributesArray;
    raw?: boolean;
  }
  
  export interface IUpdateOption<T> {
    where: Partial<T>;
    transaction?: Transaction;
  }
  
  `;

  mkdirp.sync(`${commonPath}/models`);
  fs.writeFileSync(`${commonPath}/models/QueryOption.ts`, content);

  return;
};
