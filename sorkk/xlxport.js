/*import { JSZip } from './jszip.min.js'
import { saveAs } from './FileSaver.min.js'
*/
const XMLHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const xmlns = "http://www.w3.org/2000/xmlns/";

function xlCreateRels() {
  const ns = "http://schemas.openxmlformats.org/package/2006/relationships";
  const root = document.implementation.createDocument(ns, "Relationships");
  let rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId1");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
  );
  rel.setAttribute("Target", "xl/workbook.xml");

  root.documentElement.prepend(rel);

  rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId2");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties"
  );
  rel.setAttribute("Target", "docProps/core.xml");
  root.documentElement.prepend(rel);

  rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId3");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties"
  );
  rel.setAttribute("Target", "docProps/app.xml");
  root.documentElement.prepend(rel);

  return {
    "_rels/.rels": XMLHeader + new XMLSerializer().serializeToString(root),
  };
}

function xlCreateAppDocProps() {
  const ns =
    "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties";
  const vt =
    "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes";
  const docRoot = document.implementation.createDocument(ns, "Properties");
  const appRoot = docRoot.documentElement;
  appRoot.setAttributeNS(xmlns, "xmlns:vt", vt);

  let node = document.createElementNS(ns, "Application");
  node.appendChild(document.createTextNode("Patrik Excel Exporter"));
  appRoot.append(node);

  node = document.createElementNS(ns, "HeadingPairs");
  let vector = document.createElementNS(vt, "vector");
  vector.setAttribute("size", "2");
  vector.setAttribute("baseType", "variant");

  let variant = document.createElementNS(vt, "variant");
  let lpstr = document.createElementNS(vt, "lpstr");
  lpstr.append(document.createTextNode("Worksheets"));
  variant.append(lpstr);
  vector.append(variant);

  variant = document.createElementNS(vt, "variant");
  const i4 = document.createElementNS(vt, "i4");
  i4.append(document.createTextNode("1"));
  variant.append(i4);
  vector.append(variant);
  node.append(vector);
  appRoot.append(node);

  node = document.createElementNS(ns, "TitlesOfParts");
  vector = document.createElementNS(vt, "vector");
  vector.setAttribute("size", "1");
  vector.setAttribute("baseType", "lpstr");
  lpstr = document.createElementNS(vt, "lpstr");
  lpstr.append(document.createTextNode("Sheet1"));
  vector.append(lpstr);
  node.append(vector);
  appRoot.append(node);

  return {
    "docProps/app.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateCoreDocProps() {
  const cp =
    "http://schemas.openxmlformats.org/package/2006/metadata/core-properties";
  const dc = "http://purl.org/dc/elements/1.1/";
  const dcterms = "http://purl.org/dc/terms/";
  const dcmitype = "http://purl.org/dc/dcmitype/";
  const xsi = "http://www.w3.org/2001/XMLSchema-instance";

  const docRoot = document.implementation.createDocument(cp, "coreProperties");
  const appRoot = docRoot.documentElement;
  appRoot.setAttributeNS(xmlns, "xmlns:cp", cp);
  appRoot.setAttributeNS(xmlns, "xmlns:dc", dc);
  appRoot.setAttributeNS(xmlns, "xmlns:dcterms", dcterms);
  appRoot.setAttributeNS(xmlns, "xmlns:dcmitype", dcmitype);
  appRoot.setAttributeNS(xmlns, "xmlns:xsi", xsi);

  node = document.createElementNS(dcterms, "created");
  node.setAttributeNS(xsi, "type", "dcterms:W3CDTF");
  node.appendChild(document.createTextNode(new Date().toISOString()));
  appRoot.append(node);

  node = document.createElementNS(dcterms, "modified");
  node.setAttributeNS(xsi, "type", "dcterms:W3CDTF");
  node.appendChild(document.createTextNode(new Date().toISOString()));
  appRoot.append(node);

  return {
    "docProps/core.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateWorkbookRels() {
  const ns = "http://schemas.openxmlformats.org/package/2006/relationships";
  const root = document.implementation.createDocument(ns, "Relationships");
  let rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId1");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
  );
  rel.setAttribute("Target", "worksheets/sheet1.xml");

  root.documentElement.prepend(rel);

  rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId2");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"
  );
  rel.setAttribute("Target", "theme/theme1.xml");
  root.documentElement.prepend(rel);

  rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId3");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
  );
  rel.setAttribute("Target", "styles.xml");
  root.documentElement.prepend(rel);

  rel = root.createElementNS(ns, "Relationship");
  rel.setAttribute("Id", "rId4");
  rel.setAttribute(
    "Type",
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings"
  );
  rel.setAttribute("Target", "sharedStrings.xml");
  root.documentElement.append(rel);

  return {
    "xl/_rels/workbook.xml.rels":
      XMLHeader + new XMLSerializer().serializeToString(root),
  };
}

