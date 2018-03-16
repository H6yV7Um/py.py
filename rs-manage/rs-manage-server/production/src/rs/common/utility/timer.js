oojs.define({
    name: 'timer',
    namespace: 'rs.common.utility',
    taskArray: {},
    set: function (taskName, pointName) {
        var task = this.taskArray[taskName];

        //create task
        if (!task) {
            task = this.taskArray[taskName] = {};
            task.startTime = new Date();
            task.latestTime = task.startTime;
            task.index = 0;
        }

        //create point
        var point = task[pointName] = this.createPoint(pointName);
		point.spendTime = point.startTime.getTime() - task.latestTime.getTime() ;
        point.index = task.index + 1;
        task.index = task.index + 1;
		task.latestTime = point.startTime;	
    },
	
	reset: function(){
		this.taskArray = {};
	},
	
    createPoint: function (pointName) {
        var point = {
            startTime: new Date(),
            spendTime: 0
        };
        return point;
    },
	
	getAll : function(){
		return this.taskArray;
	}

});