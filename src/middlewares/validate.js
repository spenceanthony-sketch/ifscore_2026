function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      for (const source of ['body', 'params', 'query']) {
        if (schemas[source]) req.validated = { ...(req.validated || {}), [source]: schemas[source].parse(req[source]) };
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = validate;
