/*
This file contains an example binary search algoirthm and an example input.
*/

/**The function which runs an example binary search algorithm.*/
function algBinarySearch() {

    /**An example of binary search algorithm.*/
    function binarySearch(sortedArray: number[], key: number) {
        let start = 0;
        let end = sortedArray.length - 1;

        while (start <= end) {
            let middle = Math.floor((start + end) / 2);

            if (sortedArray[middle] === key) {
                // found the key
                return middle;
            } else if (sortedArray[middle] < key) {
                // continue searching to the right
                start = middle + 1;
            } else {
                // search searching to the left
                end = middle - 1;
            }
        }
        // key wasn't found
        return -1;
    }

    binarySearch([420, 336, 201, 176, 101, 98, 90, 69, 63, 43, 12, 1], 69);

}