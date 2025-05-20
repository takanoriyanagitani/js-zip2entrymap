import { url2buffer } from "./req.mjs";
import { bind, lift } from "./io.mjs";

/** @import  { IO } from "./io.mjs" */

/** @import  { ZipEntry } from "./zitem.mjs" */

/**
 * @param {function(): string} jszipSupportInfo
 * @param {function(ArrayBuffer): IO<Map<string, ZipEntry>>} zipBufferToEntryMap
 */
export function sub(
  jszipSupportInfo,
  zipBufferToEntryMap,
) {
  return Promise.resolve()
    .then((_) => {
      /** @type string */
      const zipUrl = "input.zip";

      /** @type IO<ArrayBuffer> */
      const ibuf = url2buffer(zipUrl);

      /** @type IO<Map<string, ZipEntry>> */
      const imap = bind(ibuf, zipBufferToEntryMap);

      /** @type IO<MapIterator<string>> */
      const inames = bind(imap, lift((m) => Promise.resolve(m.keys())));

      /** @type HTMLElement? */
      const odiv = document.getElementById("app-root");

      if (!odiv) return Promise.reject("div not found");

      /** @type HTMLElement */
      const div = odiv;

      /** @type DocumentFragment */
      const fragment = new DocumentFragment();

      /** @type IO<Void> */
      const iappended = bind(
        inames,
        lift((names) => {
          return Promise.resolve()
            .then((_) => {
              for (const filename of names) {
                /** @type HTMLDivElement */
                const cdiv = document.createElement("div");

                cdiv.textContent = filename;
                fragment.appendChild(cdiv);
              }

              div.textContent = "";
              div.append(fragment);
            });
        }),
      );

      return iappended();
    });
}
