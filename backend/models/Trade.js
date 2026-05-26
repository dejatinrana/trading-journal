import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basicInfo: {
      symbol: { type: String, required: true },
      market: {
        type: String,
        enum: ["Crypto", "Forex", "Stock", "Index", "Commodity"],
        default: "Crypto",
      },
      direction: {
        type: String,
        enum: ["LONG", "SHORT"],
        required: true,
      },
      tradeDate: { type: Date, default: Date.now },
      session: {
        type: String,
        enum: ["Asia", "London", "New York", "Overlap", "Other"],
      },
      timeframe: { type: String },
      strategy: { type: String },
    },

    setup: {
      setupName: { type: String },
      setupGrade: {
        type: String,
        enum: ["A+", "A", "B", "C", "D"],
      },
      marketCondition: {
        type: String,
        enum: ["Trending", "Range", "Breakout", "Reversal", "Choppy"],
      },
      higherTimeframeBias: {
        type: String,
        enum: ["Bullish", "Bearish", "Neutral"],
      },
      confluences: [{ type: String }],
      entryReason: { type: String },
    },

    execution: {
      entryPrice: { type: Number, required: true },
      exitPrice: { type: Number },
      stopLoss: { type: Number },
      takeProfit: { type: Number },
      quantity: { type: Number, required: true },
      leverage: { type: Number, default: 1 },
      fees: { type: Number, default: 0 },
      adversePriceMove: { type: Number },
    },

    risk: {
      accountBalanceBefore: { type: Number },
      riskAmount: { type: Number },
      riskPercent: { type: Number },
      plannedRR: { type: Number },
      actualRR: { type: Number },
      rMultiple: { type: Number },
    },

    result: {
      pnl: { type: Number, default: 0 },
      pnlPercent: { type: Number },
      result: {
        type: String,
        enum: ["Win", "Loss", "Break Even", "Open"],
        default: "Open",
      },
      holdingTime: { type: String },
    },

    psychology: {
      emotionBefore: { type: String },
      emotionDuring: { type: String },
      emotionAfter: { type: String },
      confidenceLevel: { type: Number, min: 1, max: 10 },
      disciplineScore: { type: Number, min: 1, max: 10 },
      stressLevel: { type: Number, min: 1, max: 10 },
    },

    mistakes: {
      mistakesList: [{ type: String }],
      ruleBroken: { type: Boolean, default: false },
      followedPlan: { type: Boolean, default: true },
      revengeTrade: { type: Boolean, default: false },
    },

    review: {
      whatWentWell: { type: String },
      whatWentWrong: { type: String },
      lessonLearned: { type: String },
      improvement: { type: String },
      tradeGrade: {
        type: String,
        enum: ["A+", "A", "B", "C", "D"],
      },
    },

    media: {
      beforeScreenshot: { type: String },
      afterScreenshot: { type: String },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
