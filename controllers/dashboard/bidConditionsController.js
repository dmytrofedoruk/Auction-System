const db = require("../../db/models");
const catchAsync = require("../../utils/catchAsync");

const BidCondition = db.Item_bid_condition;

exports.getAllBidConditions = catchAsync(async (req, res) => {
  const bidConditions = await BidCondition.findAll();
  res.status(200).json({
    status: "success",
    results: bidConditions.length,
    data: {
      bidConditions,
    },
  });
});

exports.getBidCondition = catchAsync(async (req, res) => {
  const bidCondition = req.foundRecord;
  res.status(200).json({
    status: "success",
    data: {
      bidCondition,
    },
  });
});

exports.createBidCondition = catchAsync(async (req, res) => {
  req.body.current_high_bid = req.body.start_amount;
  const bidCondition = await BidCondition.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      bidCondition,
    },
  });
});

exports.updateBidCondition = catchAsync(async (req, res) => {
  const bidCondition = await req.foundRecord.update(req.body);
  res.status(200).json({
    status: "success",
    data: {
      bidCondition,
    },
  });
});
