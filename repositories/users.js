const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
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
}

// export userRpository class
module.exports = new UsersRepository('users.json');
