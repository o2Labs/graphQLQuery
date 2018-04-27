## Features

* A very simplistic GraphQL client in JS

## Build

* NodeJS (tested with v7.7.1)

## Examples

As in examples folder

## As a query object based request

```
const endpoint = "https://api.graphloc.com/graphql";

const apiClient = graphqlQuery.client(endpoint);

const data = {
  getLocation: {
    args: { ip: "189.59.228.170" },
    country: {
      fields: ["geoname_id", "iso_code"],
      names: {
        fields: ["en"]
      }
    },
    location: {
      fields: ["latitude", "longitude"]
    }
  }
};

graphQLQuery.client
  .request(data)
  .then(response => console.log(JSON.stringify(response)))
  .catch(err => console.log(err));
```

## As a query string based request

```
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
```
