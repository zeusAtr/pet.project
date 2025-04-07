import { arrayA, arrayB } from "../data/arrays.to.compare";

it('Compare 2 arrays and print diff', async () => {

    const onlyInArr1 = arrayA.filter((item) => !arrayB.includes(item));
    const onlyInArr2 = arrayB.filter((item) => !arrayA.includes(item));

    const difference = [...onlyInArr1, ...onlyInArr2];

    console.error('Difference:', difference);
})