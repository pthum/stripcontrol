# Stripcontrol entry point repository

This repository inlcudes the main documentation and the frontend project.

# Project description

This project offers a set of small webservices with a frontend to control APA102 strips.

More specifically: 

The light switches in my apartment have a "bad UX". For my daily "workflows", they're always located in a way, that i need to put some additional effort when I want to use them. The idea to solve this problem was to use the RaspberryPi as a cloud-free smart home solution. In the current state, the RasPi drives only the LED strips, but more may come in future (such as controlling radio-controlled power sockets).

Furthermore, this project is also a playground to try different technologies, tools, etc, where the vue frontend and spring-boot application can be seen as a reference implementation of the project. Other implementations (f.i. implementations using microprofile, spark, golang, rust) may follow in the future.


## Project Overview
In the current state, there are several sub-projects in this project, split over different repositories.

- [Frontend Project](stripcontrol-frontend/README.md)
  - [Archived: Old Frontend Project](https://github.com/pthum/stripcontrol-archive/tree/main/stripcontrol-frontend)
- API Backend implementations (Alternative implementations)
  - [Golang API-Backend](https://github.com/pthum/stripcontrol-golang)
  - [Archived: Quarkus API-Backend](https://github.com/pthum/stripcontrol-archive/tree/main/stripcontrol-quarkusbackend)
  - [Archived: SpringBoot API-Backend](https://github.com/pthum/stripcontrol-archive/tree/main/stripcontrol-springbackend)
- [Quarkus LightControl Backend](https://github.com/pthum/stripcontrol-java/tree/main/stripcontrol-quarkuslights)

### Architectural Evolution of the project
see [Architectural Evolution](docs/architectural-evolution.md)

TBC
