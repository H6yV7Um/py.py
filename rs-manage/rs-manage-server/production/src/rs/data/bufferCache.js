/**  
����Bufferд��һ��LRU���棬capacityΪ����������Ϊ0ʱ����������
myCache = oojs.create(CacheLRU, {capacity:65535}); //���컺��
myCache.get(key); //��ȡ��Ϊkey�Ļ���ֵ
myCache.put(key, value); //д����Ϊkey�Ļ���ֵ
myCache.remove(key); //ɾ����Ϊkey�Ļ���ֵ
myCache.removeAll(); //��ջ���
myCache.info(); //����myCache������Ϣ
LRUԭ�������л������ݵ�key����hash��������ĳһ���ݽ���get��put����ʱ������key�ᵽ����ǰ�ˣ����£���������put���ݳ�������ʱ��ɾ������β�ˣ���ɣ��Ļ������ݡ�
hash���������ֱ�Ӷ�λkey��������������hash���󣬹ʶ�д���졣������������Ӱ���д�ٶȡ�
*/

oojs.define({
    name: 'bufferCache',
    namespace: 'rs.data',
    bufferCache: function (capacity) {
        this.capacity = capacity || Number.MAX_VALUE;
        this.data = {};
        this.hash = {};
        this.linkedList = {
            length: 0,
            head: null,
            end: null
        }
    },
    get: function (key) {
        key = '_' + key;
        var lruEntry = this.hash[key];
        if (!lruEntry) return;
        this.refresh(this.linkedList, lruEntry);
        return JSON.parse(this.data[key].toString());
    },

    put: function (key, value) {
        key = '_' + key;
        var lruEntry = this.hash[key];
        if (value === undefined) return this;
        if (!lruEntry) {
            this.hash[key] = {
                key: key
            };
            this.linkedList.length += 1;
            lruEntry = this.hash[key];
        }
        this.refresh(this.linkedList, lruEntry);
        this.data[key] = new Buffer(JSON.stringify(value));
        if (this.linkedList.length > this.capacity) this.remove(this.linkedList.end.key.slice(1));
        return this;
    },

    remove: function (key) {
        key = '_' + key;
        var lruEntry = this.hash[key];
        if (!lruEntry) return this;
        if (lruEntry === this.linkedList.head) this.linkedList.head = lruEntry.p;
        if (lruEntry === this.linkedList.end) this.linkedList.end = lruEntry.n;
        this.link(lruEntry.n, lruEntry.p);
        this.hash[key] = null;
        this.data[key] = null;
        this.linkedList.length -= 1;
        return this;
    },

    removeAll: function () {
        this.data = {};
        this.hash = {};
        this.linkedList = {
            length: 0,
            head: null,
            end: null
        }
        return this;
    },

    info: function () {
        var size = 0,
            data = this.linkedList.head;
        while (data) {
            size += this.data[data.key].length;
            data = data.p;
        }
        return {
            capacity: this.capacity,
            length: this.linkedList.length,
            size: size
        };
    },

    /**
     * ����������get��put����������key�ᵽ����head������ʾ����
     */
    refresh: function (linkedList, entry) {
        if (entry != linkedList.head) {
            if (!linkedList.end) {
                linkedList.end = entry;
            }
            else if (linkedList.end == entry) {
                linkedList.end = entry.n;
            }

            this.link(entry.n, entry.p);
            this.link(entry, linkedList.head);
            this.linkedList.head = entry;
            linkedList.head.n = null;
        }
    },

    /**
     * ������������������ӣ��γ�һ����
     */
    link: function (nextEntry, prevEntry) {
        if (nextEntry != prevEntry) {
            if (nextEntry) nextEntry.p = prevEntry;
            if (prevEntry) prevEntry.n = nextEntry;
        }
    },

    /**
     * ��������
     */
    dispose: function () {
        this.removeAll();
    }
});