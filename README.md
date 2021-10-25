<div align="center" id="top">
  <a href="https://nodejs.org">
    <img src="https://nodejs.org/static/images/logo.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Node Express Typescript Boilerplate</h3>
   <p align="center">
   <p>
     Scalable dependency injection based express and typescript boilterplate for creating Restful APIs
   </p>
   <br />
    <a href="https://github.com/glokal-advertising/campaign-management-mobile-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/glokal-advertising/campaign-management-mobile-app/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Tech stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#scripts">NPM Scripts</a></li>
    <li><a href="#branching">Git Branching Guides</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

---

## Tech stack

<div id="built-with">

- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Inversify](https://inversify.io/)
- [Postgres](https://www.postgresql.org/docs/13/index.html)
- [Typeorm](https://typeorm.io/)
- [Jest](https://jestjs.io)
- [Docker](https://www.docker.com/)
  <p align="right">(<a href="#top">back to top</a>)</p>

</div>

---

## Getting Started

1. Make sure [Node](https://nodejs.org)(>=v14.18.0) is installed on your system. If you don't have Node installed on your system then download the the Node installer from the above website.

2. Install [Yarn](https://yarnpkg.com) package manager.

### Installation

1. Clone the repository
   ```sh
   https://github.com/subhadipghs/node-express-typescript-boilerplate sample-app
   ```
2. Install NPM packages

   ```sh
   yarn install
   ```

3. Create a .env file in the root directory of the project and set the following environment variables. (Checkout .env.example for example of .env file)

   ```sh
   POSTGRES_USERNAME=
   POSTGRES_PASSWORD=
   POSGRES_DB=
   POSTGRES_HOST=
   POSTGRES_PORT=
   NODE_ENV=
   PORT=
   ```

4. Run the app in development mode

   ```sh
   npm run watch
   ```

5. Open terminal and paste the command below

   ```sh
   curl --request GET --url http://localhost:3000/ping
   ```

<p align="right">(<a href="#top">back to top</a>)</p>
