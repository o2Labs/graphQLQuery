const graphqlQuery = require("..");

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

apiClient
  .request(data)
  .then(response => console.log(JSON.stringify(response)))
  .catch(err => console.log(err));
