Passport.js OAuth2 Example
==========================

An Express app that uses Passport.js to to authenticate with Google via OAuth2.

### Installation

```
$ yarn
```

You also need to :

* Obtain Google's client Id and secret, and write it in `.env`.

```zsh
# .env
CLIENT_ID=XXXX
CLIENT_SECRET=XXXX
```

* Install MongoDB and run process

```zsh
# For Mac user
$ brew install mongodb
$ brew services start mongodb
```

* Install [node-foreman](https://github.com/strongloop/node-foreman) to load `.env` when starting the app

```
$ yarn add -g foreman
```

### Usage

```
$ nf run yarn start
```
