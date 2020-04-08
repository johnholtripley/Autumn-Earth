// https://docs.percy.io/docs/percyscript
const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
  await page.goto('http://localhost/');
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor('#footer');
  await percySnapshot('homepage', { widths: [420, 768, 980, 1200] });
});