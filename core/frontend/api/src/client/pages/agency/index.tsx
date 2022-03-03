import React from 'react';
import { NextPage } from 'next';
import { withRouter } from 'next/router';


const PageComponent: NextPage = () => {
    return (<h1>Hello World!</h1>)
};

export default withRouter(PageComponent);