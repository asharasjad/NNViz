export class MLPModel {
    constructor() {
        // Architecture: 1 Input -> 2 Hidden -> 1 Output
        // Weights 1: 2x1 matrix (Hidden size x Input size)
        // Biases 1: 2x1 vector (Hidden size)
        // Weights 2: 1x2 matrix (Output size x Hidden size)
        // Biases 2: 1x1 vector (Output size)

        this.randomize();
    }

    randomize() {
        this.w1 = [Math.random() * 2 - 1, Math.random() * 2 - 1]; // 2 weights from input to hidden
        this.b1 = [Math.random() * 2 - 1, Math.random() * 2 - 1]; // 2 biases for hidden nodes

        this.w2 = [Math.random() * 2 - 1, Math.random() * 2 - 1]; // 2 weights from hidden to output
        this.b2 = [Math.random() * 2 - 1]; // 1 bias for output node
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    forward(input) {
        // Hidden Layer
        const h1_in = input * this.w1[0] + this.b1[0];
        const h2_in = input * this.w1[1] + this.b1[1];

        const h1_out = this.sigmoid(h1_in);
        const h2_out = this.sigmoid(h2_in);

        // Output Layer
        const o_in = (h1_out * this.w2[0]) + (h2_out * this.w2[1]) + this.b2[0];
        const o_out = this.sigmoid(o_in);

        return {
            input,
            hidden: [h1_out, h2_out],
            output: o_out,
            weights: { w1: this.w1, w2: this.w2 },
            biases: { b1: this.b1, b2: this.b2 }
        };
    }
}
