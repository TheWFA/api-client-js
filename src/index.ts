export class SampleService {
    async sampleMethod(numbers: {
        number1: number;
        number2: number;
    }): Promise<number> {
        return numbers.number1 + numbers.number2;
    }
}
