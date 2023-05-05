const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    slowMo: 100,
  });
  const context = await browser.newContext({
    viewport: {
      width: 1388,
      height: 768,
    },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    permissions: ["clipboard-read", "clipboard-write"],
  });

  const page = await context.newPage();

  // Randomize the time intervals between actions

  await page.goto("");

  const maxScreenWidth = await page.evaluate(
    () => document.documentElement.scrollWidth
  );
  const maxScreenHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );

  const randomWait = () => Math.floor(Math.random() * 500) + 500;

  const randomClickPos = () => ({
    x: parseInt(Math.floor(Math.random() * maxScreenWidth)),
    y: parseInt(Math.floor(Math.random() * maxScreenHeight)),
  });

  await page.waitForTimeout(1000); // wait for 1 second

  for (let i = 0; i < 10; i++) {
    await page.mouse.click(...Object.values(randomClickPos()));
    await page.waitForTimeout(250);
  }

  const inputData = ""; // replace with your data

  const inputSelector = "";
  const buttonSelector = "";

  const inputField = await page.waitForSelector(inputSelector);
  const inputFieldPosition = await inputField.boundingBox();
  const inputFieldX =
    inputFieldPosition.x + Math.floor(inputFieldPosition.width / 2);
  const inputFieldY =
    inputFieldPosition.y + Math.floor(inputFieldPosition.height / 2);

  await page.mouse.click(inputFieldX, inputFieldY);
  await page.waitForTimeout(250);

  await page.keyboard.type(inputData, { delay: 100 });
  await page.waitForTimeout(250); // wait for 1 second

  const button = await page.waitForSelector(buttonSelector);
  const buttonPosition = await button.boundingBox();
  const buttonX = buttonPosition.x + Math.floor(buttonPosition.width / 2);
  const buttonY = buttonPosition.y + Math.floor(buttonPosition.height / 2);

  await page.mouse.click(buttonX, buttonY);
  await page.waitForTimeout(250); // wait for 1 second

  // await browser.close();

  await page.keyboard.down("Control");
  await page.keyboard.down("Shift");
  await page.keyboard.press("i");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Control");

  const devTools = await context.newCDPSession(page);
  await devTools.send("Runtime.enable");
  await devTools.send("Console.enable");

  await page.keyboard.down("Control");
  await page.keyboard.down("Shift");
  await page.keyboard.press("i");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Control");

  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
  await page.waitForTimeout(250); // wait for 1 second
})();
