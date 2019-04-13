# Node DDD Component Generator

본 프로젝트는 Node.js 서버를 DDD 아키텍체로 생성하는 경우 기본 CRUD 를 위한 repository 및 router 를 auto generate 하기 위한 cli application 이다.

또한 모든 로직은 mysql sequelize를 기준으로 생성되었으며 다른 데이터베이스를 사용하고자 하는 경우 /bin/dddgen 파일을 수정하여야 한다.

## Getting started

먼저 생성한 스크립트 파일을 읽어들이기 위해 환경변수를 설정한다.

```sh
export PATH=/Users/namhoonlee/Desktop/git/ddd-api-generator/bin:$PATH
```

위 명령어는 특정 디렉토리의 로컬 환경변수 이므로 전역으로 사용하기 위해서는

/.bash_profile 파일에 환경변수를 등록해주어야 한다.

## Command

`dddgen generate <component>`

component의 종류
`repo`
repository interface 를 생성해 준다.

`repoimpl`
repository 구현체를 생성해 준다.

`route`
route를 생성해 준다.

`all`
특정 도메인에 대해 위 모든 컴포넌트를 생성해 준다.

위 명령어는 DDD 컴포넌트를 생성하는 명령어이며 다음의 필수 옵션을 가진다.

`-n <domain>`

여기서 domain 명은 단수이며, 두 단어 이상인 경우 sales-proposal 와 같이 가운데 바(-) 로 구분해 준다.

example

```sh
dddgen generate repository -n user
dddgen generate all -n user
```

## Configuration

각 컴포넌트들의 기본 경로는 다음과 같다.

repository: `./src/domain/[도메인 명]/[도메인 명].repository.ts`

repository implementation: `./src/infra/sequelize/mysql/repositories/[도메인 명].repository.impl.ts`

route: `./src/interfaces/http/[도메인 명].route.ts`

해당 경로를 위한 디렉토리들이 모두 생성되어 있어야 하며, 이를 수정하고자 한다면 `dddgen` 파일의 repoPath, repoImplPath, routePath를 수정해 주면 된다.
