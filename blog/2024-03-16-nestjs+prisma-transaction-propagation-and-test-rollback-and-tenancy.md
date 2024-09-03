---
slug: nestjs+prisma-transaction-propagation-and-test-rollback-and-tenancy
title: 🔧 Nestjs + Prisma, transaction propagation & test rollback & multi-tenancy
authors: jamesp
tags: [Technology Stack, Prisma, NestJs, Tenancy, Transaction]
keywords: [NestJS Prisma integration, Prisma transaction propagation, Multi-tenancy with PostgreSQL, Container managed transactions, Prisma rollback tests, Prisma interactive transactions, Transparent tenant isolation, NestJS transactional middleware]
description: Explore how to integrate NestJS with Prisma for robust transaction propagation, test rollbacks, and transparent multi-tenancy using PostgreSQL. Learn best practices for container managed transactions and setting up a multi-tenant architecture with our comprehensive guide.
---

## Prisma interactive transaction

`Prisma` is great. Yet it's support for `interactive transaction` is currently [limited](https://github.com/prisma/prisma/issues/12458) (Up to v5+),

```typescript
// interactive transaction
prisma.$transaction([array_of_operations,]);

prisma.$transaction(async (tx) => {
    // dependent operations
});
```

## Container managed transactions

As we integrate Prisma to `NestJs`, we want cross `Services` transaction propagation, `container managed tx` is even better. After some investigation, we come to [@nestjs-cls/transactional](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional),

<!--truncate-->

```typescript
@Injectable()
export class MyService {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly anotherService: AnotherService,
  ) {}

@Transactional()
  async myMethod(){
    const prisma = this.txHost.tx as PrismaClient;

    // db operations1
    await this.anotherService.anotherMethod(); // db operations2
    // db operations3
  }
}
```

Just decorate your `Service` method with `@Transactional()`, it will automatically propagate the transaction across service calls. Under the hood, it uses `cls` (continuation-local storage) to manage the transaction context.

Rollback is triggered by just throwing an exception.

### Setup the module

<a id="prismaInjectionToken"></a>

```typescript
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule], // comment this line, if you have existing PrismaModule
          middleware: { mount: true }, // mount plugin as nestjs middleware
          adapter: new TransactionalAdapterPrisma({ // Prisma adaptor
            // the original PrismaService is wrapped into the adaptor
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
```

More complicated use cases, please read it's [documentation](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional).

## Transactions in e2e test cases

