import React from "react";
import Category from "../Category";

import Clip from "../Clip";

function Container() {
  return (
    <div className="w-10/12 mx-auto">
      <Category />
      <div className="grid gap-10 grid-cols-2">
        <Clip />
        <Clip />
        <Clip />
        <Clip />
        <Clip />
        <Clip />
        <Clip />
      </div>
    </div>
  );
}

export default Container;
