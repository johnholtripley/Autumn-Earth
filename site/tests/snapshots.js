// https://docs.percy.io/docs/percyscript
const PercyScript = require('@percy/script');
const browser = await puppeteer.launch({headless: false});

PercyScript.run(async (page, percySnapshot) => {
  await page.goto('https://www.autumnearth.com/');
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor('#footer');
  await percySnapshot('homepage', { widths: [420, 768, 980, 1200] });
});