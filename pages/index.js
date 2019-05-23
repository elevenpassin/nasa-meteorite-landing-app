import React, { useState } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import { Grommet, Form, FormField, Button, Table, TableHeader, TableRow, TableCell, TableBody, Box } from 'grommet'
import ReactLoading from 'react-loading';

import Header from '../components/Header'

import './style.css'

const TableResults = ({ hits }) => {

  if (hits && hits.length) {
    const preDefinedFields = [
      'name',
      'mass',
      'nametype',
      'geolocation',
      'fall',
      'recclass',
      'reclong',
      'year'
    ]

    const headings = preDefinedFields.map(heading => (
      <TableCell scope="col" border="bottom">
        {heading.toUpperCase()}
      </TableCell>
    ))

    const rows = hits.map(hit => (
      <TableRow>
        {
          preDefinedFields.map(field => (
            <TableCell>
              {
                field === 'geolocation' ? `${hit._source[field].latitude} / ${hit._source[field].longitude}` : hit._source[field]
              }
            </TableCell>
          ))
        }
      </TableRow>
    ))

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headings}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    )
  } else {
    return ''
  }

}

const App = styled.div`
  display: grid;
  grid-template-columns: auto 0.6fr auto;

  .container {
    grid-column: 2;
  }

  main {
    form {
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;
    }
  }
`

export default () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Grommet>
      <Head>
        <title>Meteorite Landings</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <App>
        <section className="container">
          <Header />
          <Box as="main">
            <Form
              onSubmit={event => {
                setLoading(true);
                fetch(`search?query=${event.value.query}`)
                  .then(resp => resp.json())
                  .then((json) => {
                    setResults(json)
                    setLoading(false)
                  })
                  .catch(console.error)
              }}
            >
              <FormField name="query" label="Search" />
              <Button type="submit" primary label="Submit" />
            </Form>
            {
              loading ?
                <ReactLoading type='spin' color='lightgrey' height={60} width={60} />
                : <TableResults hits={results.hits} />
            }
          </Box>
        </section>
      </App>
    </Grommet>
  )
}
