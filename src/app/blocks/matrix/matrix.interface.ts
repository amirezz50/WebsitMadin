export interface MatrixEntry {
  serial?: number,
  code: string,
  entryType?: number,
  value: string,
  notes?: string,
  _date?: Date,
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  inOutFlag?: number,
  emrNonCodedEntriesStpSerial?: number

  // optional data to save
  regPatServiceSerial?: number;
  serviceId?: number;
  placeCode?: number;
  visitSerial?: number;
  patCode?: number;
  orderDetailSerial?: number;
}

export interface MatrixCategory {
  code?: string,
  mappingCode?: number;
  nameAr: string,
  nameEn?: string,
  catType?: number,
  hour?: number,
  minute?: number,
  parentCode?: string,
  inputType?: string,
  markingType?: string,
  cssClass?: string,
  subcategories?: MatrixCategory[]
  subMatrix?: MatrixData
}
export interface EntryType {
  code: string,
  nameAr: string,
  nameEn: string
}

export interface MatrixData {
  Xcategories: MatrixCategory[],
  Ycategories: MatrixCategory[],
  rowSummaries?: Summary[],
  colSummaries?: Summary[],
  haveTimeAxis?: boolean,
  timeAxis: string

}
export interface MatrixStructure {
  bodyheaders: Cell[],
  bodyRowCells: Cell[],
  headerRows: Row[],
  headerRowsCount?: number;
  bodyheadersCount?: number;
}

export interface Summary {
  nameAr: string,
  nameEn: string,
  formula: string,
  indx: number,
  groupBy: any
}
export interface Row {
  rowIndx?: number,
  cssClass?: string,
  innerHtml?: string,
  rowCells: Cell[]
}
export interface Cell {
  nameAr: string,
  nameEn: string,
  dataKey?: string,
  cssClass?: string,
  innerHtml?: string,
  rowspan: number,
  colspan: number,
  parents?: any[],
  parent?: MatrixCategory
  data?: MatrixCategory,
  summary?: Summary,
  dayOff?: number[],
  timeOff?: string[]
}
export interface Dummy {
  levels: Row[],
}
export interface BindingProps {
  'row': string,
  'col': string,
  'timeProp': string,
  'parent'?: string
}

export const MARKINGTYPES = {
  SINGLE_OVER_COL: 'SINGLE_OVER_COL',
  SINGLE_OVER_ROW: 'SINGLE_OVER_ROW'
}

export const INPUTTYPES = {
  INPUT: 'INPUT',
  INPUT_WITH_SUB_MATRIX: 'INPUT_WITH_SUB_MATRIX',
  MARK: 'MARK',
  SUMMARY: 'SUMMARY',
  CHECK_OVER_CELL: 'CHECK_OVER_CELL',
  SELECT: 'SELECT'
}
export const SUMMARY_TYPES = {
  SUM: 'SUM'
}

