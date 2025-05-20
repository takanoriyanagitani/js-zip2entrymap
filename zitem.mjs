/**
 * @typedef { object } ZipItem
 * @property { string } filename
 * @property { boolean } isDir
 * @property { Date } modified
 * @property { string } comment
 * @property { string } compression
 */

/**
 * @typedef { object } ZipEntry
 * @property { ZipItem } meta
 * @property { Blob } data
 */
