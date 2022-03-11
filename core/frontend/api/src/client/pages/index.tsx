import { NextPage } from 'next';
import PageContent from "../helpers/PageContent";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {
    return PageContent.renderContent(props);
};

export async function getServerSideProps(context: any) {
    context.isHome = true;
    return PageContent.getServerSideProps(context);
}

export default withRouter(PageComponent);