//todos,包括文本内容，和是否被选中的标志  name, completed
Page({
  data: {
    input: '',
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: []
  },

  save: function () {
   // wx.setStorageSync('todo_list', this.data.todos)
    //wx.setStorageSync('todo_logs', this.data.logs)
    console.log("这里发生了存储");
    this.connect();

  },
  connect: function () {
     var sad =[];
     /*wx.getStorage({
      key: 'todo_list',
      success: function (res) {
        console.log("成功发送到后端" + res.data);
        sad = res.data
        console.log('sad'+sad[0].name);
        console.log("res.data.name:" + res.data[0].name);
      }
     }),*/

    wx.request({
      url: '-----------',
      method: 'GET',
      data: {
        todolist: this.data.todos//wx.getStorageSync('todo_list') 
       
       /* wx.getStorage({
          key: 'todo_list',
          success: function(res) {
            console.log("成功发送到后端"+res.data);
            console.log("res.data.name:" + res.data[1].name);
          },
        })*/
      },
      
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log("res.data.name:"+res.data.name);
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
   onLoad: function(){
  //load: function () {
    //var todos = wx.getStorageSync('todo_list')//加载阶段，从数据库 改写
    var todos;
    var that =this;
    //var that =this;
    wx.request({
      url: '-------',
      method: 'GET',
      data: {
        x: '1'//wx.getStorageSync('todo_list') 

        /* wx.getStorage({
           key: 'todo_list',
           success: function(res) {
             console.log("成功发送到后端"+res.data);
             console.log("res.data.name:" + res.data[1].name);
           },
         })*/
      },

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log("res.data.name:"+res.data.name);
        console.log("download:"+JSON.stringify(res.data));
        
        //that.setData({todos: result});
        todos = JSON.stringify(res.data);
        console.log("todos真值:" + Boolean(todos));
        console.log("todos"+todos);
        console.log(typeof(todos));
        var tempTodos = JSON.parse(todos);
        console.log('tempTodos'+tempTodos);
        
         var leftCount = tempTodos.filter(function (item) {
          return !item.completed
        }).length
         console.log("过滤的类型是"+typeof (tempTodos.filter(function (item) {
           return !item.completed
         })));
        that.setData({ todos: tempTodos, leftCount: leftCount })
        
      },
      fail: function (res) {
        console.log("从数据库拉取数据失败");
      },
      complete: function (res) {
        
      }
    });
    
    /*if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      that.setData({ todos: todos, leftCount: leftCount })
      console.log("this.data.todos:"+that.data.todos);
      console.log("执行到了这里");
    }*/
    
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      that.setData({ logs: logs })
    }
  },

  

 /* onLoad: function () {
    //var that = this;
    this.load()//加载数据库的数据 
  },*/

  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
    console.log("这里发生了inputChangeHandle");
  },

  addTodoHandle: function (e) {
    if (!this.data.input || !this.data.input.trim()) return
    var todos = this.data.todos
    todos.push({ name: this.data.input, completed: false, typ: true })
    console.log("todos里的内容怎么取？"+todos[0].name);
    console.log("这里发生了addToHandle");

    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Add', name: this.data.input })
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
      logs: logs
    })
    this.save()
    
  },

  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
    console.log("这里发生了toggleTodoHandle方法");
  },

  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
    console.log("这里发生了removeTodoHandle");
  },

  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },
  
  clearCompletedHandle: function (e) {
    var todos = this.data.todos
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({ todos: remains, logs: logs })
    this.save()
  }
})
