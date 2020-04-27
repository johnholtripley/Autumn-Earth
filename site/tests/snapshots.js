// https://docs.percy.io/docs/percyscript
const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
  await page.goto('https://www.autumnearth.com/');
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor('#footer');
  await percySnapshot('homepage', { widths: [420, 768, 980, 1200] });
  await page.click("#menuToggle");
  await page.waitFor(501);
  await percySnapshot('homepage with menu open', { widths: [420, 768] });
});