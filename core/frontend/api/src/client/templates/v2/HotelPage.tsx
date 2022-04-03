import * as React from "react";

import {MainWrapper, GlobalStyle} from "./styled";
import Breadcrumbs from "./components/Breadcrumbs";

const HomePage = () => {
    return <MainWrapper>
        <Breadcrumbs/>
    </MainWrapper>;
};

export default HomePage;