function xlCreateTheme() {
  const a = "http://schemas.openxmlformats.org/drawingml/2006/main";
  const thm15 = "http://schemas.microsoft.com/office/thememl/2012/main";
  const docRoot = document.implementation.createDocument(a, "theme");
  const themeRoot = docRoot.documentElement;
  themeRoot.setAttributeNS(xmlns, "xmlns:a", a);
  themeRoot.setAttribute("name", "Office Theme");

  const elements = document.createElementNS(a, "themeElements");
  const clrScheme = document.createElementNS(a, "clrScheme");
  clrScheme.setAttribute("name", "Office");

  let node = document.createElementNS(a, "dk1");
  let clr = document.createElementNS(a, "sysClr");
  clr.setAttribute("val", "windowText");
  clr.setAttribute("lastClr", "000000");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "lt1");
  clr = document.createElementNS(a, "sysClr");
  clr.setAttribute("val", "window");
  clr.setAttribute("lastClr", "FFFFFF");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "dk2");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "44546A");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "lt2");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "E7E6E6");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent1");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "4472C4");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent2");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "ED7D31");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent3");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "A5A5A5");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent4");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "FFC000");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent5");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "5B9BD5");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "accent6");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "70AD47");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "hlink");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "0563C1");
  node.append(clr);
  clrScheme.append(node);

  node = document.createElementNS(a, "folHlink");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "954F72");
  node.append(clr);
  clrScheme.append(node);

  elements.append(clrScheme);

  const fontScheme = document.createElementNS(a, "fontScheme");
  fontScheme.setAttribute("name", "Office");
  elements.append(fontScheme);

  const majorFont = document.createElementNS(a, "majorFont");
  fontScheme.append(majorFont);

  let font = document.createElementNS(a, "latin");
  font.setAttribute("typeface", "Calibri Light");
  font.setAttribute("panose", "020F0302020204030204");
  majorFont.append(font);

  font = document.createElementNS(a, "ea");
  font.setAttribute("typeface", "");
  majorFont.append(font);

  font = document.createElementNS(a, "cs");
  font.setAttribute("typeface", "");
  majorFont.append(font);

  majorFont.append(newFont(a, "Jpan", "游ゴシック Light"));
  majorFont.append(newFont(a, "Hang", "맑은 고딕"));
  majorFont.append(newFont(a, "Hans", "等线 Light"));
  majorFont.append(newFont(a, "Hant", "新細明體"));
  majorFont.append(newFont(a, "Arab", "Times New Roman"));
  majorFont.append(newFont(a, "Hebr", "Times New Roman"));
  majorFont.append(newFont(a, "Thai", "Tahoma"));
  majorFont.append(newFont(a, "Ethi", "Nyala"));
  majorFont.append(newFont(a, "Beng", "Vrinda"));
  majorFont.append(newFont(a, "Gujr", "Shruti"));
  majorFont.append(newFont(a, "Khmr", "MoolBoran"));
  majorFont.append(newFont(a, "Knda", "Tunga"));
  majorFont.append(newFont(a, "Guru", "Raavi"));
  majorFont.append(newFont(a, "Cans", "Euphemia"));
  majorFont.append(newFont(a, "Cher", "Plantagenet Cherokee"));
  majorFont.append(newFont(a, "Yiii", "Microsoft Yi Baiti"));
  majorFont.append(newFont(a, "Tibt", "Microsoft Himalaya"));
  majorFont.append(newFont(a, "Thaa", "MV Boli"));
  majorFont.append(newFont(a, "Deva", "Mangal"));
  majorFont.append(newFont(a, "Telu", "Gautami"));
  majorFont.append(newFont(a, "Taml", "Latha"));
  majorFont.append(newFont(a, "Syrc", "Estrangelo Edessa"));
  majorFont.append(newFont(a, "Orya", "Kalinga"));
  majorFont.append(newFont(a, "Mlym", "Kartika"));
  majorFont.append(newFont(a, "Laoo", "DokChampa"));
  majorFont.append(newFont(a, "Sinh", "Iskoola Pota"));
  majorFont.append(newFont(a, "Mong", "Mongolian Baiti"));
  majorFont.append(newFont(a, "Viet", "Times New Roman"));
  majorFont.append(newFont(a, "Uigh", "Microsoft Uighur"));
  majorFont.append(newFont(a, "Geor", "Sylfaen"));
  majorFont.append(newFont(a, "Armn", "Arial"));
  majorFont.append(newFont(a, "Bugi", "Leelawadee UI"));
  majorFont.append(newFont(a, "Bopo", "Microsoft JhengHei"));
  majorFont.append(newFont(a, "Java", "Javanese Text"));
  majorFont.append(newFont(a, "Lisu", "Segoe UI"));
  majorFont.append(newFont(a, "Mymr", "Myanmar Text"));
  majorFont.append(newFont(a, "Nkoo", "Ebrima"));
  majorFont.append(newFont(a, "Olck", "Nirmala UI"));
  majorFont.append(newFont(a, "Osma", "Ebrima"));
  majorFont.append(newFont(a, "Phag", "Phagspa"));
  majorFont.append(newFont(a, "Syrn", "Estrangelo Edessa"));
  majorFont.append(newFont(a, "Syrj", "Estrangelo Edessa"));
  majorFont.append(newFont(a, "Syre", "Estrangelo Edessa"));
  majorFont.append(newFont(a, "Sora", "Nirmala UI"));
  majorFont.append(newFont(a, "Tale", "Microsoft Tai Le"));
  majorFont.append(newFont(a, "Talu", "Microsoft New Tai Lue"));
  majorFont.append(newFont(a, "Tfng", "Ebrima"));

  const minorFont = document.createElementNS(a, "minorFont");
  fontScheme.append(minorFont);

  font = document.createElementNS(a, "latin");
  font.setAttribute("typeface", "Calibri");
  font.setAttribute("panose", "020F0502020204030204");
  minorFont.append(font);

  font = document.createElementNS(a, "ea");
  font.setAttribute("typeface", "");
  minorFont.append(font);

  font = document.createElementNS(a, "cs");
  font.setAttribute("typeface", "");
  minorFont.append(font);

  minorFont.append(newFont(a, "Jpan", "游ゴシック"));
  minorFont.append(newFont(a, "Hang", "맑은 고딕"));
  minorFont.append(newFont(a, "Hans", "等线"));
  minorFont.append(newFont(a, "Hant", "新細明體"));
  minorFont.append(newFont(a, "Arab", "Arial"));
  minorFont.append(newFont(a, "Hebr", "Arial"));
  minorFont.append(newFont(a, "Thai", "Tahoma"));
  minorFont.append(newFont(a, "Ethi", "Nyala"));
  minorFont.append(newFont(a, "Beng", "Vrinda"));
  minorFont.append(newFont(a, "Gujr", "Shruti"));
  minorFont.append(newFont(a, "Khmr", "DaunPenh"));
  minorFont.append(newFont(a, "Knda", "Tunga"));
  minorFont.append(newFont(a, "Guru", "Raavi"));
  minorFont.append(newFont(a, "Cans", "Euphemia"));
  minorFont.append(newFont(a, "Cher", "Plantagenet Cherokee"));
  minorFont.append(newFont(a, "Yiii", "Microsoft Yi Baiti"));
  minorFont.append(newFont(a, "Tibt", "Microsoft Himalaya"));
  minorFont.append(newFont(a, "Thaa", "MV Boli"));
  minorFont.append(newFont(a, "Deva", "Mangal"));
  minorFont.append(newFont(a, "Telu", "Gautami"));
  minorFont.append(newFont(a, "Taml", "Latha"));
  minorFont.append(newFont(a, "Syrc", "Estrangelo Edessa"));
  minorFont.append(newFont(a, "Orya", "Kalinga"));
  minorFont.append(newFont(a, "Mlym", "Kartika"));
  minorFont.append(newFont(a, "Laoo", "DokChampa"));
  minorFont.append(newFont(a, "Sinh", "Iskoola Pota"));
  minorFont.append(newFont(a, "Mong", "Mongolian Baiti"));
  minorFont.append(newFont(a, "Viet", "Arial"));
  minorFont.append(newFont(a, "Uigh", "Microsoft Uighur"));
  minorFont.append(newFont(a, "Geor", "Sylfaen"));
  minorFont.append(newFont(a, "Armn", "Arial"));
  minorFont.append(newFont(a, "Bugi", "Leelawadee UI"));
  minorFont.append(newFont(a, "Bopo", "Microsoft JhengHei"));
  minorFont.append(newFont(a, "Java", "Javanese Text"));
  minorFont.append(newFont(a, "Lisu", "Segoe UI"));
  minorFont.append(newFont(a, "Mymr", "Myanmar Text"));
  minorFont.append(newFont(a, "Nkoo", "Ebrima"));
  minorFont.append(newFont(a, "Olck", "Nirmala UI"));
  minorFont.append(newFont(a, "Osma", "Ebrima"));
  minorFont.append(newFont(a, "Phag", "Phagspa"));
  minorFont.append(newFont(a, "Syrn", "Estrangelo Edessa"));
  minorFont.append(newFont(a, "Syrj", "Estrangelo Edessa"));
  minorFont.append(newFont(a, "Syre", "Estrangelo Edessa"));
  minorFont.append(newFont(a, "Sora", "Nirmala UI"));
  minorFont.append(newFont(a, "Tale", "Microsoft Tai Le"));
  minorFont.append(newFont(a, "Talu", "Microsoft New Tai Lue"));
  minorFont.append(newFont(a, "Tfng", "Ebrima"));

  const fmtScheme = document.createElementNS(a, "fmtScheme");
  fmtScheme.setAttribute("name", "Office");
  elements.append(fmtScheme);
  let styleList = document.createElementNS(a, "fillStyleLst");
  let fill = document.createElementNS(a, "solidFill");
  clr = document.createElementNS(a, "schemeClr");
  clr.setAttribute("val", "phClr");
  fill.append(clr);
  styleList.append(fill);

  fill = document.createElementNS(a, "gradFill");
  fill.setAttribute("rotWithShape", "1");
  let gsList = document.createElementNS(a, "gsLst");
  let gs = newGSPos(a, 0);
  gs.append(newSchemeColor(a, { lum: "110000", sat: "105000", tint: "67000" }));
  gsList.append(gs);
  gs = newGSPos(a, 50000);
  gs.append(newSchemeColor(a, { lum: "105000", sat: "103000", tint: "73000" }));
  gsList.append(gs);
  gs = newGSPos(a, 100000);
  gs.append(newSchemeColor(a, { lum: "105000", sat: "109000", tint: "81000" }));
  gsList.append(gs);
  fill.append(gsList);
  node = document.createElementNS(a, "lin");
  node.setAttribute("ang", "5400000");
  node.setAttribute("scaled", "0");
  fill.append(node);
  styleList.append(fill);

  fill = document.createElementNS(a, "gradFill");
  fill.setAttribute("rotWithShape", "1");
  gsList = document.createElementNS(a, "gsLst");
  gs = newGSPos(a, 0);
  gs.append(newSchemeColor(a, { lum: "102000", sat: "103000", tint: "94000" }));
  gsList.append(gs);
  gs = newGSPos(a, 50000);
  gs.append(
    newSchemeColor(a, { lum: "100000", sat: "110000", shade: "100000" })
  );
  gsList.append(gs);
  gs = newGSPos(a, 100000);
  gs.append(newSchemeColor(a, { lum: "99000", sat: "120000", shade: "78000" }));
  gsList.append(gs);
  fill.append(gsList);
  node = document.createElementNS(a, "lin");
  node.setAttribute("ang", "5400000");
  node.setAttribute("scaled", "0");
  fill.append(node);
  styleList.append(fill);

  fmtScheme.append(styleList);

  styleList = document.createElementNS(a, "lnStyleLst");

  let ln = document.createElementNS(a, "ln");
  ln.setAttribute("w", "6350");
  ln.setAttribute("cap", "flat");
  ln.setAttribute("cmpd", "sng");
  ln.setAttribute("algn", "ctr");
  clr = document.createElementNS(a, "schemeClr");
  clr.setAttribute("val", "phClr");
  fill = document.createElementNS(a, "solidFill");
  fill.append(clr);
  ln.append(fill);
  let prstDash = document.createElementNS(a, "prstDash");
  prstDash.setAttribute("val", "solid");
  ln.append(prstDash);
  let miter = document.createElementNS(a, "miter");
  miter.setAttribute("lim", "800000");
  ln.append(miter);
  styleList.append(ln);

  ln = document.createElementNS(a, "ln");
  ln.setAttribute("w", "12700");
  ln.setAttribute("cap", "flat");
  ln.setAttribute("cmpd", "sng");
  ln.setAttribute("algn", "ctr");
  clr = document.createElementNS(a, "schemeClr");
  clr.setAttribute("val", "phClr");
  fill = document.createElementNS(a, "solidFill");
  fill.append(clr);
  ln.append(fill);
  prstDash = document.createElementNS(a, "prstDash");
  prstDash.setAttribute("val", "solid");
  ln.append(prstDash);
  miter = document.createElementNS(a, "miter");
  miter.setAttribute("lim", "800000");
  ln.append(miter);
  styleList.append(ln);

  ln = document.createElementNS(a, "ln");
  ln.setAttribute("w", "19050");
  ln.setAttribute("cap", "flat");
  ln.setAttribute("cmpd", "sng");
  ln.setAttribute("algn", "ctr");
  clr = document.createElementNS(a, "schemeClr");
  clr.setAttribute("val", "phClr");
  fill = document.createElementNS(a, "solidFill");
  fill.append(clr);
  ln.append(fill);
  prstDash = document.createElementNS(a, "prstDash");
  prstDash.setAttribute("val", "solid");
  ln.append(prstDash);
  miter = document.createElementNS(a, "miter");
  miter.setAttribute("lim", "800000");
  ln.append(miter);
  styleList.append(ln);

  fmtScheme.append(styleList);

  styleList = document.createElementNS(a, "effectStyleLst");

  let effectStyle = document.createElementNS(a, "effectStyle");
  let effectLst = document.createElementNS(a, "effectLst");
  effectStyle.append(effectLst);
  styleList.append(effectStyle);
  styleList.append(effectStyle.cloneNode(true));

  effectStyle = effectStyle.cloneNode(false);
  effectLst = effectLst.cloneNode();
  let outerShdw = document.createElementNS(a, "outerShdw");
  outerShdw.setAttribute("blurRad", "57150");
  outerShdw.setAttribute("dist", "19050");
  outerShdw.setAttribute("dir", "5400000");
  outerShdw.setAttribute("algn", "ctr");
  outerShdw.setAttribute("rotWithShape", "0");
  clr = document.createElementNS(a, "srgbClr");
  clr.setAttribute("val", "000000");
  let alpha = document.createElementNS(a, "alpha");
  alpha.setAttribute("val", "63000");
  clr.append(alpha);
  outerShdw.append(clr);
  effectLst.append(outerShdw);
  effectStyle.append(effectLst);
  styleList.append(effectStyle);

  fmtScheme.append(styleList);

  styleList = document.createElementNS(a, "bgFillStyleLst");
  fill = document.createElementNS(a, "solidFill");
  clr = document.createElementNS(a, "schemeClr");
  clr.setAttribute("val", "phClr");
  fill.append(clr);
  styleList.append(fill);

  fill = document.createElementNS(a, "solidFill");
  clr = document.createElementNS(a, "schemeClr");
  fill.append(newSchemeColor(a, { tint: "95000", sat: "170000" }));
  styleList.append(fill);

  fill = document.createElementNS(a, "gradFill");
  fill.setAttribute("rotWithShape", "1");
  gsList = document.createElementNS(a, "gsLst");
  gs = newGSPos(a, 0);
  gs.append(
    newSchemeColor(a, {
      tint: "93000",
      sat: "150000",
      shade: "98000",
      lum: "102000",
    })
  );
  gsList.append(gs);
  gs = newGSPos(a, 50000);
  gs.append(
    newSchemeColor(a, {
      tint: "98000",
      sat: "130000",
      shade: "90000",
      lum: "103000",
    })
  );
  gsList.append(gs);
  gs = newGSPos(a, 100000);
  gs.append(newSchemeColor(a, { sat: "120000", shade: "63000" }));
  gsList.append(gs);
  fill.append(gsList);
  node = document.createElementNS(a, "lin");
  node.setAttribute("ang", "5400000");
  node.setAttribute("scaled", "0");
  fill.append(node);
  styleList.append(fill);

  fmtScheme.append(styleList);
  themeRoot.append(elements);

  node = document.createElementNS(a, "objectDefaults");
  themeRoot.append(node);

  node = document.createElementNS(a, "extraClrSchemeLst");
  themeRoot.append(node);

  const extLst = document.createElementNS(a, "extLst");
  const ext = document.createElementNS(a, "ext");
  ext.setAttribute("uri", "{05A4C25C-085E-4340-85A3-A5531E510DB2}");

  const themeFamily = document.createElementNS(thm15, "themeFamily");
  themeFamily.setAttributeNS(xmlns, "xmlns:thm15", thm15);
  themeFamily.setAttribute("name", "Office Theme");
  themeFamily.setAttribute("id", "{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}");
  themeFamily.setAttribute("vid", "{4A3C46E8-61CC-4603-A589-7422A47A8E4A}");
  ext.append(themeFamily);
  extLst.append(ext);

  themeRoot.append(extLst);
  return {
    "xl/theme/theme1.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function newFont(ns, script, typeface) {
  const font = document.createElementNS(ns, "font");
  font.setAttribute("script", script);
  font.setAttribute("typeface", typeface);
  return font;
}

