+++
title = 'Setting up a local database'
date = 2024-04-12T21:30:00Z
+++

In order to set up a local MySQL database to work with the app, you must include the following variables in your `.env` file:
```
DB_HOST='localhost'
DB_PORT=3306
DB_NAME='restauwants'
LOCAL_DB_ROOT_PASSWORD='root'
```

You then must run `docker compose up` inside a terminal to launch the Docker container associated with the local database, and once the database is running, in a separate terminal the command `pnpm run db:push` to populate the database with its initial tables.

### What if I have problems?
The best way to resolve issues with the local databse is through the Adminer instance. If you need to remove all tables in the database:

1. Start the Docker container.
2. Visit [localhost:8080](http://localhost:8080).
3. Log in with your configured username and password.
4. Click on the 'restauwants' database.
4. Select all tables in the database and click 'drop'.