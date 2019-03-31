let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;
let autocorrect = window.SimpleKeyboardAutocorrect.default;
let txtgen = window.txtgen;

let lingerTime = 3000; // linger time in ms

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  // autocorrectDict: ["hello", "pizza", "computer", "home"],
  // onAutocorrectPrediction: (word, prediction) => {
  //   console.log("Autocorrect:", word, prediction);
  // },
  modules: [

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

let previousTarget = undefined;
let lingerStartTime = undefined;

/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});

// document.querySelector(".swipeCanvasElement").addEventListener("mouseup", () => {
//     /**
//      * Default autocorrect hotkey is space, can be changed
//      * by setting the "autocorrectHotkey" option
//      */
//     if(document.getElementById("inputSentence").value !== "") {
//       if(keyboard.previousInput !== "{ent}"
//         && keyboard.previousInput !== "{backspace}"
//         && keyboard.previousInput !== "{space}")
//       {
//         keyboard.getButtonElement("{space}").click();
//       }
//     }
// }, true);

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {

  console.log("Button pressed", button);

  keyboard.previousInput = button;

  // if the Enter button is clicked
  if(button === "{ent}") {
    const targetSentence = document.getElementById("targetSentence").innerText;
    const inputSentence = document.getElementById("inputSentence").value;
    const sim = compareTwoStrings(targetSentence, inputSentence);

    var jqxhr = $.ajax({
    url: "https://script.google.com/macros/s/AKfycbzSbkDy1cK--Pqisy5O2tzm5mPHYcKIDc0F8VHNtp_8s6yk2Ac/exec",
    method: "GET",
    dataType: "json",
    data: {
      "id" : 1,
      "input_method" : "single",
      "target_sentence" : targetSentence,
      "input_sentence" : inputSentence,
      "similarity" : sim,
      "timestamp" : new Date(),
      //TODO add completion time
    }
  }).done(function (response){
      console.log(response)
  });

    let sentence = txtgen.sentence();
    sentence = sentence.replace(/[^\w\s]/gi, '');
    sentence = sentence.toLowerCase();
    document.getElementById("targetSentence").innerText = sentence;
    keyboard.clearInput();
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
      if(pose.face.cursor.$target !== null && pose.face.cursor.$target !== previousTarget) {
        if(typeof previousTarget !== 'undefined'
          && typeof previousTarget.className !== 'undefined'
          && typeof previousTarget.className.split(' ') !== 'undefined'
          && previousTarget.className.split(' ').includes('hg-button')
        ) {
          previousTarget.style.backgroundColor = 'white';
        }
        if(typeof pose.face.cursor.$target !== 'undefined'
            && typeof pose.face.cursor.$target.className !== 'undefined'
            && typeof pose.face.cursor.$target.className.split(' ') !== 'undefined'
            && pose.face.cursor.$target.className.split(' ').includes('hg-button')
        ) {
            pose.face.cursor.$target.style.backgroundColor = 'gray';
        }

        previousTarget = pose.face.cursor.$target;
        lingerStartTime = Date.now();
      } else if(pose.face.cursor.$target === previousTarget) {
        if(Date.now() - lingerStartTime >= lingerTime) {
          lingerStartTime = Date.now();
          pose.face.cursor.$target.click();
          console.log('click');
        }
      }

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
    $(document.elementFromPoint(pose.cursor.x,pose.cursor.y)).trigger("pointerdown");
    $(document.elementFromPoint(pose.cursor.x,pose.cursor.y)).trigger("pointerup");
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
});
