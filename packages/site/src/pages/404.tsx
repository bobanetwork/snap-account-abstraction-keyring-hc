import React from 'react'
import { Card } from '../components'
import { CardContainer, Container } from '../components/styledComponents'

const Page404 = () => {
  return (
    <Container>
      <CardContainer>
        <Card
          content={{
            description: 'Something went wrong please reload app',
            button: (
              <a href="/">Reload Page</a>
            ),
          }}
        // disabled={!state.hasMetaMask}
        />
      </CardContainer>
    </Container>
  )
}

export default Page404