After each test case, we need to rollback the transaction, preventing side-effects. Thankfully again, it comes to [@chax-at/transactional-prisma-testing](https://github.com/chax-at/transactional-prisma-testing#readme),

```typescript
// the PrismaService proxy
let prismaService;

// This function must be called before every test
async function beforeEachFn(): Promise<void> {
  if(prismaTestingHelper == null) {
    prismaTestingHelper = new PrismaTestingHelper(app.get(PrismaService));
    prismaService = prismaTestingHelper.getProxyClient();
  }
  await prismaTestingHelper.startNewTransaction();
}

// This function must be called after every test
function afterEachFn(): void {
  prismaTestingHelper?.rollbackCurrentTransaction();
}
```

### Integrated with @nestjs-cls/transactional

We need this orderly wrapping,

```text
@nestjs-cls/transactional
  └─@chax-at/transactional-prisma-testing
      └─original-PrismaService
```

So we override PrismaService with testing proxy in <a id="beforeAllFn">`beforeAllFn`</a>,

```typescript
import { Test } from '@nestjs/testing';

let prismaTestingHelper, prismaServiceForTest;

const beforeAllFn = () => {
  const moduleFixtureForTest = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useFactory({ factory: (originalPrisma: PrismaService) => {
          if (prismaTestingHelper == null) {
            prismaTestingHelper = new PrismaTestingHelper(originalPrisma);
            prismaServiceForTest = prismaTestingHelper.getProxyClient();
          }
          return prismaServiceForTest;
        },
        inject: [PrismaService],
      })
      .compile();

  const app: NestFastifyApplication =
    await moduleFixtureForTest.createNestApplication(new FastifyAdapter(), {
      abortOnError: false,
      bufferLogs: false,
    });

  // ... ...
}
```

Don't forget to call these method around each test,

```typescript
describe('AppController (e2e)', () => {
  beforeAll(beforeAllFn);
  afterAll(afterAllFn);
  beforeEach(beforeEachFn);
  afterEach(afterEachFn);

  it('/api (GET)', () => {
    // db operations are rollbacked after each test automatically.
  });
```

🎉 🎉 🎉

## Transparent multi-tenancy based on postgreSQL

We have a [multi-tenant application, Callgent](https://callgent.com), tenants data are isolated based on the `tenant_id` column in db tables.

By design, we want tenant isolation **transparently** implemented, so we don't need to add `tenant_id` to every query.

```typescript
  // by default, we want the below query to be tenant isolated,
  // only users in context tenant are returned.
  prisma.$queryRaw`SELECT * FROM users`
```

We utilize the postgreSQL row level security(RLS), following [this article](https://github.com/prisma/prisma-client-extensions/tree/main/row-level-security) to achieve **transparent tenant isolation**.

:::note
RLS is only applicable in `postgreSQL`
:::

### How to implement

1. in `schema.prisma` file, set db column `tenant_id` default value to context variable `tenancy.tenantPk`,

   ```prisma
   tenant_id Int  @default(dbgenerated("(current_setting('tenancy.tenantPk'))::int"))
   ```

2. enable postgres row level security(RLS), so that we can filter data by `tenant_id` automatically:
   write SQL in prisma/migrations/01_row_level_security/migration.sql,
   please refer this [real example](https://github.com/Callgent/callgent-api/blob/main/prisma/migrations/row_level_security/migration.sql)

3. on each request, preset `tenant_id` into `cls` context, refer to [auth-logined.listener.ts](https://github.com/Callgent/callgent-api/blob/main/src/users/listeners/auth-logined.listener.ts),

   ```typescript
   cls.set('TENANT_ID', curentUser.tenantPk);
   ```

4. extend `PrismaClient` to set `tenant_id` before any query, refer to [prisma-tenancy.provider.ts](https://github.com/Callgent/callgent-api/blob/main/src/infra/repo/tenancy/prisma-tenancy.provider.ts),

   ```sql
   SELECT set_config('tenancy.tenantPk', cls.get('TENANT_ID') ...
   ```

5. if you want to bypass rls, for example, by admin, or looking up the logon user to determine their tenant ID:

   ```sql
   CREATE POLICY bypass_rls_policy ON "User" USING (current_setting('tenancy.bypass_rls', TRUE)::text = 'on');
   ```

   then when you want to bypass rls, you must set `tenancy.bypass_rls` to `on` before running the query, refer to [prisma-tenancy.service.ts](https://github.com/Callgent/callgent-api/blob/main/src/infra/repo/tenancy/prisma-tenancy.service.ts),

   ```js
   await prisma.$executeRaw`SELECT set_config('tenancy.bypass_rls', 'on', TRUE)`;
   ```

### how it works

1. `tenantPk` is set into `cls` context on each request from current user.
2. `PrismaClient` is extended on `$allOperations` to set `tenantPk` into db variable `tenancy.tenantPk` before any query.
3. postgreSQL RLS is enabled, so that all queries will be filtered by `tenancy.tenantPk` automatically.
4. on db `insert` operation, `tenancy.tenantPk` is set into `tenant_id` column as default value.

## Integrate them all

As we extended `PrismaClient` to enable transparent multi-tenancy, now the wrapping order is changed to,

```text
@nestjs-cls/transactional
  └─@chax-at/transactional-prisma-testing
      └─**tenancy-extended-prisma**
        └─original-PrismaService
```

1. extend `PrismaClient` as name `TENANTED_PRISMA_SERVICE`

    ```typescript
    @Global()
    @Module({
      imports: [PrismaModule], // original PrismaModule
      providers: [ {
        provide: TENANTED_PRISMA_SERVICE,
        // ...
      } ],
      exports: [TENANTED_PRISMA_SERVICE], // extended PrismaClient
    })
    export class PrismaTenancyOnPgModule {}
    ```

2. replace `PrismaService` with `TENANTED_PRISMA_SERVICE` in [`prismaInjectionToken`](#beforeAllFn),
3. replace `PrismaService` with `TENANTED_PRISMA_SERVICE` in [`beforeAllFn`](#beforeAllFn),

🎉 🎉 🎉

## References

1. [@nestjs-cls/transactional](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional)
2. [@chax-at/transactional-prisma-testing](https://github.com/chax-at/transactional-prisma-testing#readme)
3. [prisma-client-extensions: RLS](https://github.com/prisma/prisma-client-extensions/tree/main/row-level-security)
4. [Callgent - multi-tenant application](https://github.com/Callgent/callgent-api/blob/main/src/infra/repo/tenancy)
