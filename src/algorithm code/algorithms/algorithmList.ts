/*
The purpose of this file is to contain a list of the posible algorithms; their names and their corresponding functions.
*/

let algorithmList: { name: string, fnc: () => void }[] = [
    {
        name: "MergeSort",
        fnc: algMergeSort,
    },
    {
        name: "Euclid (GCD)",
        fnc: algGCD
    },
    {
        name: "Bubblesort",
        fnc: algBubbleSort
    },
    {
        name: "Binary Search",
        fnc: algBinarySearch
    }
]