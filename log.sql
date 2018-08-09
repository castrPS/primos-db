DROP TABLE log;

CREATE TABLE log (
	IP VARCHAR,
	hourtime VARCHAR,
	function VARCHAR,
	inObj VARCHAR,
	outObj VARCHAR
);

curl --data "name=Whisky&breed=annoying&age=3&sex=f" \
http://127.0.0.1:3000/api/puppies