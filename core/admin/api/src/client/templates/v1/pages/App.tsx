import * as React from 'react';
import Layout from './components/Layout';

const App = ({ websiteName, colorScheme }: any) => {
  return (
    <Layout websiteName={websiteName} colorScheme={colorScheme}>
      Hello World
    </Layout>
  );
};

export default App;
