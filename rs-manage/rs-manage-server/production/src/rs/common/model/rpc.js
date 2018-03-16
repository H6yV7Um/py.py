oojs.define({
    name: 'rpc',
    namespace: 'rs.common.model',
    deps: {
        nsHead: 'rs.common.model.nsHead'
    },
    messageProcess: function (option) {
        var data = option.data;
        var socket = option.socket;
        var processFunction = option.processFunction;
		
        var dataBuffer;
        if (socket.preBuffer) {
            dataBuffer = Buffer.concat([socket.preBuffer, data]);
            socket.preBuffer = null;
        }
        else {
            dataBuffer = data;
        }

        //处理nsHead
        var nsHead;
        var nsHeadBuffer;
        if (dataBuffer.length && dataBuffer.length >= 36) {
            nsHeadBuffer = dataBuffer.slice(0, 36);
            nsHead = this.nsHead.readNsHead(nsHeadBuffer);
        }
        else {
            socket.preBuffer = dataBuffer;
            dataBuffer = null;
            nsHeadBuffer = null;
            return;
        }

        //处理pb部分
        var pbData = dataBuffer.slice(36);
        var multiData = false;
        if (nsHead.magicNumber === 4218459028 && nsHead.bodyLength && pbData.length >= nsHead.bodyLength) {
            if (pbData.length === nsHead.bodyLength) {
                multiData = false;
            }
            else if (pbData.length > nsHead.bodyLength) {
                multiData = true;
            }
        }
        else {
            socket.preBuffer = dataBuffer;
            dataBuffer = null;
            nsHeadBuffer = null;
            pbData = null;
            return;
        }

        var msgData = pbData.slice(0, nsHead.bodyLength);
        var msg = this.TemplateRequestInfo.decode(msgData);

        processFunction(msg);

        if (multiData) {
            var leftData = pbData.slice(nsHead.bodyLength);
            this.messageProcess({
                data: leftData,
                socket: socket,
                processFunction: processFunction
            });
        }

    }

});