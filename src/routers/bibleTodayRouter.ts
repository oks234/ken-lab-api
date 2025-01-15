import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/cbs", async (req, res) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(
    "http://www.somyung.or.kr/modu/media_board/list.asp?board_idx=3&sub_idx=1&lef=02"
  );

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  const firstAnchorHandle = await page.$(".media_board_list_sbj");
  const href = await firstAnchorHandle?.evaluate((el) =>
    el.getAttribute("href")
  );

  // if (!href) {
  //   await browser.close();
  //   return res.sendStatus(404);
  // }

  await page.goto("http://www.somyung.or.kr/modu/media_board/" + href);

  const audioBtnHandle = await page.$(".media_read_vod_btn_view");
  const onclickAttr = await audioBtnHandle?.evaluate((el) =>
    el.getAttribute("onclick")
  );
  const path = onclickAttr?.split(",").at(2)?.replaceAll("'", "");

  // if (!path) {
  //   await browser.close();
  //   return res.sendStatus(404);
  // }

  await browser.close();

  const isoDate = new Date(new Date().toLocaleDateString()).toISOString();
  const mp3 = "https://idcmedia.com/" + path;

  res.json({ isoDate, mp3 });
});

router.get("/", async (req, res) => {
  const 번역 = req.query["번역"] ?? "개역개정";

  console.log({ 번역 });

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://sum.su.or.kr:8888/bible/today");

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  const isoDate = new Date(new Date().toLocaleDateString()).toISOString();
  const rangeElHandle = await page.$("#bibleinfo_box");
  const rangeTxt = await rangeElHandle?.evaluate((el) => el.textContent);
  const execResult = /.+\:\s(.+)\((.+)\)(.+)\s찬.+/.exec(rangeTxt ?? "");
  const [_, koTitle, enTitle, range] = execResult ?? ["", "", "", ""];
  if (번역 === "새번역") {
    const radioAreas = await page.$$(".raio_area");
    if (radioAreas) {
      await radioAreas[1]?.click();
    }
    await page.waitForNetworkIdle();
  }
  const verseElHandles = await page.$$("#body_list > li");
  const verses: { num: number; info: string }[] = [];
  for (let i = 0; i < verseElHandles.length; i++) {
    const verseElHandle = verseElHandles[i];
    const verse = await verseElHandle.evaluate((el) => {
      const numEl = el.querySelector(".num");
      const infoEl = el.querySelector(".info");
      return {
        num: parseInt(numEl?.textContent ?? "0"),
        info: infoEl?.textContent ?? "",
      };
    });
    verses.push(verse);
  }

  await browser.close();

  res.json({ isoDate, koTitle, enTitle, range, verses });
});

export default router;
