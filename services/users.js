const MongoLib = require("../lib/mongo");
const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this.collection = "users";
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserId = await this.mongoDB.create(this.collection, {
      name,
      email,
      password: hashedPassword,
    });

    return createUserId;
  }

  async getOrCreateUser({ user }) {
    const querieUser = await this.getUser({ email: user.email });

    if (querieUser) {
      return querieUser;
    }

    await this.createUser({ user });
    return await this.getUser({ email: user.email });
  }
}

module.exports = UserService;
