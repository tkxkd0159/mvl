const priceTable = `
CREATE TABLE IF NOT EXISTS prices (
    id serial PRIMARY KEY,
    usd numeric(10, 10),
    record_ts TIMESTAMP NOT NULL
)
`

export {priceTable}