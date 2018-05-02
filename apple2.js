export default {
  out: null,
  vars: {},
  prog: [],
  parseCommand(cmd, then) {
    let cmdName = cmd.split(" ")[0].toLowerCase();
    let args = cmd
      .split(" ")
      .slice(1)
      .join(" ")
      .replace(";", "+")
      .split(", ");
    for (let arg in args) {
      if (args[arg].startsWith('"') && !args[arg].endsWith('"')) {
        args[arg] += args[arg + 1];
        args[arg + 1] = undefined;
        args = args.filter(x => x != undefined);
      }
    }
    for (let varble in this.vars) {
      window[varble] = this.vars[varble];
    }
    switch (cmdName) {
      case "print":
        this.out.innerHTML += `<span>${_parseExp(
          args.join(", ").replace("undefined", "")
        ) || "0"}</span>`;
        break;
      case "input":
        this.input(_parseExp(args[0]) || "?", val => {
          this.vars[args[1]] = val;
          then();
        });
        // while (!this.vars[args[1]]);
        break;
      case "beep":
        beep.play();
        break;
      default:
        if (cmd.split(" ")[1] == "=") {
          this.vars[cmdName] = eval(cmd.split(" ")[2]);
        } else this.out.innerHTML += "<span>?SYNTAX ERR</span>";
    }
    for (let varble in this.vars) {
      delete window[varble];
    }
    if (cmdName !== "input") then();
  },
  input(ch, callback) {
    let prompt = document.createElement("span");
    prompt.innerHTML += ch;
    let input = document.createElement("span");
    input.classList.add("input");
    prompt.appendChild(input);
    let cursor = document.createElement("span");
    cursor.innerHTML = "█";
    cursor.style.visibility = "visible";
    prompt.appendChild(cursor);
    let blink = setInterval(() => {
      if (cursor.style.visibility === "hidden") {
        cursor.style.visibility = "visible";
      } else if (cursor.style.visibility === "visible") {
        cursor.style.visibility = "hidden";
      }
    }, 500);
    this.out.appendChild(prompt);
    let res;
    document.addEventListener("keydown", ev => {
      if (ev.key == "Enter") {
        prompt.removeChild(cursor);
        clearInterval(blink);
        callback(input.textContent);
        prompt = input = null;
      }
      if (ev.key == "Backspace") {
        var txtArray = input.textContent.split("");
        txtArray[txtArray.length - 1] = "";
        input.textContent = txtArray.join("");
        return;
      }
      if (ev.key.length == 1) input.textContent += ev.key;
    });
    return res;
  }
};
function _parseExp(exp) {
  let res;
  try {
    res = eval(exp);
  } catch (e) {
    res = "0";
  }
  return res;
}
