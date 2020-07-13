export class Dom {
  static addChild(child: HTMLElement, parent: HTMLElement = document.body): void {
    parent.appendChild(child);
  }

  private static async addScript(child: HTMLScriptElement, parent: HTMLElement = document.body): Promise<boolean> {
    return new Promise((resolve, reject) => {
      child.addEventListener('load', () => {
        resolve(true);
      });

      child.addEventListener('error', () => {
        reject(new Error(`${child.src} failed to load.`))
      });

      parent.appendChild(child);
    });
  }

  static async addScriptbyUrl(url: string, parent: HTMLElement = document.body): Promise<boolean> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = url;
    return Dom.addScript(script, parent);
  }
}
