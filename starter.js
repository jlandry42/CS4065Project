let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;
let autocorrect = window.SimpleKeyboardAutocorrect.default;
let txtgen = window.txtgen;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  autocorrectDict: ["hello", "pizza", "computer", "home"],
  autocorrectHotkey: "{space}",
  onAutocorrectPrediction: (word, prediction) => {
    console.log("Autocorrect:", word, prediction);
  },
  modules: [
    swipe,
    autocorrect
  ],
  mergeDisplay: true,
  layoutName: "default",
  layout: {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {backspace}",
      "{space} {ent}"
    ]

  },
  display: {
    "{numbers}": "123",
    "{ent}": "return",
    "{escape}": "esc ⎋",
    "{tab}": "tab ⇥",
    "{backspace}": "⌫",
    "{capslock}": "caps lock ⇪",
    "{shift}": "⇧",
    "{controlleft}": "ctrl ⌃",
    "{controlright}": "ctrl ⌃",
    "{altleft}": "alt ⌥",
    "{altright}": "alt ⌥",
    "{metaleft}": "cmd ⌘",
    "{metaright}": "cmd ⌘",
    "{abc}": "ABC"
  },
  theme: "hg-theme-default hg-layout-default keyboardThemeClass",
});

/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});

document.querySelector(".swipeCanvasElement").addEventListener("mouseup", () => {
    /**
     * Default autocorrect hotkey is space, can be changed
     * by setting the "autocorrectHotkey" option
     */
    keyboard.getButtonElement("{space}").click();
}, true);

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {

  console.log("Button pressed", button);

  // if the Enter button is clicked
  if(button === "{ent}") {
    const targetSentence = document.getElementById("targetSentence").innerText;
    const inputSentence = document.getElementById("inputSentence").innerText;
    alert(compareTwoStrings(targetSentence, inputSentence));

    let sentence = txtgen.sentence();
    sentence = sentence.replace(/[^\w\s]/gi, '');
    sentence = sentence.toLowerCase();
    document.getElementById("targetSentence").innerText = sentence;
      document.getElementById("inputSentence").innerText = "";
  }
}



/**
 * This is your starter kits main entry point
 */
// Create a handsfree instance with no defaults
window.handsfree = new Handsfree({debug: true})
const handsfree = window.handsfree

const $sandboxWrap = document.querySelector('#sandbox-wrap')
handsfree.use({
  name: 'select-key',
  /**
   * Called after this plugin is added to the Handsfree.plugin map
   * - Use this for initialization tasks
   */
  onUse () {
    console.log(`Loaded: ${this.name}`)
  },
  /**
   * This is called on each webcam frame
   * @param {Array} faces An array of detected faces
   */
  onFrame (poses) {
    // eslint-disable-next-line
    poses.forEach(pose => {
      // Do things with the face here
      $sandboxWrap.innerHTML = `
        <strong>pose.face.cursor.x</strong>: ${pose.face.cursor.x}
        <br>
        <strong>pose.face.cursor.y</strong>: ${pose.face.cursor.y}
        <br>
        <strong>pose.face.cursor.$target</strong>: ${pose.face.cursor.$target}
        <br>
        <strong>pose.face.cursor.state.mouseDown</strong>: ${pose.face.cursor.state.mouseDown}
        <br>
        <strong>pose.face.cursor.state.mouseDrag</strong>: ${pose.face.cursor.state.mouseDrag}
        <br>
        <strong>pose.face.cursor.state.mouseUp</strong>: ${pose.face.cursor.state.mouseUp}
        <br>
        <strong>pose.face.translationX/Y</strong>: (${pose.face.translationX.toFixed(2)}, ${pose.face.translationY.toFixed(2)})
        <br>
        <strong>pose.face.rotationX/Y/Z</strong>: (${(pose.face.rotationX * 180 / Math.PI).toFixed(2)}, ${(pose.face.rotationY * 180 / Math.PI).toFixed(2)}, ${(pose.face.rotationZ * 180 / Math.PI).toFixed(2)})
        <br>
        <strong>pose.face.scale</strong>: ${pose.face.scale}`
    })
  },
  onMouseDown:(pose, poseIndex)=> {
    console.log(pose);
    console.log(pose.cursor.x);
    console.log(pose.cursor.y);
    console.log(pose.cursor.$target);
    $(document.elementFromPoint(pose.cursor.x,pose.cursor.y)).trigger("click");
  },
  /**
   * Called whenever handsfree.start() is called
   */
  onStart () {
    console.log(`Started: ${this.name}`)
  },

  /**
   * Called whenever handsfree.stop() is called
   */
  onStop () {
    console.log(`Stopped: ${this.name}`)
  }
})
