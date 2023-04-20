const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

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
  async create(attrs) {
    // add random id to the each user info
    attrs.id = this.randomId();
    // create a salt
    const salt = crypto.randomBytes(8).toString('hex');
    const hashBuffer = await scrypt(attrs.password, salt, 64);

    const record = { ...attrs, password: `${hashBuffer.toString('hex')}.${salt}` };
    const records = await this.getAll();
    records.push(record);

    this.writeAll(records);

    return record;
  }

  async comparePassword(saved, supplied) {
    // saved -> password saved in database: "hashed.salt"
    // supplied -> password given to us by a user trying to sign
    const [hashed, salt] = saved.split('.');
    const suppliedHashBuffer = await scrypt(supplied, salt, 64);
    return hashed === suppliedHashBuffer.toString('hex');
  }
  // write user info in file.json
  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }
  // generate random id for each user info
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);

    await this.writeAll(filteredRecords);
  }

  // update a record with a new attr searching by id
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);
    if (!record) {
      throw new Error(`Record with id${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

// export userRpository class
module.exports = new UsersRepository('users.json');
