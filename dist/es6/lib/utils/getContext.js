"use strict";

var Context = require("../context");

function getContext(obj) {
  if (!obj) {
    return;
  }

  if (obj instanceof Context) {
    return obj;
  }

  if (obj.context instanceof Context) {
    return obj.context;
  }

  if (obj.context && obj.context.martyContext) {
    return obj.context.martyContext;
  }
}

module.exports = getContext;