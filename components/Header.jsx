import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'

const Header = ({ className }) => (
  <Box as="header" className={className}>
    <img src="/static/logo.png" alt="Meteorite Landings" />
  </Box>
)

export default styled(Header)`
  background: white;
  border-radius: 5px;
  height: 125px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  margin-top: 10vw;
`

