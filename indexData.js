const elasticsearch = require('elasticsearch')
const fs = require('fs')

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
})

const INDEX = 'nasa-meteorite-landings-test1'

const bulkIndex = (index, data) => {
  data.forEach((item, i) => {
    console.log(`Adding entry ${i}/${data.length}`)
    client.index({
      id: item.id,
      index,
      body: item
    }, function (err, resp, status) {
      console.log(err, resp, status);
    })
  })

  console.log("Finished indexing data")
}
const meteoriteLandings = fs.readFileSync('nasa-meteorite-data.json')
bulkIndex(INDEX, JSON.parse(meteoriteLandings))