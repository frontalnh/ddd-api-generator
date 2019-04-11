const repoPath = 'src/domain';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRepository(domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  console.log('Generate repository');
  let content = `import { ${upper} } from '@domain/${domain}/${domain}.model';
  import { IUpdateOption, IFilter } from '@common/models/QueryOption';
  import { DestroyOptions, AggregateOptions, Transaction } from 'sequelize';
  import { ICountOptions } from 'sequelize-typescript';

  export interface I${upper}Repository {
    save(${camel}: ${upper}): Promise<${upper}>;
    saveWithTx(${camel}: ${upper}, transaction: Transaction): Promise<${upper}>;
    findAll(filter: IFilter<${upper}>): Promise<${upper}[]>;
    findById(id: number): Promise<${upper}>;
    getCount(filter: ICountOptions<${upper}>): Promise<number>;
    getSum(prop: string, option: AggregateOptions): Promise<number>;
    update( ${camel}: Partial<${upper}>, option: IUpdateOption<${upper}> ): Promise<number>;
    delete(option: DestroyOptions): Promise<number>;
  }
  `;
  // fs.mkdirSync(, { recursive: true });
  // fs.mkdirSync('hello/domain', { recursive: true });

  mkdirp.sync(`${repoPath}/${domain}`);
  fs.writeFileSync(`${repoPath}/${domain}/${domain}.repository.ts`, content);

  return;
};
