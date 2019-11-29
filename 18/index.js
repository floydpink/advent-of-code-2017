const fs = require('fs');

const inputPath = 'input.txt';

const debug = (...args) => {
    if (false) {
        console.log(...args);
    }
};

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);

const rawInstructions = fs.readFileSync(inputPath)
    .toString()
    .split('\n')
    .map(trimFunc);

let lastPlayedFreq = null;
let recoveredFreq = null;

const messageQueue = [[], []];
const programs = [];
let program1SendCounter = 0;

let insId = 0;

const printMQ = registers => {
    // debug(`registers: ${[...registers.entries()]}`);
    // debug(`\nmessageQueue[0]: ${messageQueue[0]}`);
    // debug(`messageQueue[1]: ${messageQueue[1]}\n`);
    if (program1SendCounter % 10000 === 0 || (program1SendCounter > 410000 && program1SendCounter < 418000)) {
        debug(`program1SendCounter: ${program1SendCounter}`);
    }
};

class Instruction {
    constructor(pgmId, type, a, b = null) {
        this.id = insId++;
        this.pgmId = pgmId;
        this.isPart2 = pgmId > 0;
        this.type = type;
        this.a = a;
        this.b = b;
    }

    toString() {
        return `${this.type} ${this.a} ${this.b}`;
    }

    run(registers, instrNumber) {
        const programId = this.pgmId - 1;
        // debug(`[${programId}] running instr #${this.id} - ${this.type} ${this.a} ${this.b}...`);
        //
        // debug(`registers (B): ${[...registers.entries()]}`);

        // debug(`instruction #${instrNumber}: ${this}`);

        let next = 1;
        const b = this.b != null
            ? (registers.has(this.b) ? registers.get(this.b) : parseIntFunc(this.b))
            : null;
        switch (this.type) {
            case 'snd':
                lastPlayedFreq = registers.get(this.a);
                if (this.isPart2) {
                    const val = registers.has(this.a) ? registers.get(this.a) : parseIntFunc(this.a);
                    this.send(val, programId);
                    printMQ(registers);
                }
                break;
            case 'set':
                registers.set(this.a, b);
                break;
            case 'add':
                registers.set(this.a, registers.get(this.a) + b);
                break;
            case 'mul':
                registers.set(this.a, registers.get(this.a) * b);
                break;
            case 'mod':
                registers.set(this.a, registers.get(this.a) % b);
                break;
            case 'rcv':
                if (registers.get(this.a) !== 0) {
                    recoveredFreq = lastPlayedFreq;
                }
                if (this.isPart2) {
                    if (messageQueue[programId].length === 0) {
                        next = 0;
                    } else {
                        const receivedVal = this.receive(programId);
                        debug(`[${programId}] has received value: ${receivedVal}`);
                        registers.set(this.a, receivedVal);
                        printMQ(registers);
                    }
                }
                break;
            case 'jgz':
                const val = registers.has(this.a) ? registers.get(this.a) : parseIntFunc(this.a);
                if (val > 0) {
                    next = b;
                }
                break;
        }

        // debug(`registers (A): ${[...registers.entries()]}`);
        // debug(`next instruction offset: ${next}\n`);

        return next;
    }

    send(val, programId) {
        debug(`[${programId}] is sending value: ${val}`);
        const targetPgm = programId === 0 ? 1 : 0;
        messageQueue[targetPgm].push(val);
        programs[targetPgm].waiting = false;
        if (programId === 1) {
            program1SendCounter++;
        }
    }

    receive(programId) {
        return messageQueue[programId].shift();
    }
}

class Program {
    constructor(id, rawInstructions) {
        this.id = id;
        this.pgmId = id - 1;
        this.isPart2 = id > 0;

        this.registers = new Map();
        this.instructions = [];

        this.waiting = false;

        this.next = 0;

        this.incomplete = false;

        insId = 0;
        this.parseInstructions(rawInstructions);
    }

    parseInstructions(rawInstructions) {
        for (let instr of rawInstructions) {
            const [type, a, b] = instr.split(' ').map(trimFunc);
            if (!Number.isInteger(parseIntFunc(a)) && !this.registers.has(a)) {
                if (this.isPart2 && a === 'p') {
                    this.registers.set(a, this.id - 1);
                } else {
                    this.registers.set(a, 0);
                }
            }
            this.instructions.push(new Instruction(this.id, type, a, b));
        }

        /*
                debug(`[${this.id}] > registers:`);
                debug(this.instructions);
                debug('');
        */

        debug(`[${this.id}] > registers:`);
        debug([...this.registers.entries()]);
        debug('');
    }

    runProgram(other = null) {
        if (other && this.waiting && other.waiting) { // deadlock
            console.log(`\npart 02 answer: ${program1SendCounter}\n`);
            return;
        }

        debug(`running program id: ${this.id}`);

        while (this.next >= 0 && this.next < this.instructions.length) {
            let prevInstr = this.instructions[this.next];
            let next = prevInstr.run(this.registers, this.next);
            this.next += next;
            this.waiting = next === 0;

            if (!this.isPart2) {
                if (recoveredFreq !== null) {
                    console.log(`part 01 answer: ${recoveredFreq}`);
                    break;
                }
            } else {
                // part 2 - figure out terminations

                if (this.waiting) {
                    debug(`${this.pgmId} is delayed after a ${prevInstr.type} and is ${this.waiting ? '' : 'not'} waiting...`);
                    printMQ(this.registers);
                    this.incomplete = true;
                    setTimeout(() => other.runProgram(this), 10);
                    break;
                }
            }
        }

        if (!this.incomplete) {
            debug(`${this.pgmId} completed successfully...\n`);
        }
    }
}

// part 01
const program0 = new Program(0, rawInstructions);
program0.runProgram();

// part 02
const program1 = new Program(1, rawInstructions);
const program2 = new Program(2, rawInstructions);

programs.push(program1);
programs.push(program2);

program1.runProgram(program2);
