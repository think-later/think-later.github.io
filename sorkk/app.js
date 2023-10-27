function loadSORKK() {
  const result = prompt("Klistra in en SORKK-sträng eller URL", "");
  let data64 = "";
  let isUtf16String = false;

  if (result != null) {
    try {
      const url = new URL(result);
      isUtf16String = url.searchParams.has("d");

      if (isUtf16String || url.searchParams.has("s")) {
        data64 = isUtf16String
          ? url.searchParams.get("d")
          : url.searchParams.get("s");
      }
    } catch (typeError) {}
  } else {
    return;
  }

  if (data64.length == 0) {
    isUtf16String = result.trim().charAt(0) == "d";
    data64 = result.trim().substring(2);
  }

  if (data64 == "") {
    error("Kunde inte ladda in SORKK:en, ogiltlig text eller URL!");
  }

  decode(data64, isUtf16String).then((sorkkObj) => {
    if (sorkkObj !== undefined) {
      if (sorkkObj instanceof Array) {
        sorkkObj.forEach((sorkk) => {
          saveSORKKToList(sorkk);
        });
      } else {
        saveSORKKToList(sorkkObj);
      }
      showAllSORKKs();
    } else {
      error("Kunde inte ladda in SORKK:en, ogiltlig text eller URL!");
    }
  }).catch((_) => {
    error("Kunde inte ladda in SORKK:en, ogiltlig text eller URL!");
  });
}

function readMoreSORKK(obj) {
  let displayStyle = document.getElementById("readMoreSORKK");
  let showMore = document.getElementById("showInformation");
  let hideMore = document.getElementById("hideInformation");

  if (displayStyle.classList.contains("hide")) {
    displayStyle.classList.remove("hide");
    showMore.classList.add("hide");
    hideMore.classList.remove("hide");
  } else {
    displayStyle.classList.add("hide");
    showMore.classList.remove("hide");
    hideMore.classList.add("hide");
  }
}

function isEverySORKKFiledPopulated(sorkkObj) {
  return (
    sorkkObj.ingoingFeeling &&
    sorkkObj.situation &&
    sorkkObj.organism.whatDoIThink &&
    sorkkObj.organism.whatDoIFeel &&
    sorkkObj.organism.bodyReactions &&
    sorkkObj.reaction &&
    sorkkObj.consequences.short &&
    sorkkObj.consequences.long
  );
}

function saveSORKKToList(loadedSork) {
  const tableBody = document.getElementById("sorkkTableBody");
  sorkkObj = loadedSork || getCurrentSORKK();

  if (!isEverySORKKFiledPopulated(sorkkObj)) {
    error("Fel: Alla fält är inte ifyllda, vänligen fyll i alla!")
    return;
  }

  const tableData = [
    document.createTextNode(sorkkObj.ingoingFeeling),
    document.createTextNode(sorkkObj.situation),
    document.createTextNode(sorkkObj.organism.whatDoIThink),
    document.createTextNode(sorkkObj.organism.whatDoIFeel),
    document.createTextNode(sorkkObj.organism.bodyReactions),
    document.createTextNode(sorkkObj.reaction),
    document.createTextNode(sorkkObj.consequences.short),
    document.createTextNode(sorkkObj.consequences.long),
  ];

  const row = document.createElement("tr");

  tableData.forEach((value) => {
    const cell = document.createElement("td");
    cell.appendChild(value);
    row.appendChild(cell);
  });
  row.setAttribute(
    "onclick",
    "showSORKK(this, " + JSON.stringify(sorkkObj) + ")"
  );
  tableBody.prepend(row);
  document.getElementById("sorkkCount").innerText++;
  clearSORKK();
  showSORKK(row, sorkkObj);
}

function clearSORKK() {
  const textareas = document.getElementsByTagName("textarea");
  for (let i = 0; i < textareas.length; i++) {
    textareas.item(i).value = "";
  }
}

function getCurrentSORKK() {
  return {
    ingoingFeeling: document.getElementById("ingoingFeeling").value,
    situation: document.getElementById("situation").value,
    organism: {
      whatDoIThink: document.getElementById("whatDoIThink").value,
      whatDoIFeel: document.getElementById("whatDoIFeel").value,
      bodyReactions: document.getElementById("bodyReactions").value,
    },
    reaction: document.getElementById("reaction").value,
    consequences: {
      short: document.getElementById("shortConsequence").value,
      long: document.getElementById("longConsequence").value,
    },
  };
}
function getAllSORKKs() {
  const tableBody = document.getElementById("sorkkTableBody");
  var sorkks = new Array();

  tableBody.childNodes.forEach((row) => {
    if (!(row instanceof Text)) {
      jsonString = row
        .getAttribute("onclick")
        .substring("showSORKK(this, ".length);
      jsonString = jsonString.substring(0, jsonString.length - 1);
      sorkks.push(JSON.parse(jsonString));
    }
  });
  if (sorkks.length === 0) {
    return undefined;
  } else if (sorkks.length === 1) {
    return sorkks[0];
  } else {
    return sorkks;
  }
}

