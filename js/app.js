new Vue({
  el: '#app',
  data: () => ({
    //
  }),

  methods: {
    startWebcam () {window.handsfree.start()},
    stopWebcam () {window.handsfree.stop()}
  }
})
