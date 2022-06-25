
declare module 'scanner.js';
// {
    
//     export type scanCllback= (successful:boolean,mesg:string,response:any)=>void;
//     export interface ScanRequest {
//         "request_id"?: string,
//         "processing_strategy"?: string, // default value is "default" - process image after each scan immediately.

//         // --------------- Scan Settings ---------------
//         "twain_cap_setting"?: {
//             "ICAP_PIXELTYPE"?: string, // Preferrs GRAY, fall back Color; TWPT_BW
//             "ICAP_XSCALING/RESET"?: string, // Resets a capability
//             "ICAP_XRESOLUTION"?: string, // Sets the resolution
//             "ICAP_YRESOLUTION"?: string, // Sets the resolution
//             "CAP_AUTOFEED"?: boolean, // TW_BOOL, No default; TRUE to use ADF or FALSE to use Flatbed
//             "ICAP_FRAMES"?:  string // Scan part of the image only
//         },

//         "prompt_scan_more"?:  boolean, /** Default value: false */

//         "i18n"? : {
//             "lang"?: string /** en (default) | de | es | fr | it | ja | pt | zh | user (user's OS locale) */
//         },

//         // --------------- Processing Settings ---------------
//         // Blank page detection/discard
//         "detect_blank_pages"?: string, /** Default value: false */
//         "blank_page_threshold"?: string,
//         "blank_page_margin_percent"?: string,
//         "blank_page_policy"?: string, /** "keep" (default) or "remove" */

//         // Barcode reading
//         "recognize_barcodes"?: string, /** Default value: false */
//         "barcodes_dpi"?: number, /** DPI used to recognize barcodes, default value is 100; use high values for smaller barcodes. */
//         "barcodes_settings"?: string, /** Additional barcode settings if any */

//         // Document separation
//         "doc_separators"?: string[],
//         // [ /** applicable for PDF and TIFF formats only. */
//         //     "TWEI_PATCHCODE:5:DOC_SEP", /**  */
//         //     "blank:DOC_SEP",  /** Use blank sheets to separate documents. */
//         //     "barcode:abc*:DOC_NEW" /** Pages with barcodes starting with abc mark beginning of documents (inclusive). */
//         // ],

//         // --------------- Output Settings ---------------
//         "output_settings"?: [
//             {
//             "type"?: string, // return-base64, save, upload[-thumbnail]
//             "format"?: string, // bmp, png, jpg, tif, pdf // optional, default is jpg
//             "thumbnail_height"?: number, // only for -thumbnail; optional, default is 200
//             "save_path"?: string, //"${TMP}\\${TMS}${EXT}", // only for save

//             /** JPG realted */
//             "jpeg_quality"?: string, // optional, default is 80, only for JPG format

//             /** TIFF Related */
//             "tiff_compression"?: string, // optional, default is empty; only for TIFF format
//             "tiff_force_single_page"?: string,

//             /** PDF Related */
//             "pdf_force_black_white"?: string, // optional, default is false; only for PDF format
//             "pdfa_compliant"?: string,
//             "pdf_owner_password"?: string,
//             "pdf_user_password"?: string,
//             "pdf_text_line"?: string,//"Asprise PDF/A scan by ${COMPUTERNAME}/${USERNAME} on ${DATETIME}",
//             "exif"?: {
//                 "DocumentName"?: string,//"PDF/A Scan",
//                 "UserComment"?: string,//"Scanned using Asprise software"
//             },

//             /** Upload Related */
//             "upload_after_all_done"?: string, // default is true
//             "upload_one_by_one"?: string, // default is false
//             "upload_target"?: {
//                 "url"?: string,
//                 "method"?: string,
//                 "max_retries"?: 2,
//                 "post_fields"?: Object,
//                 // { // Optional additional POST fields
//                 // "provider": "Asprise"
//                 // },
//                 "post_file_field_name"?: string, // Field name of of uploaded files
//                 "post_files"?: string[],
//                 //  [ // Optional additional files to be uploaded
//                 // "C:\\_tmp0.jpg"
//                 // ],
//                 "cookies"?: string,//"name=Asprise; domain=asprise.com", // Optional cookies to pass
//                 "auth"?: string,//"user:pass", // Optional auth info
//                 "headers"?: string[],
//                 // [ // Optional additioanl headers
//                 // "Referer: http://asprise.com"
//                 // ],
//                 "log_file"?: string, // Log HTTP operations to a file for debug purpose
//                 "max_operation_time"?: number, // Max operation timeout in seconds.
//                 "to_file"?: string // Save the HTTP response to a file.
//             }
//             }
//         ],

//         // --------------- Other Return Options: image info ---------------
//         "retrieve_caps"?: string[],
//         //  [ // caps to be retrieved for each scan
//         //     "ICAP_PIXELTYPE",
//         //     "ICAP_XRESOLUTION",
//         //     "ICAP_UNITS",
//         //     "ICAP_FRAMES"
//         // ],

//         "retrieve_extended_image_attrs"?: string[]
//         //  [ // device returned extended image attributes
//         //     "BARCODE",
//         //     "TWEI_PATCHCODE"
//         // ]

                
//         }
//     class Scanner {
//         static createDomElementFromModel:(a:any)=>any;
//         static getScannedImages:(response: any, arg1: boolean, arg2: boolean) =>any;
       
//         static scan:(callback:scanCllback,requestSpecification:ScanRequest, useAspriseDialog?:boolean,showScannerUI?:boolean )=>number;
//     }
//     export default Scanner;

// }
