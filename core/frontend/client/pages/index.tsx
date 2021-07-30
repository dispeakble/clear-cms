import {Helmet} from "react-helmet";
import React from 'react';

import styles from '../styles/Home.module.css'
import HomeModule from "../context/home";

class Home extends React.Component<any, any>{
  render() {
    return (
      <>
        <Helmet
          title="Home"
          meta={[{ property: 'og:title', content: 'Next index page' }]}
        />
        <div className={styles.container}>
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
