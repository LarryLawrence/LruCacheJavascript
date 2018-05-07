/**
 * An LruCache tool by Chang Liu 05/2018.
 */
export default function LruCache(capacity) {
    this.map = {};
    this.size = 0;
    this.head = new DoublyLinkedNode();
    this.tail = new DoublyLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.capacity = capacity;
};

/**
 * Returns the value for the given key if it exists in the cache. If a value was returned,
 * it is moved to the head of the queue.
 */
LruCache.prototype.get = function (key) {
    if (!this.map[key]) {
        return -1;
    }
    const targetNode = this.map[key];
    targetNode.remove();
    targetNode.addToGivenHead(this.head);
    return targetNode.val;
};

/**
 * Caches the value for the key. The value is moved to the head of the queue.
 */
LruCache.prototype.put = function (key, val) {
    if (this.map[key]) {
        this.map[key].remove();
        this.size -= 1;
    }
    let node = new DoublyLinkedNode(key, val);
    node.addToGivenHead(this.head);
    this.map[key] = node;
    this.size += 1;
    if (this.size > this.capacity) {
        let lastNode = this.popTail();
        delete this.map[lastNode.key];
        this.size -= 1;
    }
};

LruCache.prototype.popTail = function () {
    let res = this.tail.prev;
    res.remove();
    return res;
};

/**
 * Returns a copy of the current contents of the cache, ordered from MOST
 * recently accessed to LEAST recently accessed.
 */
LruCache.prototype.snapshot = function () {
    let realHead = this.head.next;
    let snap = [];
    while (realHead && realHead.next) {
        snap.push(realHead);
        realHead = realHead.next;
    }
    return snap;
};

function DoublyLinkedNode(key = null, val = null) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
}

/**
 * Remove current node from the doubly linked list.
 */
DoublyLinkedNode.prototype.remove = function () {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    this.prev = null;
    this.next = null;
};

/**
 * Add current node after the fake head.
 * @param head The given fake head node.
 */
DoublyLinkedNode.prototype.addToGivenHead = function (head) {
    if (!head) {
        return;
    }
    this.prev = head;
    this.next = head.next;
    head.next.prev = this;
    head.next = this;
};
