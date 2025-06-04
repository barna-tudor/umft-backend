# README

Backend API using Node.js and Express.<br>
Uses Postgres as the database engine.<br>
Must Install the [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7) extension on the Postgres host machine.<br>
Must have Redis/Valkey up and running.

## 1. Set-up

1. Download the source files:<br>
   `git clone https://github.com/barna-tudor/umft-backend.git`<br>
   `cd umft-backend`<br>
2. Create a `.env` file based on `.env.example`:<br>
   `cp ./.env.example ./.env` and populate
3. Run the `src/database/init.sql` script on your database.
    - Note: if not using the Default schema, you need to edit the following:
        - `src/database/dbConfig.js:15`: uncomment the line
        - `.env`: uncomment `DB_SCHEMA` and populate.
4. Install dependencies:<br>
   `npm install`
5. `npx hardhat init`(Can leave all default answers as-is except for `Create .gitignore`)
6. `npx hardhat compile`  
   `npx hardhat run scripts/deploy.js --network localhost`  
   Copy the address given in terminal to `.env`
7. In 2 different terminals,  
   `npx hardhat node` and copy one private_key to `.env`'s `ETHERS_PRIVATE_KEY` field;  
   `npm run start`

## 2. Endpoints

### Note: All endpoints have the prefix `/api`

#### e.g. `/api/alert`

### **! Check the given Postman collection for examples and required request bodies**

### 2.1.

| HTTP Method | Endpoint | Description |
|:-----------:|:---------|:------------|


