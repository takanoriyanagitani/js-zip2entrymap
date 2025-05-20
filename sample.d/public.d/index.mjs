import { sub } from "./sub.mjs";

import { jszipSupportInfo, zipBufferToEntryMap } from "./index-min.mjs";

/** @import  { IO } from "./io.mjs" */

(() => {
  /** @type IO<Void> */
  const main = () => {
    return sub(
      jszipSupportInfo,
      zipBufferToEntryMap,
    );
  };

  main()
    .catch(console.error);
})();
