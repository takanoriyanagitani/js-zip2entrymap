import JSZip from "jszip";

import { bind } from "./io.mjs";

/** @import { IO } from "./io.mjs" */

/** @import { ZipItem, ZipEntry } from "./zitem.mjs" */

/** @type { function(): string } */
export function jszipSupportInfo() {
  return JSON.stringify(JSZip.support);
}

/** @type { function(ArrayBuffer): IO<JSZip> } */
export function buffer2jszip(buf) {
  return () => JSZip.loadAsync(buf);
}

/** @type function(JSZip.JSZipObject): ZipItem */
export function zobj2item(zobj) {
  return Object.freeze({
    filename: zobj.name,
    isDir: zobj.dir,
    modified: zobj.date,
    comment: zobj.comment,
    compression: zobj.options.compression,
  });
}

/** @type function(JSZip.JSZipObject): IO<Blob> */
export function zobj2blob(zobj) {
  return () => zobj.async("blob");
}

/** @type function(JSZip.JSZipObject): IO<ZipEntry> */
export function zobj2entry(zobj) {
  /** @type IO<Blob> */
  const iblob = zobj2blob(zobj);

  return bind(
    iblob,
    (blob) => () =>
      Promise.resolve(Object.freeze({
        meta: zobj2item(zobj),
        data: blob,
      })),
  );
}

/** @type function(JSZip): Object<string, JSZip.JSZipObject> */
export function zip2files(z) {
  return z.files;
}

/**
 * @param { JSZip } z
 * @returns { IO<Map<string, ZipEntry>> }
 */
export function zip2entryMap(z) {
  return () => {
    /** @type Object<string, JSZip.JSZipObject> */
    const fmap = zip2files(z);

    /** @type Array<[string, JSZip.JSZipObject]> */
    const pairs = Object.keys(fmap).map((key) => {
      return [key, fmap[key]];
    });

    /** @type Array<IO<[string, ZipEntry]>> */
    const converted = pairs.map((pair) => {
      const [key, val] = pair;

      /** @type IO<ZipEntry> */
      const ientry = zobj2entry(val);

      return bind(ientry, (entry) => () => Promise.resolve([key, entry]));
    });

    /** @type Array<Promise<[string, ZipEntry]>> */
    const ppairs = converted.map((i) => i());

    /** @type Promise<Map<string, ZipEntry>> */
    const pmap = Promise.resolve()
      .then(async (_) => {
        /** @type Map<string, ZipEntry> */
        const m = new Map();
        for await (const [key, val] of ppairs) {
          m.set(key, val);
        }

        return m;
      });

    return pmap;
  };
}

/** @type function(ArrayBuffer): IO<Map<string, ZipEntry>> */
export function zipBufferToEntryMap(buf) {
  /** @type IO<JSZip> */
  const izip = buffer2jszip(buf);

  return bind(izip, zip2entryMap);
}
