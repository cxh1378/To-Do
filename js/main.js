// ;(function(){
//   'use strict';
  var alert_sound=document.getElementById('alert-sound');
  function welcome_fn(){
    alert_sound.load();
    document.getElementById('welcome').style.display="none";
    document.getElementById('todo').style.display='block';


    var de="";
    if(Utils.isIOS()){
      document.getElementById('ios').style.display='inline-block';
      $("#chrome").attr('type','hidden');
      de="ios";
      // $(document).on('touchstart', function() {
      // alert_sound.load();
      // })
    }

    var Event=new Vue();


    function copy(obj){
      return Object.assign({},obj);
    }

    Vue.component('task',{
      template:'#task-tpl',
      props:['todo'],
      methods:{
        action:function(name,params){
          Event.$emit(name,params);
        }
      }
    });

    new Vue({
      el:'#main',
      data:{
        list:[],
        last_id:0,
        current:{}
      },

      mounted:function(){
        var me=this;
        this.list=ms.get('list')||this.list;
        this.last_id=ms.get('last_id')||this.last_id;

        setInterval(function(){
          me.check_alerts();
        },1000);

        Event.$on('remove',function(id){
          if(id){
            me.remove(id);
          }
        });
        Event.$on('toggle_complete',function(id){
          if(id){
            me.toggle_complete(id);
          }
        });
        Event.$on('toggle_nocomplete',function(id){
          if(id){
            me.toggle_nocomplete(id);
          }
        });
        Event.$on('set_current',function(todo){
          if(todo){
            me.set_current(todo);
          }
        });
        Event.$on('toggle_detail',function(id){
          if(id){
            me.toggle_detail(id);
          }
        });
      },
      methods:{
        check_alerts:function(){
          var me=this;
          // this.list.push({title: "asd", desc: "asdas", alert_at: "2018-07-04T12:12", id: 52, alert_confirmed: false});
          this.list.forEach(function(row,i){
            if(de.indexOf("ios") < 0){
              var alert_at=row.alert_at;//2018-07-01T12:12
              if(!row.alert_at||row.alert_confirmed) return;
              var alert_at=(new Date(alert_at)).getTime();
              var now=(new Date()).getTime();
            }else{
              var alert_at_ios=row.alert_at_ios;
              var alert_at_ios_hours=row.alert_at_ios_hours||"00";
              if(alert_at_ios_hours.length==1){
                alert_at_ios_hours="0"+row.alert_at_ios_hours;
              }
              var alert_at_ios_minutes=row.alert_at_ios_minutes||"00";
              if(alert_at_ios_minutes.length==1){
                alert_at_ios_minutes="0"+row.alert_at_ios_minutes;
              }
              if(!row.alert_at_ios||row.alert_confirmed) return;
              var alert_at=(new Date(alert_at_ios+"T"+alert_at_ios_hours+":"+alert_at_ios_minutes)).getTime()-28800*1000;
              var now=(new Date()).getTime();
              // alert(new Date(alert_at_ios+"T"+alert_at_ios_hours+":"+alert_at_ios_minutes));
              // alert(new Date());
            }

            // var alert_at = new Date(alert_at.replace(/-/g,'/').replace('T',' ')).getTime();

            if(now>=alert_at){
               alert_sound.play();

              // if(alert_sound!==null){
              //   if(!alert_sound.paused){
              //     // alert_sound.pause();
              //   }else{
              //     alert_sound.load();
              //     alert_sound.play();
              //   }
              // }


              //  wx.config({ // 配置信息, 即使不正确也能使用，不过只能在微信中生效
              //  debug: false,
              //  appId: '',
              //  timestamp: '1',
              //  nonceStr: '',
              //  signature: '',
              //  jsApiList: []
              //  });
              //  wx.ready(function() {
              // console.log("88");
              //  alert_sound.play();
              //  });

               // var confirmed=confirm(row.title);
              var confirmed;
                swal({
                    title: row.title,
                    text: "主人快快<h1 style='display:inline;'>"+row.title+"</h1>",
                    type: "warning",
                    // showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "收到，不再提醒",
                    cancelButtonText: "继续提醒我",
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    html:true
                }, function(isConfirm) {
                    if (isConfirm) {
                        // swal("删除!", "您的虚构文件已被删除！", "success")
                        confirmed=true;
                        Vue.set(me.list[i],'alert_confirmed',confirmed);
                        Vue.set(me.list[i],'state',"0");
                        // swal("取消提醒", "没有我再次提醒，请主人要记住'"+row.title+"'", "success")
                        swal({
                          title:"取消提醒",
                          text:"没有我再次提醒，请主人要记住<h1 style='display:inline;'>"+row.title+"</h1>",
                          type:"success",
                          html:true
                        })
                    } else{
                        swal("保持提醒", "我将继续为主人提醒'"+row.title+"'", "error")
                        confirmed=false;
                        Vue.set(me.list[i],'alert_confirmed',confirmed);
                    }
                })



              // Vue.set(me.list[i],'alert_confirmed',confirmed);
            }
          });
        },
        merge:function(){
          var is_update,id;
          is_update=id=this.current.id;
          if(is_update){
            var index=this.find_index(id);
            Vue.set(this.list,index,copy(this.current));
            this.current.alert_confirmed=!this.current.alert_confirmed;
            this.current.state="1";
            Vue.set(this.list,index,copy(this.current));
          }else{
            var title=this.current.title;
            if(!title&&title!==0) return;
            var todo=copy(this.current);
            this.last_id++;
            ms.set('last_id',this.last_id);
            todo.id=this.last_id;
            this.list.push(todo);

          }
          this.reset_current();
        },

        toggle_detail:function(id){
          var index=this.find_index(id);
          this.list[index].show_detail;
          Vue.set(this.list[index],'show_detail',!this.list[index].show_detail);
        },
        remove:function(id){
          var index=this.find_index(id);
          this.list.splice(index,1);
        },

        next_id:function(){
          return this.list.length+1;
        },

        set_current:function(todo){
          this.current=copy(todo);
          document.getElementById('task-input').focus();
        },

        reset_current:function(){
          this.set_current({});
        },

        find_index:function(id){
          return this.list.findIndex(function(item){
            return item.id==id;
          });
        },

        toggle_complete:function(id){
          var i=this.find_index(id);
          Vue.set(this.list[i],'completed',!this.list[i].completed);
        },
        toggle_nocomplete:function(id){
          var i=this.find_index(id);
          Vue.set(this.list[i],'completed',!this.list[i].completed);
          Vue.set(this.list[i],'alert_confirmed',!this.list[i].alert_confirmed);
          Vue.set(this.list[i],'state',"1");
        }
      },

      watch:{
        list:{
          deep:true,
          handler:function(n,o){
            if(n){
              ms.set('list',n);
            }else{
              ms.set('list',[]);
            }
          }
        }
      }
    });
  }

// })();
