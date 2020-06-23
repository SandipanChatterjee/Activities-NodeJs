const advancedResults = (modal) => async (req, res, next) => {
  const query = { ...req.query };

  const removeFields = ["select", "sort"];

  // console.log("query before", query);

  removeFields.map((item) => delete query[item]);

  // console.log("query after", query);

  let queryStr = JSON.stringify(query);

  queryStr = queryStr.replace(
    /\b($gt|$gte|$lt|$lte|$in)\b,g/,
    (match) => `$${match}`
  );

  // console.log("queryStr", queryStr);

  let data = modal.find(JSON.parse(queryStr)).populate({
    path: "game",
    select: "name price",
  });
  //select
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    data = data.select(field);
  }
  //sort
  if (req.query.sort) {
    const field = req.query.sort.split(",").join(" ");
    data = data.sort(field);
  }

  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parse(req.query.limit) || 20;
  // const index = (page - 1) * limit;

  data = await data;

  let count = data.length;

  res.advancedResults = {
    success: true,
    count,
    data,
  };

  next();
};

module.exports = advancedResults;