function newSchemeColor(ns, options) {
  const clr = document.createElementNS(ns, "schemeClr");
  clr.setAttribute("val", "phClr");
  const lumMod = document.createElementNS(ns, "lumMod");
  lumMod.setAttribute("val", options.lum ? options.lum : "");
  const satMod = document.createElementNS(ns, "satMod");
  satMod.setAttribute("val", options.sat ? options.sat : "");
  const tintEl = document.createElementNS(ns, "tint");
  tintEl.setAttribute("val", options.tint ? options.tint : "");
  const shadeEl = document.createElementNS(ns, "shade");
  shadeEl.setAttribute("val", options.shade ? options.shade : "");
  if (options.lum) clr.append(lumMod);
  if (options.sat) clr.append(satMod);
  if (options.tint) clr.append(tintEl);
  if (options.shade) clr.append(shadeEl);
  return clr;
}

function newGSPos(ns, pos) {
  const gs = document.createElementNS(ns, "gs");
  gs.setAttribute("pos", pos);
  return gs;
}

function xlCreateWorkbook() {
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const r =
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const mc = "http://schemas.openxmlformats.org/markup-compatibility/2006";
  const x15 = "http://schemas.microsoft.com/office/spreadsheetml/2010/11/main";
  const xr = "http://schemas.microsoft.com/office/spreadsheetml/2014/revision";
  const xr6 =
    "http://schemas.microsoft.com/office/spreadsheetml/2016/revision6";
  const xr10 =
    "http://schemas.microsoft.com/office/spreadsheetml/2016/revision10";
  const xr2 =
    "http://schemas.microsoft.com/office/spreadsheetml/2015/revision2";

  const docRoot = document.implementation.createDocument(ns, "workbook");
  const worksheets = docRoot.documentElement;
  worksheets.setAttributeNS(xmlns, "xmlns:r", r);
  worksheets.setAttributeNS(xmlns, "xmlns:mc", mc);
  worksheets.setAttributeNS(mc, "Ignorable", "x15 xr xr6 xr10 xr2");
  worksheets.setAttributeNS(xmlns, "xmlns:x15", x15);
  worksheets.setAttributeNS(xmlns, "xmlns:xr", xr);
  worksheets.setAttributeNS(xmlns, "xmlns:xr6", xr6);
  worksheets.setAttributeNS(xmlns, "xmlns:xr10", xr10);
  worksheets.setAttributeNS(xmlns, "xmlns:xr2", xr2);

  let node = document.createElementNS(ns, "fileVersion");
  node.setAttribute("appName", "xl");
  node.setAttribute("lastEdited", "7");
  node.setAttribute("lowestEdited", "7");
  node.setAttribute("rupBuild", "25726");

  worksheets.append(node);

  node = document.createElementNS(ns, "workbookPr");
  node.setAttribute("defaultThemeVersion", "166925");
  worksheets.append(node);

  node = document.createElementNS(mc, "AlternateContent");
  node.setAttributeNS(xmlns, "xmlns:mc", mc);
  worksheets.append(node);

  const choice = document.createElementNS(mc, "Choice");
  choice.setAttribute("Requires", "x15");
  const x15ac = "http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac";
  const absPath = document.createElementNS(x15ac, "absPath");
  absPath.setAttribute("url", "C:\\Temp\\sorkk\\");
  absPath.setAttributeNS(xmlns, "xmlns:x15ac", x15ac);
  choice.append(absPath);
  node.append(choice);
  worksheets.append(node);

  node = document.createElementNS(xr, "revisionPtr");
  node.setAttribute("revIDLastSave", "0");
  node.setAttribute("documentId", "8_{" + UUID() + "}");
  node.setAttributeNS(xr6, "coauthVersionLast", "47");
  node.setAttributeNS(xr6, "coauthVersionMax", "47");
  node.setAttributeNS(
    xr10,
    "uidLastSave",
    "{00000000-0000-0000-0000-000000000000}"
  );
  worksheets.append(node);

  node = document.createElementNS(ns, "bookViews");
  const workbookView = document.createElementNS(ns, "workbookView");
  workbookView.setAttribute("xWindow", "390");
  workbookView.setAttribute("yWindow", "390");
  workbookView.setAttribute("windowWidth", "38160");
  workbookView.setAttribute("windowHeight", "20640");
  workbookView.setAttributeNS(
    xr2,
    "uid",
    "{187A1CB2-544C-4454-8DF2-1F2656C9F38F}"
  );
  node.append(workbookView);
  worksheets.append(node);

  node = document.createElementNS(ns, "sheets");
  const sheet = document.createElementNS(ns, "sheet");
  sheet.setAttribute("name", "Sheet1");
  sheet.setAttribute("sheetId", "1");
  sheet.setAttributeNS(r, "id", "rId1");
  node.append(sheet);
  worksheets.append(node);

  node = document.createElementNS(ns, "calcPr");
  node.setAttribute("calcId", "191029");
  worksheets.append(node);

  node = document.createElementNS(ns, "extLst");
  let ext = document.createElementNS(ns, "ext");
  ext.setAttribute("uri", "{140A7094-0E35-4892-8432-C4D2E57EDEB5}");
  ext.setAttributeNS(xmlns, "xmlns:x15", x15);
  let feature = document.createElementNS(x15, "workbookPr");
  feature.setAttribute("chartTrackingRefBase", "1");
  ext.append(feature);
  node.append(ext);
  ext = document.createElementNS(ns, "ext");
  ext.setAttribute("uri", "{B58B0392-4F1F-4190-BB64-5DF3571DCE5F}");
  const xcalcf =
    "http://schemas.microsoft.com/office/spreadsheetml/2018/calcfeatures";
  ext.setAttributeNS(xmlns, "xmlns:xcalcf", xcalcf);
  const features = document.createElementNS(xcalcf, "calcFeatures");
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:RD");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:Single");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:FV");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:CNMTM");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:LET_WF");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:LAMBDA_WF");
  features.append(feature);
  feature = document.createElementNS(xcalcf, "feature");
  feature.setAttribute("name", "microsoft.com:ARRAYTEXT_WF");
  features.append(feature);
  ext.append(features);
  node.append(ext);
  worksheets.append(node);

  return {
    "xl/workbook.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateStyles() {
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const r =
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const mc = "http://schemas.openxmlformats.org/markup-compatibility/2006";
  const x14 = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/main";
  const x14ac = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac";
  const x15 = "http://schemas.microsoft.com/office/spreadsheetml/2010/11/main";
  const x16r2 =
    "http://schemas.microsoft.com/office/spreadsheetml/2015/02/main";
  const xr = "http://schemas.microsoft.com/office/spreadsheetml/2014/revision";
  const xr2 =
    "http://schemas.microsoft.com/office/spreadsheetml/2015/revision2";
  const xr3 =
    "http://schemas.microsoft.com/office/spreadsheetml/2016/revision3";

  const docRoot = document.implementation.createDocument(ns, "styleSheet");
  const styles = docRoot.documentElement;
  styles.setAttributeNS(xmlns, "xmlns:r", r);
  styles.setAttributeNS(xmlns, "xmlns:mc", mc);
  styles.setAttributeNS(mc, "Ignorable", "x14ac x16r2 xr");
  styles.setAttributeNS(xmlns, "xmlns:x14ac", x15);
  styles.setAttributeNS(xmlns, "xmlns:x16r2", x16r2);
  styles.setAttributeNS(xmlns, "xmlns:xr", xr);

  let node = document.createElementNS(ns, "fonts");
  node.setAttribute("count", 2);
  node.setAttributeNS(x14ac, "knownFonts", "1");
  let font = document.createElementNS(ns, "font");
  let prop = document.createElementNS(ns, "sz");
  prop.setAttribute("val", "11");
  font.append(prop);
  prop = document.createElementNS(ns, "color");
  prop.setAttribute("theme", "1");
  font.append(prop);
  prop = document.createElementNS(ns, "name");
  prop.setAttribute("val", "Calibri");
  font.append(prop);
  prop = document.createElementNS(ns, "family");
  prop.setAttribute("val", "2");
  font.append(prop);
  prop = document.createElementNS(ns, "scheme");
  prop.setAttribute("val", "minor");
  font.append(prop);
  node.append(font);
  node.append(font.cloneNode(true));
  font.append(document.createElementNS(ns, "b"));
  styles.append(node);

  node = document.createElementNS(ns, "fills");
  node.setAttribute("count", "2");
  let fill = document.createElementNS(ns, "fill");
  prop = document.createElementNS(ns, "patternFill");
  prop.setAttribute("patternType", "none");
  fill.append(prop);
  node.append(fill);

  fill = document.createElementNS(ns, "fill");
  prop = document.createElementNS(ns, "patternFill");
  prop.setAttribute("patternType", "gray125");
  fill.append(prop);
  node.append(fill);
  styles.append(node);

  node = document.createElementNS(ns, "borders");
  node.setAttribute("count", 1);
  prop = document.createElementNS(ns, "border");
  prop.append(document.createElementNS(ns, "left"));
  prop.append(document.createElementNS(ns, "right"));
  prop.append(document.createElementNS(ns, "top"));
  prop.append(document.createElementNS(ns, "bottom"));
  prop.append(document.createElementNS(ns, "diagonal"));
  node.append(prop);
  styles.append(node);

  node = document.createElementNS(ns, "cellStyleXfs");
  node.setAttribute("count", "1");
  prop = document.createElementNS(ns, "xf");
  prop.setAttribute("numFmtId", "0");
  prop.setAttribute("fontId", "0");
  prop.setAttribute("fillId", "0");
  prop.setAttribute("borderId", "0");
  node.append(prop);
  styles.append(node);

  node = document.createElementNS(ns, "cellXfs");
  node.setAttribute("count", 4);
  prop = document.createElementNS(ns, "xf");
  prop.setAttribute("numFmtId", "0");
  prop.setAttribute("fontId", "0");
  prop.setAttribute("fillId", "0");
  prop.setAttribute("borderId", "0");
  node.append(prop);
  prop = document.createElementNS(ns, "xf");
  prop.setAttribute("numFmtId", "0");
  prop.setAttribute("fontId", "1");
  prop.setAttribute("fillId", "0");
  prop.setAttribute("borderId", "0");
  prop.setAttribute("applyFont", "1");
  prop.setAttribute("applyAlignment", "1");
  let subprop = document.createElementNS(ns, "alignment");
  subprop.setAttribute("horizontal", "left");
  subprop.setAttribute("vertical", "top");
  subprop.setAttribute("wrapText", "1");
  prop.append(subprop);
  node.append(prop);
  prop = document.createElementNS(ns, "xf");
  prop.setAttribute("numFmtId", "0");
  prop.setAttribute("fontId", "0");
  prop.setAttribute("fillId", "0");
  prop.setAttribute("borderId", "0");
  prop.setAttribute("applyAlignment", "1");
  subprop = document.createElementNS(ns, "alignment");
  subprop.setAttribute("vertical", "center");
  subprop.setAttribute("horizontal", "center");
  subprop.setAttribute("wrapText", "1");
  prop.append(subprop);
  node.append(prop);
  prop = document.createElementNS(ns, "xf");
  prop.setAttribute("numFmtId", "0");
  prop.setAttribute("fontId", "1");
  prop.setAttribute("fillId", "0");
  prop.setAttribute("borderId", "0");
  prop.setAttribute("applyFont", "1");
  prop.setAttribute("applyAlignment", "1");
  subprop = document.createElementNS(ns, "alignment");
  subprop.setAttribute("horizontal", "center");
  subprop.setAttribute("vertical", "center");
  subprop.setAttribute("wrapText", "1");
  prop.append(subprop);
  node.append(prop);
  styles.append(node);

  node = document.createElementNS(ns, "cellStyles");
  node.setAttribute("count", "1");
  prop = document.createElementNS(ns, "cellStyle");
  prop.setAttribute("name", "Normal");
  prop.setAttribute("xfId", "0");
  prop.setAttribute("builtinId", "0");
  node.append(prop);
  styles.append(node);

  node = document.createElementNS(ns, "dxfs");
  node.setAttribute("count", "0");
  styles.append(node);

  node = document.createElementNS(ns, "tableStyles");
  node.setAttribute("count", "0");
  node.setAttribute("defaultTableStyle", "TableStyleMedium2");
  node.setAttribute("defaultPivotStyle", "PivotStyleLight16");
  styles.append(node);

  node = document.createElementNS(ns, "extLst");
  prop = document.createElementNS(ns, "ext");
  prop.setAttribute("uri", "{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}");
  prop.setAttributeNS(xmlns, "xmlns:x14", x14);
  subprop = document.createElementNS(x14, "slicerStyles");
  subprop.setAttribute("defaultSlicerStyle", "SlicerStyleLight1");
  prop.append(subprop);
  node.append(prop);
  prop = document.createElementNS(ns, "ext");
  prop.setAttribute("uri", "{9260A510-F301-46a8-8635-F512D64BE5F5}");
  prop.setAttributeNS(xmlns, "xmlns:x15", x15);
  subprop = document.createElementNS(x15, "timlineStyles");
  subprop.setAttribute("defaultTimelinenStyle", "TimeSlicerStyleLight1");
  prop.append(subprop);
  node.append(prop);
  styles.append(node);

  return {
    "xl/styles.xml": XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateSharedStrings(sharedStrings, stringsCount) {
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const docRoot = document.implementation.createDocument(ns, "sst");
  const sst = docRoot.documentElement;
  sst.setAttribute("count", stringsCount);
  sst.setAttribute("uniqueCount", sharedStrings.length);

  const textNode = function (str) {
    const si = document.createElementNS(ns, "si");
    const t = document.createElementNS(ns, "t");
    t.append(document.createTextNode(str));
    si.append(t);
    return si;
  };

  sharedStrings.forEach((text) => {
    sst.appendChild(textNode(text));
  });

  return {
    "xl/sharedStrings.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateContentTypes() {
  const ns = "http://schemas.openxmlformats.org/package/2006/content-types";
  const docRoot = document.implementation.createDocument(ns, "Types");
  const types = docRoot.documentElement;
  let node = document.createElementNS(ns, "Default");
  node.setAttribute("Extension", "rels");
  node.setAttribute(
    "ContentType",
    "application/vnd.openxmlformats-package.relationships+xml"
  );
  types.append(node);

  node = document.createElementNS(ns, "Default");
  node.setAttribute("Extension", "xml");
  node.setAttribute("ContentType", "application/xml");
  types.append(node);

  const override = function (partName, contentType) {
    const n = document.createElementNS(ns, "Override");
    n.setAttribute("PartName", partName);
    n.setAttribute("ContentType", contentType);
    return n;
  };

  types.append(
    override(
      "/xl/workbook.xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"
    )
  );
  types.append(
    override(
      "/xl/worksheets/sheet1.xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"
    )
  );
  types.append(
    override(
      "/xl/theme/theme1.xml",
      "application/vnd.openxmlformats-officedocument.theme+xml"
    )
  );
  types.append(
    override(
      "/xl/styles.xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"
    )
  );
  types.append(
    override(
      "/xl/sharedStrings.xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"
    )
  );
  types.append(
    override(
      "/docProps/core.xml",
      "application/vnd.openxmlformats-package.core-properties+xml"
    )
  );
  types.append(
    override(
      "/docProps/app.xml",
      "application/vnd.openxmlformats-officedocument.extended-properties+xml"
    )
  );

  return {
    "[Content_Types].xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function xlCreateWorksheet(tableId) {
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const r =
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const mc = "http://schemas.openxmlformats.org/markup-compatibility/2006";
  const x14ac = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac";
  const xr = "http://schemas.microsoft.com/office/spreadsheetml/2014/revision";
  const xr2 =
    "http://schemas.microsoft.com/office/spreadsheetml/2015/revision2";
  const xr3 =
    "http://schemas.microsoft.com/office/spreadsheetml/2016/revision3";

  const docRoot = document.implementation.createDocument(ns, "worksheet");
  const sheet = docRoot.documentElement;
  sheet.setAttributeNS(xmlns, "xmlns:r", r);
  sheet.setAttributeNS(xmlns, "xmlns:mc", mc);
  sheet.setAttributeNS(mc, "Ignorable", "x14ac xr xr2 xr3");
  sheet.setAttributeNS(xmlns, "xmlns:x14ac", x14ac);
  sheet.setAttributeNS(xmlns, "xmlns:xr", xr);
  sheet.setAttributeNS(xmlns, "xmlns:xr2", xr2);
  sheet.setAttributeNS(xmlns, "xmlns:xr3", xr3);
  sheet.setAttributeNS(xr, "uid", "{03A428F4-4357-45F3-A061-8AD5C5DD8E68}");

  const sheetViews = document.createElementNS(ns, "sheetViews");
  const sheetView = document.createElementNS(ns, "sheetView");
  sheetView.setAttribute("workbookViewId", "0");
  sheetViews.appendChild(sheetView);

  const sheetData = document.createElementNS(ns, "sheetData");
  const mergeCells = document.createElementNS(ns, "mergeCells");

  const dimension = document.createElementNS(ns, "dimension");

  const table = document.getElementById(tableId);

  const sharedStrings = [];
  let stringsCount = 0;

  const parseTable = function (node, cursor) {
    console.log("new Node: ", node.nodeName);
    if (node.nodeName === "TR") {
      cursor.nextRow();
      console.log("new row");
    } else if (node.nodeName === "TD" || node.nodeName === "TH") {
      let spans = Number(node.getAttribute("colspan"));
      spans = spans > 0 ? spans : 1;

      console.log(cursor.asCell(), spans, node.innerText, cursor.asCell(1));
      let index = sharedStrings.indexOf(node.innerText);

      if (index < 0) {
        index = sharedStrings.length;
        sharedStrings.push(node.innerText);
      }
      stringsCount += 1;

      let col = document.createElementNS(ns, "c");
      col.setAttribute("r", cursor.asCell());
      col.setAttribute("s", node.nodeName === "TH" ? 2 : 1);
      col.setAttribute("t", "s");
      const v = document.createElementNS(ns, "v");
      v.appendChild(document.createTextNode(index.toString()));
      v.innerText = index.toString();
      col.appendChild(v);
      cursor.node.appendChild(col);

      for (var span = 1; span < spans; span++) {
        col = document.createElementNS(ns, "c");
        col.setAttribute("r", cursor.asCell(span));
        col.setAttribute("s", 2);
        cursor.node.appendChild(col);
      }

      cursor.nextCol(spans);
    }

    for (var child of node.children) {
      parseTable(child, cursor);
    }
  };

  const cursor = {
    row: 0,
    col: 0,
    maxCol: 0,
    mergeCells: [],
    nodes: [],
    node: undefined,
    inThead: false,
    nextCol: function (spans) {
      if (spans > 1) {
        let mergeCells = this.asCell() + ":";
        this.col += spans - 1;
        mergeCells += this.asCell();
        console.log(mergeCells);
        this.mergeCells.push(mergeCells);
      }
      this.col += 1;
      this.maxCol = Math.max(this.col, this.maxCol);
    },
    nextRow: function () {
      if (this.node !== undefined) {
        this.node.setAttribute("spans", "1:" + this.col.toString());
      }
      this.row += 1;
      this.node = document.createElementNS(ns, "row");
      this.nodes.push(this.node);
      this.node.setAttribute("r", this.row);
      this.col = 0;
    },
    asCell: function (col_offset, row_offset) {
      if (col_offset === undefined) {
        col_offset = 0;
      }
      if (row_offset === undefined) {
        row_offset = 0;
      }
      return (
        String.fromCharCode(65 + this.col + col_offset) +
        (this.row + row_offset).toString()
      );
    },
  };

  for (var node of table.children) {
    parseTable(node, cursor);
  }
  cursor.nodes.forEach((node) => {
    sheetData.appendChild(node);
  });
  cursor.mergeCells.forEach((ref) => {
    const cell = document.createElementNS(ns, "mergeCell");
    cell.setAttribute("ref", ref);
    mergeCells.appendChild(cell);
  });

  dimension.setAttribute("ref", "A1:" + cursor.asCell(-1));

  sheet.appendChild(dimension);
  sheet.appendChild(sheetViews);
  sheet.appendChild(sheetData);
  sheet.appendChild(mergeCells);

  return {
    ...xlCreateSharedStrings(sharedStrings, stringsCount),
    "xl/worksheets/sheet1.xml":
      XMLHeader + new XMLSerializer().serializeToString(docRoot),
  };
}

function UUID() {
  const a = function () {
    return Math.round(Math.random() * 0xefff + 0x1000).toString(16);
  };
  const b = function () {
    return Math.round(Math.random() * 0x4f + 0x10).toString(16);
  };
  const c = function () {
    return Math.round(Math.random() * 0xef + 0x10).toString(16);
  };

  return (
    a() +
    a() +
    "-" +
    a() +
    "-" +
    b() +
    c() +
    "-" +
    b() +
    c() +
    "-" +
    a() +
    a() +
    a()
  ).toUpperCase();
}

function exportXLSX(tableId, filename) {
    const files = {
      ...xlCreateContentTypes(),
      ...xlCreateRels(),
      ...xlCreateAppDocProps(),
      ...xlCreateCoreDocProps(),
      ...xlCreateWorkbookRels(),
      ...xlCreateTheme(),
      ...xlCreateStyles(),
      ...xlCreateWorkbook(),
      ...xlCreateWorksheet(tableId)
    }
    const zip = new JSZip()
    Object.keys(files).forEach((filename) => {
        zip.file(filename, files[filename])
    } )
    zip.generateAsync({type:"blob"})
    .then(function (blob) {
        saveAs(blob, filename);
    });
  }