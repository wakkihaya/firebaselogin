<template>
 <div class="chat">
   <header class = "header">
    <h1>chat</h1>
   <!--ここにchatの内容を書く-->
    {{user.displayName}}

   <button @click="signOut">Sign out</button>
   </header>

  <!--firebaseから取得したリストをtransitionを使って描画-->
 <transition-group name ="chat" tag = "div" class = "list content">
   <section v-for="{key,name,message} in chat" :key ="key" class="item">
     <div class="item-detail">
       <div class = "item-name">{{name}}</div>
       <div class="item-message">
        <nl2br tag ="div" :text ="message"/>
       </div>
     </div>
   </section>
 </transition-group>

  <form action="" @submit.prevent="doSend" class ="form">
    <textarea
      v-model="input"
      :disabled="!user.uid"
      @keydown.enter.exact.prevent="doSend"></textarea>
    <button type ="submit" :diabled="!user.uid" class="send-button">送信</button>

  </form>
 </div>
</template>

<script>
  import firebase from 'firebase'

  import Nl2br from 'vue-nl2br'

export default {
  components:{Nl2br},
  data () {
    return {
      user:{}, //ユーザー情報
      chat:[], //取得したメッセージを入れる配列
      input:'' //入力したメッセージ
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(user=>{
      this.user = user ? user :{}
      const ref_message = firebase.database().ref('message')
      if(user){
        this.chat = []
        ref_message.limitToLast(10).on('child_added',this.childAdded)
      }else{
        ref_message.limitToLast(10).off('child_added',this.childAdded)
      }

      }
    )
  },

  methods:{
    signOut:function () {
      firebase.auth().signOut().then(() =>{
        this.$router.push('/signin')
      })

    },

    scrollBottom(){
      this.$nextTick(()=>{
        window.scrollTo(0,document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const message = snap.val()
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.scrollBottom()
    },

    doSend(){
      if(this.user.uid && this.input.length){
        firebase.database().ref('message').push({
          message:this.input,
          name:this.user.displayName
        },()=>{
          this.input =''
        })
      }
    }


  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./app.css"></style>
