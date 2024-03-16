---
slug: nestjs+prisma-transaction-propagation-and-test-rollback-and-tenancy
title: Nestjs + Prisma, interactive transaction propagation & rollback in e2e-test & multi-tenancy
authors: jamesp
tags: [Technology Stack, Prisma, NestJs, Tenancy, Transaction]
---

## Prisma interactive transaction

`Prisma` is great. Yet it's support for `interactive transaction` is currently [limited](https://github.com/prisma/prisma/issues/12458) (Up to 5+),

```typescript
// interactive transaction
prisma.$transaction([array_of_operations,]);

prisma.$transaction(async (tx) => {
    // dependent operations
});
```

## Container managed transactions

As we integrate Prisma to `NestJs`, we want cross `Services` transaction propagation, `container managed tx` is even better. After some investigations, we come to [@nestjs-cls/transactional](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional),

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

```typescript
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule], // comment this line, if you have existing PrismaModule
          adapter: new TransactionalAdapterPrisma({ // Prisma adaptor
            // the original PrismaService is wrapped into the adaptor
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
```

More complicated use cases, please read it's [documentation](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional).

## Transactions in test cases

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

So we override PrismaService with testing proxy in `beforeAllFn`,

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

Don't forget to call these method in each test,

```typescript
describe('AppController (e2e)', () => {
  beforeAll(beforeAllFn);
  afterAll(afterAllFn);
  beforeEach(beforeEachFn);
  afterEach(afterEachFn);

  it('/api (GET)', () => {
    // ...
  });
```

🎉 🎉 🎉
