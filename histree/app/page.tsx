"use client";

import App from "./App";
import { GlobalWrapper } from "./Context";

export default function Page() {
  return (
    <GlobalWrapper>
      <App />
    </GlobalWrapper>
  );
}