function shareSORKK() {
  const currentSorkk = getCurrentSORKK();
  let sorkkObj = getAllSORKKs() || currentSorkk;

  if (
    currentSorkk !== currentSorkk &&
    isEverySORKKFiledPopulated(currentSorkk)
  ) {
    if (sorkkObj instanceof Array) {
      sorkkObj.push(currentSorkk);
    } else {
      sorkkObj = [sorkkObj, currentSorkk];
    }
  }

  encode(sorkkObj).then((result) => {
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      (result.isUtf16String ? "d" : "s") +
      "=" +
      encodeURIComponent(result.encodedData);
    const link = document.getElementById("link");
    link.value = url;
    link.select();
    link.setSelectionRange(0, url.length);

    navigator.clipboard.writeText(link.value);
    try {
      if (navigator.share !== undefined) {
        navigator.share({ title: "SORKK Link", url: url });
      }
    } catch (err) {
      console.error("Share failed:", err.message);
      error("Kunde tyvärr inte skapa länk: " + err.message);
    }
  });
}

function showAllSORKKs() {
  disableEditing();
  document.getElementById("tableContainer").classList.remove("hide");
  // document.getElementById("cardDeck").classList.replace("container", "hide")
}

function hideAllSORKKs() {
  enableEditing();
  document.getElementById("tableContainer").classList.add("hide");
}

function disableEditing() {
  const controls = document.getElementsByClassName("editModeOnly");
  for (let i = 0; i < controls.length; i++) {
    console.log("Disable item", controls.item(i));
    controls.item(i).classList.add("hide");
  }
  const readOnlys = document.getElementsByClassName("viewModeOnly");
  for (let i = 0; i < readOnlys.length; i++) {
    readOnlys.item(i).classList.remove("hide");
  }
}

function enableEditing() {
  const controls = document.getElementsByClassName("editModeOnly");
  for (let i = 0; i < controls.length; i++) {
    controls.item(i).classList.remove("hide");
  }
  const readOnlys = document.getElementsByClassName("viewModeOnly");
  for (let i = 0; i < readOnlys.length; i++) {
    readOnlys.item(i).classList.add("hide");
  }
}

function enableReadOnly() {
  const controls = document.getElementsByClassName("editModeOnly");
  for (let i = 0; i < controls.length; i++) {
    controls.item(i).classList.add("hide");
  }
  const viewModeOnlys = document.getElementsByClassName("viewModeOnly");
  for (let i = 0; i < viewModeOnlys.length; i++) {
    viewModeOnlys.item(i).classList.add("hide");
  }
  const readOnlys = document.getElementsByClassName("readOnly");
  for (let i = 0; i < readOnlys.length; i++) {
    readOnlys.item(i).classList.remove("hide");
  }
}

function showSORKK(row, sorkkObj) {
  document.getElementById("ingoingFeelingP").innerText =
    sorkkObj.ingoingFeeling;
  document.getElementById("situationP").innerText = sorkkObj.situation;
  document.getElementById("whatDoIThinkP").innerText =
    sorkkObj.organism.whatDoIThink;
  document.getElementById("whatDoIFeelP").innerText =
    sorkkObj.organism.whatDoIFeel;
  document.getElementById("bodyReactionsP").innerText =
    sorkkObj.organism.bodyReactions;
  document.getElementById("reactionP").innerText = sorkkObj.reaction;
  document.getElementById("shortConsequenceP").innerText =
    sorkkObj.consequences.short;
  document.getElementById("longConsequenceP").innerText =
    sorkkObj.consequences.long;

  document.getElementById("sorkkTableBody").childNodes.forEach((node) => {
    if (node === row) {
      row.classList.add("selected");
    } else if (node.classList) {
      node.classList.remove("selected");
    }
  });
}

function init() {
  const selfUrl = new URL(window.location.href);
  const isUtf16String = selfUrl.searchParams.has("d");

  if (isUtf16String || selfUrl.searchParams.has("s")) {
    try {
      const data64 = isUtf16String
        ? selfUrl.searchParams.get("d")
        : selfUrl.searchParams.get("s");
      decode(data64, isUtf16String).then((sorkkObj) => {
        if (sorkkObj !== undefined) {
          if (sorkkObj instanceof Array) {
            sorkkObj.forEach((sorkk) => {
              saveSORKKToList(sorkk);
            });
          } else {
            saveSORKKToList(sorkkObj);
          }
          showAllSORKKs();
          enableReadOnly();
          document.getElementById("shareSorkk").classList.add("hide");
        } else {
          error("Kunde inte läsa in SORKK");
        }
      });
    } catch (err) {
      console.log("error:", err);
      error("Kunde inte läsa in SORKK");
      return;
    }
  }
}

function newSORKK() {
  const selfUrl = new URL(window.location.href);
  console.log("selfURL", selfUrl);
  selfUrl.search = "";
  console.log("newURL", selfUrl);
  window.location.assign(selfUrl);
}

function error(message) {
  document.getElementById("errorMessage").innerText = message;

  const snackbar = document.getElementById("snackbar")
  snackbar.classList.add("show");
  setTimeout(function() { snackbar.classList.remove("show"); }, 3000);
}
