import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = '3gjqAs88lT1E12YBBzrMEXmk-gzGzoHsz';
let APP_KEY = 'hqYEwwHrpDBMCOd0AUeSGGPD';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});



var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    actionType:'signup',
    todoList: [],
    formData:{
        username:'',
        password:'',
    },
    currentUser: null,
  },
  created: function(){
    // 所以这次我们放弃beforeunload这个事件
    
    // // 从 LeanCloud 读取 todos 的逻辑先不写
    // let oldDataString = window.localStorage.getItem('myTodos')
    // let oldDate = JSON.parse(oldDataString)
    // this.todoList = oldDate || []

    this.currentUser = this.getCurrentUser()
  },
  methods:{
      addTodo:function(){
          this.todoList.push({
              title:this.newTodo,
              createdAt:new Date(),
              done:false
          })
          this.newTodo = ''
          this.saveTodos()
      },
      removeTodo:function(todo){
          let index = this.todoList.indexOf(todo)
          this.todoList.splice(index,1)
          this.saveTodos()
      },
      signup:function(){
        // 将username、id、createdAt传给服务器存储到服务器
        // 密码会自动传过去，前端看不到
          let user = new AV.User()
          user.setUsername(this.formData.username)
          user.setPassword(this.formData.password)
          user.signUp().then((loginedUser) => {
              this.currentUser = this.getCurrentUser()
          }, (error) => {
              alert('注册失败') 
          });
      },
      //同时满足username、password就登陆   
      login: function () {
          AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => { 
              this.currentUser = this.getCurrentUser() 
          }, function (error) {
              alert('登录失败') 
          });
      },
      getCurrentUser:function(){
        let current = AV.User.current()
        // 一开始就要检查用户是否登录
        if(current){
            // attributes 就是我们传给数据库的 username
            // createdAt 是这个数据创建的时间，id 是用户的 id
            let {id, createdAt, attributes: {username}} = current
            return {id,username,createdAt}
        }else{
            return null
        }
      },
      //登出   
      logout:function(){
          AV.User.logOut()
          this.currentUser = null
          window.location.reload()
      },
      //在每次用户新增、删除 todo 的时候，就发送一个请求   
      saveTodos:function(){
          let dataString = JSON.stringify(this.todoList)
          var AVTodos = AV.Object.extend('AllTodos')
          var avTodos = new AVTodos()
          avTodos.set('content',dataString)
          avTodos.save().then(function(todo){
              alert('保存成功')
          },function(error){
              alert('保存失败')
          })
      }
  }
})  