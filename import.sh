#!/bin/bash -xe
# starting docker stuff
if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit
fi
docker-compose up -d
echo "copying file"
file=bak.json
cp $1 $file
echo "Replace header"
perl -0777 -pi -e 's/\A[^\n]*\n[^\n]*\n/{\n/g' $file
echo "Replace footer"

# perl -0pe 's/^*[^\n]*\n.\Z/ }/' $file
# because the perl command was slow as balls
sed -i '$d' $file
sed -i '$d' $file
echo "}" >> $file
echo "replacing first commas"
perl -pi -e 's/^  \}, \{/  }\n  {/' $file
echo "done"

docker run --rm -it -v ${PWD}/$file:/tmp/$file --network=wherewasi mongo\
  mongoimport --collection points --db history --host mongo /tmp/$file

rm -f $file
