const repoPath = 'src/server/domain';
const makeCamel = require('./utils');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateRepository(domain) {
  let camel = makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  console.log('Generate repository');
  let content = `import { ${upper} } from '@domain/${domain}/${domain}.model';
  import { UpdateOption, Filter } from '@common/models/QueryOption';
  import { DestroyOptions } from 'sequelize';
  import { ICountOptions } from 'sequelize-typescript';

  export interface ${upper}Repository {
    save(${camel}: ${upper}): Promise<${upper}>;
    findAll(filter: Filter): Promise<${upper}[]>;
    findById(id: number): Promise<${upper}>;
    getCount(filter: ICountOptions<${upper}>): Promise<number>;
    update(
      ${camel}: Partial<${upper}>,
      option: UpdateOption<${upper}>
    ): Promise<[number, ${upper}[]]>;
    delete(option: DestroyOptions): Promise<number>;
  }
  `;
  // fs.mkdirSync(, { recursive: true });
  // fs.mkdirSync('hello/server/domain', { recursive: true });

  mkdirp.sync(`${repoPath}/${domain}`);
  fs.writeFileSync(`${repoPath}/${domain}/${domain}.repository.ts`, content);

  return;
};
