function algGCD(){    
    function gcd(a : number, b : number) {
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