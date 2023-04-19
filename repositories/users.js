const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
  }

  // create user record
  async create(attribute) {
    // add random id to the each user info
    attribute.id = this.randomId();

    const records = await this.getAll();
    records.push(attribute);

    this.writeAll(records);
  }
  // write user info in file.json
  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }
  // generate random id for each user info
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
}

const test = async () => {
  const repo = new UsersRepository('users.json');

  await repo.create({ email: 'tested@testing.com', password: 'password' });

  users = await repo.getAll();
  console.log(users);
};

test();