import puppeteer, { Browser, BrowserContext, Page, PuppeteerLaunchOptions } from 'puppeteer';

const browsers: Browser[] = [];

process.on('exit', function () {
  for (const browser of browsers) {
    browser.close();
  }
});

export class UsePuppeteer {
  static async createInstance(options: PuppeteerLaunchOptions) {
    const browser = await puppeteer.launch(options);
    const useBrowser: UseBrowser = Object.assign(await browser.createIncognitoBrowserContext(), {
      newSessionPage: new UseBrowser().newSessionPage
    });

    browsers.push(browser);
    return useBrowser;
  }
}

export class UseBrowser extends BrowserContext {
  public async newSessionPage(): Promise<Page> {
    const page = await this.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    return page;
  }
}
