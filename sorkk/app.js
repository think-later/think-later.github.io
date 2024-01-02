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

  decode(data64, isUtf16String)
    .then((sorkkObj) => {
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
    })
    .catch((_) => {
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

function validateFields(sorkkObj) {
  return {
    Tidpunkt: Boolean(sorkkObj.timestamp !== ""),
    "Ingående känsla": Boolean(sorkkObj.ingoingFeeling),
    Situation: Boolean(sorkkObj.situation),
    "Vad tänker jag?": Boolean(sorkkObj.organism.whatDoIThink),
    "Vad känner jag?": Boolean(sorkkObj.organism.whatDoIFeel),
    "Vad får jag för fysiska reaktioner?": Boolean(
      sorkkObj.organism.bodyReactions
    ),
    Reaktion: Boolean(sorkkObj.reaction),
    "Kort Konsekvens": Boolean(sorkkObj.consequences.short),
    "Långsiktig Konsekvens": Boolean(sorkkObj.consequences.long),
  };
}

function isEverySORKKFiledPopulated(sorkkObj) {
  return Object.values(validateFields(sorkkObj)).every((value) => {
    return value;
  });
}

function saveSORKKToList(loadedSork) {
  const tableBody = document.getElementById("sorkkTableBody");
  sorkkObj = loadedSork || getCurrentSORKK();

  if (!isEverySORKKFiledPopulated(sorkkObj)) {
    const validation = Object.entries(validateFields(sorkkObj))
      .filter((_, valid) => {
        return !valid;
      })
      .map((s, _) => {
        return s[0];
      });
    error(
      `Fel: Alla fält är inte ifyllda, vänligen fyll i alla! (${validation.join(
        ", "
      )})`
    );
    return;
  }

  const tableData = [
    document.createTextNode(sorkkObj.timestamp || ""),
    document.createTextNode(sorkkObj.ingoingFeeling),
    document.createTextNode(sorkkObj.situation.persons || ""),
    document.createTextNode(sorkkObj.situation.lapse || sorkkObj.situation),
    document.createTextNode(sorkkObj.organism.whatDoIThink),
    document.createTextNode(sorkkObj.organism.whatDoIFeel),
    document.createTextNode(sorkkObj.organism.bodyReactions),
    document.createTextNode(sorkkObj.organism.affectedAbilities || ""),
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

function getAbilities() {
  return Array.from({
    *[Symbol.iterator]() {
      for (const ab of document
        .getElementsByName("affectedAbilities")
        .values()) {
        if (ab.checked) yield ab.value;
      }
    },
  });
}

function getCurrentSORKK() {
  return {
    timestamp: document.getElementById("when").value,
    ingoingFeeling: document.getElementById("ingoingFeeling").value,
    situation: {
      persons: document.getElementById("persons").value,
      lapse: document.getElementById("lapse").value,
    },
    organism: {
      whatDoIThink: document.getElementById("whatDoIThink").value,
      whatDoIFeel: document.getElementById("whatDoIFeel").value,
      bodyReactions: document.getElementById("bodyReactions").value,
      affectedAbilities: getAbilities().join(", "),
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

function shareSORKK(textFieldId) {
  const currentSorkk = getCurrentSORKK();
  let sorkkObj = getAllSORKKs() || currentSorkk;

  if (currentSorkk !== sorkkObj && isEverySORKKFiledPopulated(currentSorkk)) {
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
    const link = document.getElementById(textFieldId);
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
  document.getElementById("tab-table").checked = true;
  disableEditing();
}

function hideAllSORKKs() {
  enableEditing();
}

function disableEditing() {
  disableAbilities();
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
  enableAbilities();
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
  disableAbilities();
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

function updateAbilities(sorkkAbilities) {
  const abilities = sorkkAbilities.split(", ");
  for (const ab of document.getElementsByName("affectedAbilities").values()) {
    ab.checked = abilities.includes(ab.value);
    ab.disabled = true;
  }
}

function disableAbilities(clear) {
  for (const ab of document.getElementsByName("affectedAbilities").values()) {
    if (clear === true) {
      ab.checked = false;
    }
    ab.disabled = true;
  }
}

function enableAbilities() {
  for (const ab of document.getElementsByName("affectedAbilities").values()) {
    ab.disabled = false;
  }
}

function showSORKK(row, sorkkObj) {
  document.getElementById("ingoingFeelingP").innerText =
    sorkkObj.ingoingFeeling;
  document.getElementById("persons").innerText =
    sorkkObj.situation.persons || "";
  document.getElementById("lapseP").innerText =
    sorkkObj.situation.lapse || sorkkObj.situation;
  document.getElementById("whatDoIThinkP").innerText =
    sorkkObj.organism.whatDoIThink;
  document.getElementById("whatDoIFeelP").innerText =
    sorkkObj.organism.whatDoIFeel;
  document.getElementById("bodyReactionsP").innerText =
    sorkkObj.organism.bodyReactions;

  if (sorkkObj.organism.affectedAbilities !== undefined) {
    updateAbilities(sorkkObj.organism.affectedAbilities);
  } else {
    disableAbilities(true);
  }

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
  document.getElementById("tab-form").checked = true;
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

  const snackbar = document.getElementById("snackbar");
  snackbar.classList.add("show");
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 3000);
}
