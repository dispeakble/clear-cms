import {Helmet} from "react-helmet";
import React from 'react';

import HomeModule from "../context/home";

class Home extends React.Component<any, any>{
  render() {
    return (
      <>
        <Helmet
          title="Home"
          meta={[{ property: 'og:title', content: 'Next index page' }]}
        />
        <div>
          <h2>
            Hello!
          </h2>
          <HomeModule />
        </div>
      </>
    )
  }
}

export default Home
