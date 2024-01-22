const { BigQuery, BigQueryDatetime } = require("@google-cloud/bigquery");
import dotenv from 'dotenv';
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function insertRowsAsStream(
  rows: string | any[],
  datasetId = "",
  tableId = ""
) {
  //console.log(rows);
  await bigquery.dataset(datasetId).table(tableId).insert(rows);
  console.log(`Inserted ${rows.length} rows`);
}