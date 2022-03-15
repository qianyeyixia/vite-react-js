import React from "react"
import {HashRouter as Router, Route } from "react-router-dom"

const App = () => {

  return (
    <Router>
      <Route
        path="/"
        key="container"
        render={(props) => <Container {...props} />}
      />
  </Router>
  )
}

export default App
