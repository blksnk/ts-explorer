# TODO

## Documentation

- [ ] Write README
- [ ] Generate API documentation

## Project structure

- [x] Split parser / db / indexer / server / client codebases

## TS config support

- [ ] Add support for aliases

## Parser

- [x] Add support for multiple entry points
- [x] Add better support for node modules
- [ ] Add support for parsing any public github repo

## Database / Indexer

- [x] Index file contents (text) without nodes
- [x] Store node modules in seperate table
- [x] Flag entrypoint files as such in DB

## Server

- [ ] Add endpoint to get all import links between 2 files

## Client

- [ ] Update design
  - [x] Project details page
  - [ ] Project list
- [x] Display project files as nodes
- [x] Display highlighted file code

- [ ] Implement layout simulation for file node tree
- [ ] Display imported node packages in node tree

## Stretch goals

- [ ] Add unit tests
- [ ] Make the parsing stack generic to allow for languages other than TS
