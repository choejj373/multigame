"use strict"

class MessageQueue{
    #messageQueue = [];
    pushBack( any ){
        this.#messageQueue.push( any );
    }

    popFront(){
        if( this.#messageQueue.length > 0 ){
            return this.#messageQueue.shift();
        }
    }
    size(){
        return this.#messageQueue.length;
    }
}

module.exports = new MessageQueue();