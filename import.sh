#!/bin/bash
docker run -it -v history.json:/history.json --network=wherewasi mongo\
  mongoimport --db history --host mongo
