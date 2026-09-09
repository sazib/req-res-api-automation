const FIRST_NAMES = [
  "Janet", "Eve", "Emma", "Travis", "Alice",
  "Bob", "Charlie", "Diana", "Edward", "Fiona",
  "George", "Hannah", "Ivan", "Julia", "Kevin",
];

const LAST_NAMES = [
  "Weaver", "Holt", "Wong", "Ramos", "Bluth",
  "Martin", "Chen", "Park", "Singh", "Garcia",
  "Kim", "Lee", "Johnson", "Brown", "Wilson",
];

const JOB_TITLES = [
  "Software Engineer", "Product Manager", "Designer",
  "Data Scientist", "DevOps Engineer", "QA Engineer",
  "Technical Writer", "Solutions Architect", "CTO",
  "Backend Developer", "Frontend Developer", "Full Stack Developer",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUser() {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    name: `${firstName} ${lastName}`,
    job: pick(JOB_TITLES),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@example.com`,
  };
}

export function generateOrder() {
  const user = generateUser();
  const itemCount = randomInt(1, 5);
  const lineItems = Array.from({ length: itemCount }, () => ({
    product: pick(["Widget", "Gadget", "Doohickey", "Thingamajig", "Whatchamacallit"]),
    quantity: randomInt(1, 10),
    unitPrice: randomInt(5, 200),
  }));

  return {
    customer: user,
    lineItems,
    status: pick(["pending", "paid", "shipped", "delivered"] as const),
  };
}

export function generateEmail(): string {
  const name = pick(FIRST_NAMES).toLowerCase();
  const num = randomInt(1000, 9999);
  return `${name}${num}@example.com`;
}

export function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from({ length: 12 }, () => pick(chars.split(""))).join("");
}

export function generateIdempotencyKey(): string {
  return `idem_${Date.now()}_${randomInt(1000, 9999)}`;
}
