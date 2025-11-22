class Student {

    static STATE_APPROVED = 'approved';
    static STATE_RECOVERY = 'recovery'
    static STATE_FAILED = 'failed';

    #myState;

    sendMessage() {
        this.#myState.sendMessage();
    }

    constructor() {
        this.#myState = new ApprovedState();
    }

    changeState(newState) {
        if (newState === Student.STATE_APPROVED) {
            this.#myState = new ApprovedState();
        } else if (newState === Student.STATE_RECOVERY) {
            this.#myState = new RecoveryState();
        } else if (newState === Student.STATE_FAILED) {
            this.#myState = new FailedState();
        }
    }
}