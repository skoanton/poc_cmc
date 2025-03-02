import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.findMany();

  if (customers.length > 0) {
    console.log("Customers already exist");
    return;
  }

  const customer = await prisma.customer.create({
    data: {
      name: "Customer 1",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Customer 2",
    },
  });

  console.log({ customer, customer2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
