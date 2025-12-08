# Overview

This conatins how the data is passed from a component to another, and what relationship exist among those components.

## UML Diagram

The UML diagram consists of four entity.<br>

1. <strong>User:</strong><br>
   Represents an individual user who interacts with the appliaction to book movie tickets.
2. <strong>Movie:</strong><br>
   It repressent a single unit where we have the movie deatil.
3. <strong>Show:</strong><br>
   Reprsents the schedule of a show at specific time.
4. <strong>Booking:</strong><br>
   It represnt how user has booked the seats for a movie.

<strong> UML Diagram:</strong><br>

<img src="../public/uml-design.png" width="650">

## Relationship

1. User -> Booking:<br>
   One user can have multiple boookings so (One-to-Many) relationship.

2. Movie -> Show:<br>
   One movie can have multiple show so (One-to-Many) relationship.

3. Show -> Booking:<br>
   One show can have multiple boookings so (One-to-Many) relationship.
