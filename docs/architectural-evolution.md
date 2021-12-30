# Architectural Evolution

This file describes the architectural evolution of the project over time.

## Initial Setup
The first version consisted of a monolithic architecture. The initial spring-boot project bundled the frontend during the build process and controlled the database connection, as well as the LED strips itself.
The monolith did the update on database level and the modifications on the state of the LED strips were done synchronously within a request.

## First evolution: using events
The second iteration used the spring event system using Application Events and therefore decoupled the HTTP requests and database changes from the control of the LED strips. The latter was now done asynchronously resulting in faster reponses for the requests.

## Second evolution: quarkus implementation 
### Re-implementation in Quarkus
To try another framework, quarkus was chosen to reimplement the existing spring application. This resulted in further separation of shared code in libraries on the one hand and on the other hand to better performance of the application on the RaspberryPi 3 which it is running on within a docker container regarding memory usage, startup time and overall stability. 

Side note: i spent some time trying to optimize the spring boot implementation without luck, so this is clearly a point for quarkus, even without GraalVM. Although i stumbled upon a classloading bug within quarkus, due to dirty type-handling for generics in combination with code that is contained in a library.

### Split up in "database-management" and "light-control" services
As the logic has already been separated within the first evolution, the next step was to separate these parts into two dedicated services. One service to accept HTTP requests and control the database state and one service to control the LED strips. The services communicate over a message queue (eclipse mosquitto in this case).

The main reason for this change was (besides doing it just out of interest and fun), to get an easier possibility to reimplement and test-run parts in other languages. While the overall complexity of the application isn't too high, implementing the control of the LED strips (including the protocol for the APA102 strips and software bitbang-SPI) is an impediment, as it requires more time. 

## Third evolution: golang implementation for "database-management"
With the separation into two services, it was easy to bring up a golang implementation for the HTTP API and database management, which resulted in even fewer resource consumption, especially memory, faster startup and response times. 

## Fourth evolution: separated frontend
Until this step, the frontend was built during the maven build process of the java applications and then copied into the java applications. For the golang implementation, the buildjob on my internal jenkins copied the stored artifact into the correct location during build. Thus, having additional overhead when updating the frontend, as a chang within the frontend needed to build the java projects, the golang project and a redeploy of the golang service. 

Therefore, the frontend was separated into its own docker image, running an nginx and reverse-proxying the backend. 

Aside the positive effects during the build, this structure makes it easier to extend the system with additional/separated functionalities in future.

Side note: This split was also used as a chance to restructure the code, update from vue2 to vue3 and switch from bootstrap to quasar.