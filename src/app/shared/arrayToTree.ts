export interface Item {
    id: string
    parentId: string | null,
    [key: string]: any,
}


export interface TreeItem {
    data: Item
    children: TreeItem[]
}

export interface Config {
    id: string,
    parentId: string,
}

/**
 * Unflattens an array to a tree with runtime O(n)
 */
export function arrayToTree(items: any[], config: Config = { id: 'id', parentId: 'parentId' }): TreeItem[] {
    // the resulting unflattened tree
    const rootItems: TreeItem[] = []

    // stores all already processed items with ther ids as key so we can easily look them up
    const lookup: { [id: string]: TreeItem } = {}

    // idea of this loop:
    // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
    // in the lookup object and fill it with the data of the parent later
    // if an item has no parentId, add it as a root element to rootItems
    for (const item of items) {
        const itemId = item[config.id]
        const parentId = item[config.parentId]

        // look whether item already exists in the lookup table
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // item is not yet there, so add a preliminary item (its data will be added later)
            lookup[itemId] = { data: null, children: [] }
        }

        // add the current item's data to the item in the lookup table
        lookup[itemId].data = item

        const TreeItem = lookup[itemId]

        if (parentId === null) {
            // is a root item
            rootItems.push(TreeItem)
        } else {
            // has a parent

            // look whether the parent already exists in the lookup table
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // parent is not yet there, so add a preliminary parent (its data will be added later)
                lookup[parentId] = { data: null, children: [] }
            }

            // add the current item to the parent
            lookup[parentId].children.push(TreeItem)
        }
    }







    return rootItems
}

export function unflatten(arr: any[], config: Config = { id: 'id', parentId: 'parentId' }) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem[config.id]] = arrElem;
        mappedArr[arrElem[config.id]]['children'] = [];
    }


    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem[config.parentId] && mappedArr[mappedElem[config.id]] && mappedArr[mappedElem[config.parentId]]) {
                mappedArr[mappedElem[config.parentId]]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}

export function spliceArrByPropVal(array: any, property: string, values: string) {
    let valuesArr = values.split(',');
    for (var i = 0, len = valuesArr.length; i < len; i++) {
        const indx = array.findIndex(e => e[property] == valuesArr[i])
        if (indx != -1) { array.splice(indx, 1) };


    }
    return array;
}

export function getUniqueArr(a: Array<any>, property: string) { //array,property
    var flags = [], output = [], l = a.length, i;
    for (i = 0; i < l; i++) {
        if (flags[a[i][property]]) continue;
        flags[a[i][property]] = true;
        output.push(a[i]);
    }


    return output;
}
export function getUniqueValues(rows: Array<any>, property: string) { //array,property
    let output = [];
    var flags = [], l, i;
    if (rows.length > 0) {
        rows.forEach(item => {
            if (flags[item[property]]) { } else {
                flags[item[property]] = true;
                output.push(item[property]);
            }
        });
        return output;
    }
}
export function sortArrayOnNumericProp(rows: Array<any>, property: string) { //array,property
    let sortedArray = rows.sort((n1, n2) => {
        if (+n1[property] > +n2[property]) {
            return 1;
        }

        if (+n1[property] < +n2[property]) {
            return -1;

        }

        return 0;
    });
    return sortedArray;
}

export function sortArrayOnDateProp(rows: Array<any>, property: string) { //array,property
    // year: 2020, month: 2, day: 10}
   
    let sortedArray = rows.sort((n1, n2) => {
        if (n1[property]['year'] >= n2[property]['year'] && n1[property]['month'] >= n2[property]['month'] && n1[property]['day'] >= n2[property]['day']) {
            return 1;

        } else {
            return -1;
        }
        return 0;

    });
    return sortedArray;
}
export function CompareDateProp(Date1: string, Date2: string): boolean { //array,property
    // year: 2020, month: 2, day: 10}
    if (Date1['year'] == Date2['year'] && Date1['month'] == Date2['month']
        && Date1['day'] == Date2['day']) {
        return true;

    } else {
        return false;
    }

}
export function sortArrayOnNGBDateProp(rows: Array<any>, property: string) { //array,property
    let sortedArray = rows.sort((n1, n2) => {
        if (n1[property]['year'] >= n2[property]['year'] && n1[property]['month'] >= n2[property]['month'] && n1[property]['day'] >= n2[property]['day']) {
            return -1;
        }

        else {
            return 1;
        }

        return 0;
    });
    return sortedArray;
}

/**
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
export function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
export function filterByNgbDate(rows: Array<any>, property: string, dateFrom: any, dateTo: any) {

    if ((dateTo == undefined || dateTo == '') && dateFrom && dateFrom['year'] > 0) {
        let sortedArray = rows.filter(n1 => {
            if (n1[property]['year'] >= dateFrom['year'] && n1[property]['month'] >= dateFrom['month'] && n1[property]['day'] >= dateFrom['day']) {
                return true;
            } else {
                return false
            }

        });
        return sortedArray;
    }
    if ((dateFrom == undefined || dateFrom == '') && dateTo && dateTo['year'] > 0) {
        let sortedArray = rows.filter(n1 => {
            if (n1[property]['year'] <= dateTo['year'] && n1[property]['month'] <= dateTo['month'] && n1[property]['day'] <= dateTo['day']) {
                return true;
            } else {
                return false
            }

        });
        return sortedArray;
    }
    if (dateFrom && dateTo && dateTo['year'] > 0 && dateFrom['year'] > 0) {
        let sortedArray = rows.filter(n1 => {
            var condtion1 = (n1[property]['year'] <= dateTo['year'] && n1[property]['month'] <= dateTo['month'] && n1[property]['day'] <= dateTo['day']);
            var condtion2 = (n1[property]['year'] >= dateFrom['year'] && n1[property]['month'] >= dateFrom['month'] && n1[property]['day'] >= dateFrom['day']);
            if (condtion1 && condtion2) {
                return true;
            } else {
                return false
            }

        });
        return sortedArray;
    }
    return rows;
}



export function findUnique(arr, predicate) {
    var found = {};
    arr.forEach(d => {
        found[predicate(d)] = d;
    });
    return Object.keys(found).map(key => found[key]);
}