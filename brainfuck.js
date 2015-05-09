var bf = {};

bf.init = function() {
  this.input = "";
  this.inputPointer = 0;
  this.table = { "0": 0 };
  this.pointer = "0";
  this.code = "";
  this.loops = [];
  this.debugging = false;
  this.output = "";
}

bf.setInput = function(input) {
  this.input = input;
}

bf.next = function() {
  this.pointer = String(parseInt(this.pointer)+1);
  if (this.table[this.pointer] == undefined) this.table[this.pointer] = 0;
}

bf.prev = function() {
  this.pointer = String(parseInt(this.pointer)-1);
  if (this.table[this.pointer] == undefined) this.table[this.pointer] = 0;
}

bf.inc = function() {
  var tmp = (this.table[this.pointer] + 1);
  if (tmp < 0) tmp += 256;
  this.table[this.pointer] = tmp % 256;
}

bf.dec = function() {
  var tmp = (this.table[this.pointer] - 1);
  if (tmp < 0) tmp += 256;
  this.table[this.pointer] = tmp % 256;
}

bf.puts = function() {
  this.output += String.fromCharCode(this.table[this.pointer]);
}

bf.gets = function() {
  this.table[this.pointer] = this.input.charCodeAt(this.inputPointer);
  this.inputPointer++;
}

bf.debug = function() {
  var tmp = [];
  var keys = Object.keys(this.table);
  var line = "";
  for (var i = 0; i < keys.length; i++) {
    if (parseInt(this.pointer) == i) {
      line += "<"+this.table[keys[i]]+"> ";
    } else {
      line += "["+this.table[keys[i]]+"] ";
    }
  }
  console.log(line);
}

bf.runCode = function(code) {
  this.code = code;
  var loopBeginnings = [];

  for (var i = 0; i < this.code.length; i++) {
    if (this.code[i] == "[") loopBeginnings.push(i);
  }

  var loopCounter;
  for (var i = 0; i < loopBeginnings.length; i++) {
    loopCounter = 1;
    for (var j = 1; j < this.code.length-loopBeginnings[i]; j++) {
      if (this.code[loopBeginnings[i]+j] == "[") loopCounter++;
      if (this.code[loopBeginnings[i]+j] == "]") {
        loopCounter--;
        if (loopCounter == 0) {
          this.loops.push([loopBeginnings[i]+j, loopBeginnings[i]]);
        }
      }
    }
  }

  var func = {
    "+": "inc",
    "-": "dec",
    "<": "prev",
    ">": "next",
    ".": "puts",
    ",": "gets"
  }

  if (this.debugging) func["!"] = "debug";

  for (var i = 0; i < this.code.length; i++) {
    if ((this.code[i] != "[") && (this.code[i] != "]")) {
      try {
        this[func[this.code[i]]]();
      } catch(err) {
        throw("Tried to debug without debugging enabled?");
      }
    }
    if (this.code[i] == "[") {
      var x;
      for (var j = 0; j < this.loops.length; j++) {
        if (this.loops[j][1] == i) x = j;
      }
      if (this.table[this.pointer] == 0) i = this.loops[x][0];
    }
    if (this.code[i] == "]") {
      var x;
      for (var j = 0; j < this.loops.length; j++) {
        if (this.loops[j][0] == i) x = j;
      }
      if (this.table[this.pointer] != 0) i = this.loops[x][1];
    }
  }

  console.log(this.output);
}

bf.init();
bf.debugging = true;
bf.setInput("ab");
bf.runCode(",>,!");
