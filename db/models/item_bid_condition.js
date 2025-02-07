"use strict";
const { Model } = require("sequelize");
const AppError = require("../../utils/appError");
module.exports = (sequelize, DataTypes) => {
  class Item_bid_condition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Item_bid_condition.init(
    {
      item_id: DataTypes.INTEGER,
      auction_id: DataTypes.INTEGER,
      start_time: {
        allowNull: false,
        type: DataTypes.DATE,
        validate: {
          isDate: true,
          async isAfterStartDate(value) {
            const auction = await sequelize.models.Auction.findByPk(
              this.auction_id
            );

            if (
              value < auction.start_date ||
              value > auction.end_date - 3600000
            )
              throw new AppError(
                "start_time must be after auction start_date and before auction end_date by at least 1 hour",
                400
              );
          },
        },
      },

      start_amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      minimum_bidding_amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          quarterTheStartAmount(value) {
            if (value >= this.start_amount * 0.25)
              throw new AppError(
                "minimum_bidding_amount must be maximum 25% of start_amount",
                400
              );
          },
        },
      },
      current_high_bid: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      close_price: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isMoreThanStartAmount(value) {
            if (value < this.start_amount * 2)
              throw new AppError(
                "close_price must be more than 2 times the start_amount",
                400
              );
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item_bid_condition",
      hooks: {
        beforeUpdate: async (item_bid_condition, options) => {
          const auction = await sequelize.models.Auction.findByPk(
            item_bid_condition.auction_id
          );
          if (auction.isActive)
            throw new AppError(
              "can't update the bidding condition after the auction is activated",
              400
            );
        },
      },
    }
  );
  return Item_bid_condition;
};
