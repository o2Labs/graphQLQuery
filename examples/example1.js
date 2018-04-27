const graphqlQuery = require("..");

const endpoint = "https://api.graphloc.com/graphql";

const query = `{
  getLocation(ip: "189.59.228.170") {
    country {
      names {
        en
      }
      geoname_id
      iso_code
    }
    location {
      latitude
      longitude
    }
  }
}`;

graphqlQuery
  .request(endpoint, {}, query)
  .then(response => console.log(JSON.stringify(response)))
  .catch(err => console.log(err));
