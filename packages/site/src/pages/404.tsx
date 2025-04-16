import React from 'react'
import { CardContainer, Container } from '../components/styledComponents'
import { ConnectButton, Card, ReloadButton } from '../components'

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
