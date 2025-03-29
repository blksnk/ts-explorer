# TODO

## Project structure

- [x] Split parser / db / indexer / server / client codebases

## TS config support

- [ ] Add support for aliases

## Parser

- [x] Add support for multiple entry points
- [ ] Add better support for node modules

## Database / Indexer

- [ ] Index file contents (text) without nodes
- [ ] Store node modules in seperate table
- [ ] Flag entry files as such in DB

## Server

- [ ] Add endpoint to get all import links between 2 files

## Client

- [ ] Update design
- [ ] Display project files as nodes

## Stretch goals

- [ ] Add unit tests
- [ ] Make the parsing stack generic to allow for languages other than TS
