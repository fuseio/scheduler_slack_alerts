import express from 'express';
import dotenv from 'dotenv';
import { Scheduler } from './scheduler';
import { getTotalSupply, getBridgeLiquidity } from './helpers/liquidity';
import { BigQueryDatetime } from '@google-cloud/bigquery';
import { getVoltageBridgeLiquidity } from './helpers/voltageLiquidity';
dotenv.config();
const app = express();

const scheduleTasks = () => {
  const liquidityScheduler = new Scheduler(60 * 60 * 1000);
  const liquidityTask = () => {
    console.log("Running liquidity task");
    const d = new Date();
    const date = new BigQueryDatetime({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds(),
    });
    getTotalSupply(date)
    getBridgeLiquidity(date)
  }
  const voltageLiquidity = () => {
    console.log("Running voltage liquidity task");
    const d = new Date();
    const date = new BigQueryDatetime({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds(),
    });
    getVoltageBridgeLiquidity(date)
  }
  liquidityScheduler.addTask(voltageLiquidity);
  liquidityScheduler.addTask(liquidityTask);
}

app.listen(4000, () => {
  scheduleTasks();
  console.log(`server running on port 4000`);
});