+++
title = 'Architecture'
date = 2024-04-09T06:59:07Z
+++

## Overview

The high-level architecture diagram below depicts the services that make up the RestauWants application.

![Architecture Diagram](/restauwants/images/architecture/architecture-diagram.png)

The following services are part of the RestauWants application:
- [Next.js](https://nextjs.org/): Provides the frontend and backend of the application.
- [MySQL](https://www.mysql.com/): Stores relational data for the application.

## Frontend

The frontend of the application is built using Next.js, a [React](https://react.dev/) framework. The frontend is responsible for rendering the user interface and handling user interactions. It communicates with the backend using [server actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) and [tRPC](https://trpc.io/).

## Backend

The backend of the application is provided by Next.js serverless functions running the Node.js runtime. It is responsible for performing server actions, handling tRPC requests, and interacting with the MySQL database.

## Database

The MySQL database stores relational data for the application, including user, review, and friendship data. The backend communicates with the database through the [mysql2](https://www.npmjs.com/package/mysql2/v/1.4.2) driver and the [Drizzle](https://orm.drizzle.team/) ORM.

## Deployment

The Next.js service is deployed to [Vercel](https://vercel.com/home). The MySQL service is deployed to [Railway](https://railway.app/).
