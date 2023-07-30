import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';

export class UsePuppeteer {
  async createInstance(options: PuppeteerLaunchOptions) {
    const browser = await puppeteer.launch(options);
    const useBrowser: UseBrowser = Object.assign(browser, {
      newSessionPage: new UseBrowser().newSessionPage
    });

    return useBrowser;
  }
}

export class UseBrowser extends Browser {
  public async newSessionPage(): Promise<Page> {
    const page = await this.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    return page;
  }
}
