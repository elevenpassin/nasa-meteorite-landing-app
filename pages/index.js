import React, { useState } from 'react'
import Link from 'next/link'
import { Grommet, Heading, Form, FormField, Button, Table, TableHeader, TableRow, TableCell, TableBody } from 'grommet'
import ReactLoading from 'react-loading';



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

export default () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Grommet>
      <Heading>
        Meteorite Landings
      </Heading>
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
    </Grommet>
  )
}
