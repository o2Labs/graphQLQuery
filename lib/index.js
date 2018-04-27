"use strict";

const fetch = require("node-fetch");

const request = async (path, options, fullQuery) => {
  const query = {
    query: `query ${fullQuery}`
  };
  let headers = { "Content-Type": "application/json" };
  if (options && options.headers) {
    headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers
    );
  }
  const response = await fetch(path, {
    headers,
    body: JSON.stringify(query),
    method: "POST"
  });
  if (!response.ok) {
    throw new Error(
      `Failed with status ${response.status} ${response.statusText}`
    );
  }
  return await response.json();
};

const getConnectionKeys = data =>
  Object.keys(data).filter(item => item !== "fields" && item !== "args");

const getNestedConnections = data => {
  const connectionKeys = getConnectionKeys(data);
  return connectionKeys.map(nestedKey => {
    const nestedFields = data[nestedKey].fields || [];
    const args = data[nestedKey].args || {};
    const nestedConnections = getNestedConnections(data[nestedKey]);
    if (!args || Object.keys(args).length < 1) {
      return `${nestedKey}{${nestedFields.join(" ")} ${nestedConnections}}`;
    }
    const queryArgs = Object.keys(args)
      .map(key => {
        if (typeof args[key] === "string") {
          return `${key}:"${args[key]}"`;
        } else {
          return `${key}:${args[key]}`;
        }
      })
      .join(", ");
    return `${nestedKey}(${queryArgs}){${nestedFields.join(
      " "
    )} ${nestedConnections}}`;
  });
};

const makeQuery = (path, options) => async data => {
  try {
    const fullQuery = Object.keys(data)
      .map(rootQuery => {
        const rootQueryData = data[rootQuery];
        const args = rootQueryData.args || {};
        const fields = rootQueryData.fields || [];
        const nestedConnections = getNestedConnections(rootQueryData);
        if (!args || Object.keys(args).length < 1) {
          return `${rootQuery}{${fields.join(" ")} ${nestedConnections}}`;
        }
        const queryArgs = Object.keys(args)
          .map(key => {
            if (typeof args[key] === "string") {
              return `${key}:"${args[key]}"`;
            } else {
              return `${key}:${args[key]}`;
            }
          })
          .join(", ");
        return `${rootQuery}(${queryArgs}){${fields.join(
          " "
        )} ${nestedConnections}}`;
      })
      .join(" ");
    return await request(path, options, `{${fullQuery}}`);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  request,
  client: (endpoint, options) => ({
    request: makeQuery(endpoint, options)
  })
};
