import { DataSource } from "typeorm"
import * as process from "process";
import { config } from "dotenv";
config()


const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: 'chat',
  synchronize: true,
  logging: ["query", "error"],
  migrations: ["./src/migrations/*.ts"],
  migrationsTableName: "migrations",
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

export default AppDataSource;