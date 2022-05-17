/*
This file contains a function which runs an example of a gcd algorithm.
*/

/**A function which runs an algorithm example.*/
function algGCD() {

    /**A gcd algorithm example.*/
    function gcd(a: number, b: number) {
        while (a !== b) {
            if (a > b) {
                a -= b;
            }
            else {
                b -= a;
            }
        }
        return a;
    }
    gcd(48, 18);
}