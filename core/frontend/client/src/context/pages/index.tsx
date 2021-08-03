import React from "react";
import {connect} from 'react-redux'
import {Dispatch} from "redux";
import Link from "next/link";

import {addPageRequest} from "../pages/state/actions";
import {AppState} from "../../infrastructure/store/appState";
import {PageState} from "../pages/state/types";

class PageModule extends React.Component<{dispatch: Dispatch, pages: PageState}, any>{

  addPage() {
    this.props.dispatch(addPageRequest());
  }

  render() {
    return (
      <div>
        <p>
          <button onClick={() => this.addPage()}>
            add page
          </button>
        </p>
        {this.props.pages.data.map((val) => (
          <p key={`link-val-${val}`}>
            <Link href={`/page/${val}`}>
              {`page link ${val}`}
            </Link>
          </p>
        ))}
      </div>
    );
  }
}

export default connect((state: AppState) => state)(PageModule);
