new Vue({
  el: '#app',
  data: function(){
    return{
    }
  },

  methods: {
    startWebcam () {window.handsfree.start()},
    stopWebcam () {window.handsfree.stop()},

  }
})
