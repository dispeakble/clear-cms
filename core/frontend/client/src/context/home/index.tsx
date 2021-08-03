import React from "react";
import Link from "next/link";

class HomeModule extends React.Component<any, any>{
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Link href={`/page`}>
          Page route
        </Link>
      </div>
    );
  }
}

export default HomeModule
